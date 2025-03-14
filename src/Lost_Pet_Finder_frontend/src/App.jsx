import React, { useState, useEffect, useRef } from 'react';
import { Lost_Pet_Finder_backend } from '../../declarations/Lost_Pet_Finder_backend'; // Adjust path if needed
import { Principal } from '@dfinity/principal';
import AuthComponent from './components/Auth/AuthComponent';
import PetForm from './components/Pets/PetForm';
import PetListing from './components/Pets/PetListing';
import PetSearcher from './components/Pets/PetSearcher';
import { arrayBufferToBase64, formatDate, convertImageToBlob } from './utils/helpers';

function App() {
  // --- Authentication State ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null); // Could store username or Principal
  const [authMessage, setAuthMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // --- Pet Form State ---
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [breed, setBreed] = useState('');
  const [color, setColor] = useState('');
  const [height, setHeight] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Lost');
  const [date, setDate] = useState('');
  const [area, setArea] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

  // --- Pet Listing and Search State ---
  const [allPets, setAllPets] = useState([]);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'lost', 'found'
  const [selectedPet, setSelectedPet] = useState(null);
  const [searchId, setSearchId] = useState('');

  // --- UI State ---
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);


  // --- Effects ---
  useEffect(() => {
    fetchPets();
  }, [viewMode, loggedInUser]); // Refetch pets when viewMode or login status changes

  // --- Authentication Handlers ---
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthMessage('Logging in...');
    try {
      const passwordHash = password; // In real app, hash on client-side
      const result = await Lost_Pet_Finder_backend.loginUser(username, passwordHash);
      if ('ok' in result) {
        setAuthMessage(result.ok);
        setLoggedInUser(username); // Storing username for simplicity, consider Principal in real app
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


  // --- Pet Form Handlers ---
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
    setImageFiles([]);
    setImagePreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear file input
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const selectedFiles = files.slice(0, 5); // Limit to 5 images
    setImageFiles(prevFiles => [...prevFiles, ...selectedFiles].slice(0, 5));

    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews].slice(0, 5));
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]); // Clean up URL object
      return prev.filter((_, i) => i !== index);
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Saving pet information...');

    try {
      if (!petName || !category) {
        setMessage('Name and Category are required fields');
        setLoading(false);
        return;
      }

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

  // --- Pet Search Handlers ---
  const handleGetPet = async () => {
    if (!searchId) {
      setMessage('Please enter a pet ID to search');
      return;
    }

    setLoading(true);
    setMessage('Retrieving pet information...');

    try {
      const result = await Lost_Pet_Finder_backend.getPet(searchId);
      console.log("Result from getPet:", result); // Keep this for debugging

      if (result && result.length > 0) { // Add check to make sure result is not null and has elements
        setSelectedPet(result[0]); // Access the first element - the Pet object
        setMessage('Pet information retrieved successfully');
      } else {
        setMessage('Pet not found');
        setSelectedPet(null);
      }
    } catch (error) {
      console.error("Error retrieving pet:", error);
      setMessage(`Error retrieving pet information: ${error.message || error}`);
      setSelectedPet(null);
    } finally {
      setLoading(false);
    }
  };

  // --- Pet Listing Handlers ---
  const fetchPets = async () => {
    setLoading(true);
    try {
      let pets = [];
      if (viewMode === 'lost') {
        pets = await Lost_Pet_Finder_backend.getPetsByCategory('Lost');
      } else if (viewMode === 'found') {
        pets = await Lost_Pet_Finder_backend.getPetsByCategory('Found');
      } else {
        pets = await Lost_Pet_Finder_backend.getAllPets();
      }
      setAllPets(pets);
    } catch (error) {
      setMessage(`Error fetching pets: ${error.message || error}`);
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
      const result = await Lost_Pet_Finder_backend.deletePet(id);
      if ('ok' in result) {
        setMessage('Pet information deleted successfully!');
        setSelectedPet(null);
        fetchPets();
      } else {
        setMessage(`Error deleting pet information: ${result.err}`);
      }
    } catch (error) {
      setMessage(`Error deleting pet information: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Rendering Helper Functions ---
  const renderPetImages = (pet) => {
    if (!pet.imageData || pet.imageData.length === 0 || pet.imageData[0].length === 0) {
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


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Lost & Found Pet Finder</h1>

      <AuthComponent
        username={username} setUsername={setUsername}
        password={password} setPassword={setPassword}
        email={email} setEmail={setEmail}
        isRegistering={isRegistering} setIsRegistering={setIsRegistering}
        loggedInUser={loggedInUser} authMessage={authMessage}
        handleRegister={handleRegister} handleLogin={handleLogin}
        handleLogout={handleLogout} loading={loading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Pet Entry Form */}
        <PetForm
          handleSubmit={handleSubmit}
          handleImageChange={handleImageChange}
          removeImage={removeImage}
          petName={petName} setPetName={setPetName}
          petType={petType} setPetType={setPetType}
          breed={breed} setBreed={setBreed}
          color={color} setColor={setColor}
          height={height} setHeight={setHeight}
          location={location} setLocation={setLocation}
          category={category} setCategory={setCategory}
          date={date} setDate={setDate}
          area={area} setArea={setArea}
          imagePreviews={imagePreviews}
          fileInputRef={fileInputRef}
          loading={loading}
          clearForm={clearForm}
        />

        {/* Pet Listings */}
        <PetListing
          allPets={allPets}
          viewMode={viewMode} setViewMode={setViewMode}
          loading={loading}
          setSelectedPet={setSelectedPet}
          setSearchId={setSearchId}
          setMessage={setMessage}
          handleDeletePet={handleDeletePet}
          loggedInUser={loggedInUser} // Pass loggedInUser for conditional delete button
        />
      </div>

      {/* Pet Searcher - outside grid for full width */}
      <PetSearcher
        searchId={searchId} setSearchId={setSearchId}
        handleGetPet={handleGetPet} loading={loading}
        message={message} selectedPet={selectedPet}
        renderPetImages={renderPetImages}
        handleDeletePet={handleDeletePet}
        loggedInUser={loggedInUser} // Pass loggedInUser for conditional delete button
      />

      {message && !selectedPet && ( // Show general messages when not viewing a selected pet
        <div className={`mt-6 p-3 rounded ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default App;