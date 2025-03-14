import React, { useState, useEffect } from 'react';
import { Lost_Pet_Finder_backend } from '../../declarations/Lost_Pet_Finder_backend';

function App() {
  // State for pet form fields (removed petId since it's auto-generated now)
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [breed, setBreed] = useState('');
  const [color, setColor] = useState('');
  const [height, setHeight] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Lost');
  const [date, setDate] = useState('');
  const [area, setArea] = useState('');

  // For finding a pet by ID (separate from form)
  const [searchId, setSearchId] = useState('');

  // State for UI management
  const [message, setMessage] = useState('');
  const [allPets, setAllPets] = useState([]); 
  const [viewMode, setViewMode] = useState('all'); // 'all', 'lost', 'found'
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all pets on component mount
  useEffect(() => {
    fetchPets();
  }, [viewMode]);

  const clearForm = () => {
    setPetName('');
    setPetType('');
    setBreed('');
    setColor('');
    setHeight('');
    setLocation('');
    setCategory('Lost');
    setDate('');
    setArea('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Saving pet information...');
    
    try {
      // Validate required fields
      if (!petName || !category) {
        setMessage('Name and Category are required fields');
        setLoading(false);
        return;
      }
      
      // Create pet input object (without ID since it will be auto-generated)
      const petInput = {
        name: petName,
        petType: petType,
        breed: breed,
        color: color,
        height: height,
        location: location,
        category: category,
        date: date,
        area: area
      };
      
      // Call the updated backend function that returns the generated ID
      const generatedId = await Lost_Pet_Finder_backend.addPet(petInput);
      setMessage(`Pet information saved successfully! Assigned ID: ${generatedId}`);
      clearForm();
      fetchPets();
    } catch (error) {
      setMessage(`Error saving pet information: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetPet = async () => {
    if (!searchId) {
      setMessage('Please enter a pet ID to search');
      return;
    }
    
    setLoading(true);
    setMessage('Retrieving pet information...');
    
    try {
      const result = await Lost_Pet_Finder_backend.getPet(searchId);
      console.log("Pet result from backend:", result);
      
      if (!result || result.length === 0) {
        setMessage('Pet not found');
        setSelectedPet(null);
      } else {
        // Take the first element of the array, which contains the pet object
        setSelectedPet(result[0]);
        setMessage('Pet information retrieved successfully');
      }
    } catch (error) {
      console.error("Error retrieving pet:", error);
      setMessage(`Error retrieving pet information: ${error}`);
      setSelectedPet(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePet = async (id) => {
    if (!id) {
      setMessage('No pet ID specified for deletion');
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete pet with ID ${id}?`)) {
      return;
    }
    
    setLoading(true);
    setMessage('Deleting pet information...');
    
    try {
      await Lost_Pet_Finder_backend.deletePet(id);
      setMessage('Pet information deleted successfully!');
      setSelectedPet(null);
      fetchPets();
    } catch (error) {
      setMessage(`Error deleting pet information: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchPets = async () => {
    setLoading(true);
    try {
      let pets = [];
      
      if (viewMode === 'lost') {
        const lostPets = await Lost_Pet_Finder_backend.getPetsByCategory('Lost');
        pets = lostPets.map(pet => [pet.id, pet]);
      } else if (viewMode === 'found') {
        const foundPets = await Lost_Pet_Finder_backend.getPetsByCategory('Found');
        pets = foundPets.map(pet => [pet.id, pet]);
      } else {
        // Default: all pets
        pets = await Lost_Pet_Finder_backend.getAllPets();
      }
      
      setAllPets(pets);
    } catch (error) {
      setMessage(`Error fetching pets: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not specified';
    return dateStr;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Lost & Found Pet Finder</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pet Entry Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Register a Pet</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Pet Name*</label>
                <input 
                  type="text" 
                  value={petName} 
                  onChange={(e) => setPetName(e.target.value)} 
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Pet Type</label>
                <input 
                  type="text" 
                  value={petType} 
                  onChange={(e) => setPetType(e.target.value)} 
                  placeholder="Dog, Cat, Bird, etc." 
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Breed</label>
                <input 
                  type="text" 
                  value={breed} 
                  onChange={(e) => setBreed(e.target.value)} 
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Color</label>
                <input 
                  type="text" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)} 
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Height</label>
                <input 
                  type="text" 
                  value={height} 
                  onChange={(e) => setHeight(e.target.value)} 
                  placeholder="e.g., Small, Medium, Large or inches/cm" 
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Last Seen Location</label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Category*</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="Lost">Lost</option>
                  <option value="Found">Found</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Area/Neighborhood</label>
                <input 
                  type="text" 
                  value={area} 
                  onChange={(e) => setArea(e.target.value)} 
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <button 
                type="submit" 
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={loading}
              >
                Register Pet
              </button>
              
              <button 
                type="button" 
                onClick={clearForm} 
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Clear Form
              </button>
            </div>
          </form>
          
          {/* Pet Finder Section */}
          <div className="mt-6 p-4 border rounded bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Find a Pet by ID</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Pet ID"
                className="flex-grow p-2 border rounded"
              />
              <button
                onClick={handleGetPet}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
                disabled={loading || !searchId}
              >
                Find
              </button>
            </div>
          </div>
          
          {message && (
            <div className={`mt-4 p-3 rounded ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {message}
            </div>
          )}
          
          {selectedPet && (
            <div className="mt-6 p-4 border rounded bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">Selected Pet Details</h3>
              <div className="grid grid-cols-2 gap-2">
                <p><strong>ID:</strong> {selectedPet.id}</p>
                <p><strong>Name:</strong> {selectedPet.name}</p>
                <p><strong>Type:</strong> {selectedPet.petType || 'Not specified'}</p>
                <p><strong>Breed:</strong> {selectedPet.breed || 'Not specified'}</p>
                <p><strong>Color:</strong> {selectedPet.color || 'Not specified'}</p>
                <p><strong>Height:</strong> {selectedPet.height || 'Not specified'}</p>
                <p><strong>Location:</strong> {selectedPet.location || 'Not specified'}</p>
                <p><strong>Category:</strong> {selectedPet.category}</p>
                <p><strong>Date:</strong> {formatDate(selectedPet.date)}</p>
                <p><strong>Area:</strong> {selectedPet.area || 'Not specified'}</p>
              </div>
              <button 
                onClick={() => handleDeletePet(selectedPet.id)} 
                className="mt-3 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 text-sm"
              >
                Delete This Pet Record
              </button>
            </div>
          )}
        </div>
        
        {/* Pet Listings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Pet Listings</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode('all')} 
                className={`px-3 py-1 rounded text-sm ${viewMode === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                All
              </button>
              <button 
                onClick={() => setViewMode('lost')} 
                className={`px-3 py-1 rounded text-sm ${viewMode === 'lost' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Lost
              </button>
              <button 
                onClick={() => setViewMode('found')} 
                className={`px-3 py-1 rounded text-sm ${viewMode === 'found' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Found
              </button>
            </div>
          </div>
          
          {loading && viewMode !== 'pet-detail' ? (
            <p className="text-center py-10">Loading...</p>
          ) : allPets.length === 0 ? (
            <p className="text-center py-10 text-gray-500">No pets found in this category</p>
          ) : (
            <div className="overflow-y-auto max-h-96">
              {allPets.map((entry, index) => {
                const pet = entry[1];
                return (
                  <div key={index} className="mb-3 p-3 border rounded hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{pet.name}</h3>
                        <p className="text-xs text-gray-500">ID: {pet.id}</p>
                        <p className="text-sm text-gray-600">
                          {pet.petType} {pet.breed ? `- ${pet.breed}` : ''} • {pet.color || 'No color specified'}
                        </p>
                        <p className="text-sm mt-1">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${pet.category === 'Lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {pet.category}
                          </span>
                          {pet.date && <span className="ml-2">{formatDate(pet.date)}</span>}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {pet.area && <span>{pet.area}</span>}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            const petToView = entry[1];
                            setSelectedPet(petToView);
                            setSearchId(petToView.id); // Set the search ID to make it visible
                            setMessage('Pet details loaded from listing');
                          }} 
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleDeletePet(pet.id)} 
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;