import React, { useState, useEffect, useRef } from 'react';
import { Lost_Pet_Finder_backend } from '../../declarations/Lost_Pet_Finder_backend';
import { Principal } from '@dfinity/principal'; // Import Principal

function App() {
  // State for user authentication
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null); // Store Principal of logged-in user
  const [authMessage, setAuthMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // State for pet form fields (existing states)
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [breed, setBreed] = useState('');
  const [color, setColor] = useState('');
  const [height, setHeight] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Lost');
  const [date, setDate] = useState('');
  const [area, setArea] = useState('');
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // For finding a pet by ID (separate from form)
  const [searchId, setSearchId] = useState('');

  // State for UI management (existing states)
  const [message, setMessage] = useState('');
  const [allPets, setAllPets] = useState([]);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'lost', 'found'
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ref for the file input (existing ref)
  const fileInputRef = useRef(null);

  // Fetch all pets on component mount (existing useEffect)
  useEffect(() => {
    fetchPets();
  }, [viewMode, loggedInUser]); // Re-fetch pets when viewMode or loggedInUser changes

  // Clear form function (existing function)
  const clearForm = () => { /* ... existing clearForm function ... */
    setPetName('');
    setPetType('');
    setBreed('');
    setColor('');
    setHeight('');
    setLocation('');
    setCategory('Lost');
    setDate('');
    setArea('');
    setImages([]);
    setImageFiles([]);
    setImagePreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Image handling functions (existing functions: handleImageChange, removeImage, convertImageToBlob)
  const handleImageChange = (e) => { /* ... existing handleImageChange function ... */
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Limit to 5 images
    const selectedFiles = files.slice(0, 5);
    setImageFiles(prevFiles => [...prevFiles, ...selectedFiles].slice(0, 5));

    // Generate previews
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews].slice(0, 5));
  };

  const removeImage = (index) => { /* ... existing removeImage function ... */
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const convertImageToBlob = async (file) => { /* ... existing convertImageToBlob function ... */
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result;
        resolve(new Uint8Array(arrayBuffer));
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  // Handle pet submission (existing handleSubmit function, no changes needed for owner)
  const handleSubmit = async (e) => { /* ... existing handleSubmit function ... */
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

      // Convert images to blobs
      let imageBlobs = [];
      if (imageFiles.length > 0) {
        setMessage('Processing images...');
        try {
          const promises = imageFiles.map(file => convertImageToBlob(file));
          imageBlobs = await Promise.all(promises);
        } catch (err) {
          console.error("Error processing images:", err);
          setMessage(`Error processing images: ${err.message}`);
          setLoading(false);
          return;
        }
      }

      // Create pet input object
      const petInput = {
        name: petName,
        petType: petType,
        breed: breed,
        color: color,
        height: height,
        location: location,
        category: category,
        date: date,
        area: area,
        imageData: imageBlobs.length > 0 ? [imageBlobs] : null
      };

      // Call the backend function to add the pet (owner is automatically handled by backend)
      const generatedId = await Lost_Pet_Finder_backend.addPet(petInput);
      setMessage(`Pet information saved successfully! Assigned ID: ${generatedId}`);
      clearForm();
      fetchPets();
    } catch (error) {
      console.error("Error saving pet:", error);
      setMessage(`Error saving pet information: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle get pet by ID (existing handleGetPet function)
  const handleGetPet = async () => { /* ... existing handleGetPet function ... */
    if (!searchId) {
      setMessage('Please enter a pet ID to search');
      return;
    }

    setLoading(true);
    setMessage('Retrieving pet information...');

    try {
      const result = await Lost_Pet_Finder_backend.getPet(searchId);

      if (!result) {
        setMessage('Pet not found');
        setSelectedPet(null);
      } else {
        setSelectedPet(result);
        setMessage('Pet information retrieved successfully');
      }
    } catch (error) {
      console.error("Error retrieving pet:", error);
      setMessage(`Error retrieving pet information: ${error.message || error}`);
      setSelectedPet(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete pet (modified handleDeletePet function to check ownership in UI)
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
      const result = await Lost_Pet_Finder_backend.deletePet(id); // Backend handles ownership check
      if ('ok' in result) {
        setMessage('Pet information deleted successfully!');
        setSelectedPet(null);
        fetchPets();
      } else {
        setMessage(`Error deleting pet information: ${result.err}`); // Display error message from backend
      }
    } catch (error) {
      setMessage(`Error deleting pet information: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };


  // Fetch pets (existing fetchPets function, no changes needed)
  const fetchPets = async () => { /* ... existing fetchPets function ... */
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
      setMessage(`Error fetching pets: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  // Format date (existing formatDate function)
  const formatDate = (dateStr) => { /* ... existing formatDate function ... */
    if (!dateStr) return 'Not specified';
    return dateStr;
  };

  // Array buffer to base64 (existing arrayBufferToBase64 function)
  const arrayBufferToBase64 = (buffer) => { /* ... existing arrayBufferToBase64 function ... */
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  // Render pet images (existing renderPetImages function)
  const renderPetImages = (pet) => { /* ... existing renderPetImages function ... */
    if (!pet.imageData || pet.imageData.length === 0) {
      return <p className="text-gray-500 text-sm">No images available</p>;
    }

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {pet.imageData[0].map((imgData, idx) => (
          <img
            key={idx}
            src={`data:image/jpeg;base64,${arrayBufferToBase64(imgData)}`}
            alt={`${pet.name} - image ${idx + 1}`}
            className="w-24 h-24 object-cover rounded border"
          />
        ))}
      </div>
    );
  };

  // User Registration Function
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthMessage('Registering user...');
    try {
      const passwordHash = password; // In real app, hash on client-side
      const result = await Lost_Pet_Finder_backend.registerUser(username, passwordHash, email);
      if ('ok' in result) {
        setAuthMessage(result.ok);
        setIsRegistering(false); // Switch to login form after successful registration
      } else {
        setAuthMessage(result.err);
      }
    } catch (error) {
      setAuthMessage(`Registration error: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  // User Login Function
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthMessage('Logging in...');
    try {
      const passwordHash = password; // In real app, hash on client-side
      const result = await Lost_Pet_Finder_backend.loginUser(username, passwordHash);
      if ('ok' in result) {
        setAuthMessage(result.ok);
        setLoggedInUser(username); // For simplicity, store username as loggedInUser. In real app, use principal.
        setUsername('');
        setPassword('');
        setEmail('');
      } else {
        setAuthMessage(result.err);
        setLoggedInUser(null);
      }
    } catch (error) {
      setAuthMessage(`Login error: ${error.message || error}`);
      setLoggedInUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setAuthMessage('Logged out successfully.');
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Lost & Found Pet Finder</h1>

      {/* Authentication Section */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">{isRegistering ? 'Register' : 'Login'}</h2>
        {loggedInUser ? (
          <div>
            <p>Logged in as: <strong>{loggedInUser}</strong></p> {/* Display username */}
            <button onClick={handleLogout} className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 mt-2">Logout</button>
          </div>
        ) : (
          <div>
            <p className="mb-2">{authMessage}</p>
            <form onSubmit={isRegistering ? handleRegister : handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 border rounded" required />
              </div>
              {isRegistering && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" required />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" required />
              </div>
              <div className="mt-4 flex gap-2">
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50" disabled={loading}>
                  {loading ? 'Processing...' : isRegistering ? 'Register' : 'Login'}
                </button>
                <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
                  {isRegistering ? 'Switch to Login' : 'Switch to Register'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pet Entry Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Register a Pet</h2>

          <form onSubmit={handleSubmit}>
            {/* Pet form fields - same as before */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ... pet form inputs - petName, petType, breed, color, height, location, category, date, area, images */}
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

              <div className="mb-4 md:col-span-2">
                <label className="block text-sm font-medium mb-1">Pet Images (max 5)</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full p-2 border rounded"
                />

                {/* Image previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index}`}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Register Pet'}
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

              {/* Display pet images */}
              <div className="mt-3">
                <p className="font-medium">Images:</p>
                {renderPetImages(selectedPet)}
              </div>

              {/* Conditionally render delete button based on loggedInUser (placeholder check) */}
              {loggedInUser /* Replace with actual ownership check if principal is available in frontend */ && (
                <button
                  onClick={() => handleDeletePet(selectedPet.id)}
                  className="mt-3 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 text-sm"
                >
                  Delete This Pet Record
                </button>
              )}
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
                      <div className="flex-grow">
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

                        {/* Thumbnail preview */}
                        {pet.imageData && pet.imageData[0] && pet.imageData[0].length > 0 && (
                          <div className="mt-2 flex gap-1">
                            {pet.imageData[0].slice(0, 3).map((imgData, idx) => (
                              <img
                                key={idx}
                                src={`data:image/jpeg;base64,${arrayBufferToBase64(imgData)}`}
                                alt={`${pet.name} - thumbnail ${idx + 1}`}
                                className="w-10 h-10 object-cover rounded"
                              />
                            ))}
                            {pet.imageData[0].length > 3 && (
                              <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
                                +{pet.imageData[0].length - 3}
                              </div>
                            )}
                          </div>
                        )}
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
                        {/* Conditionally render delete button in listing based on loggedInUser (placeholder check) */}
                        {loggedInUser /* Replace with actual ownership check if principal is available in frontend */ && (
                          <button
                            onClick={() => handleDeletePet(pet.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Delete
                          </button>
                        )}
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