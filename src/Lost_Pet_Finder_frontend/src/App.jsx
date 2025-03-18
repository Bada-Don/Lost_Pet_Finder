// app-updated.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Lost_Pet_Finder_backend } from '../../declarations/Lost_Pet_Finder_backend'; // Adjust path if needed
import { Principal } from '@dfinity/principal';
import AuthPage from './Pages/AuthPage';
import HomePage from './Pages/homePage';
import PetForm from './components/Pets/PetForm';
import PetListing from './components/Pets/PetListing';
import PetSearcher from './components/Pets/PetSearcher';
import InboxComponent from './components/Messages/InboxComponent.jsx'; // Import InboxComponent
import MessageComponent from './components/Messages/MessageComponent.jsx'; // Ensure MessageComponent is correctly imported
import { arrayBufferToBase64, formatDate, convertImageToBlob } from './utils/helpers';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
function App() {

  // // --- Authentication State ---
  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');
  // const [email, setEmail] = useState('');
  // const [loggedInUser, setLoggedInUser] = useState(null); // Could store username or Principal
  // const [authMessage, setAuthMessage] = useState('');
  // const [isRegistering, setIsRegistering] = useState(false);

  // // --- Pet Form State ---
  // const [petName, setPetName] = useState('');
  // const [petType, setPetType] = useState('');
  // const [breed, setBreed] = useState('');
  // const [color, setColor] = useState('');
  // const [height, setHeight] = useState('');
  // const [location, setLocation] = useState('');
  // const [category, setCategory] = useState('Lost');
  // const [date, setDate] = useState('');
  // const [area, setArea] = useState('');
  // const [imageFiles, setImageFiles] = useState([]);
  // const [imagePreviews, setImagePreviews] = useState([]);
  // const fileInputRef = useRef(null);

  // // --- Pet Listing and Search State ---
  // const [allPets, setAllPets] = useState([]);
  // const [viewMode, setViewMode] = useState('all'); // 'all', 'lost', 'found'
  // const [selectedPet, setSelectedPet] = useState(null);
  // const [searchId, setSearchId] = useState('');

  // // --- Messaging State ---
  // const [userMessages, setUserMessages] = useState([]);
  // const [petMessages, setPetMessages] = useState([]);
  // const [messagingLoading, setMessagingLoading] = useState(false);

  // // --- UI State ---
  // const [message, setMessage] = useState('');
  // const [loading, setLoading] = useState(false);
  // const [debug, setDebug] = useState(''); // Added for debugging

  // --- Effects ---
  // useEffect(() => {
  //   fetchPets();
  // }, [viewMode, loggedInUser]); // Refetch pets when viewMode or login status changes

  // useEffect(() => {
  //   if (loggedInUser) {
  //     fetchUserMessages();
  //   } else {
  //     setUserMessages([]); // Clear messages on logout
  //   }
  // }, [loggedInUser]);

  // --- Authentication Handlers ---
  // const handleRegister = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setAuthMessage('Registering user...');
  //   try {
  //     const passwordHash = password; // In real app, hash on client-side
  //     const result = await Lost_Pet_Finder_backend.registerUser(username, passwordHash, email);
  //     if ('ok' in result) {
  //       setAuthMessage(result.ok);
  //       setIsRegistering(false); // Switch to login form after successful registration
  //     } else {
  //       setAuthMessage(result.err);
  //     }
  //   } catch (error) {
  //     setAuthMessage(`Registration error: ${error.message || error}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setAuthMessage('Logging in...');
  //   try {
  //     const passwordHash = password; // In real app, hash on client-side
  //     const result = await Lost_Pet_Finder_backend.loginUser(username, passwordHash);
  //     if ('ok' in result) {
  //       setAuthMessage(result.ok);
        
  //       // Get the user's Principal and store it along with username
  //       const authActor = await Lost_Pet_Finder_backend;
  //       const userPrincipal = await authActor.getOwnPrincipal();
        
  //       setLoggedInUser({
  //         username: username,
  //         principal: userPrincipal.toString()
  //       });
        
  //       setUsername('');
  //       setPassword('');
  //       setEmail('');
  //       fetchUserMessages(); // Fetch messages after login
  //     } else {
  //       setAuthMessage(result.err);
  //       setLoggedInUser(null);
  //     }
  //   } catch (error) {
  //     setAuthMessage(`Login error: ${error.message || error}`);
  //     setLoggedInUser(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleLogout = () => {
  //   setLoggedInUser(null);
  //   setAuthMessage('Logged out successfully.');
  //   setUserMessages([]); // Clear messages on logout
  // };


  // --- Pet Form Handlers ---
  // const clearForm = () => {
  //   setPetName('');
  //   setPetType('');
  //   setBreed('');
  //   setColor('');
  //   setHeight('');
  //   setLocation('');
  //   setCategory('Lost');
  //   setDate('');
  //   setArea('');
  //   setImageFiles([]);
  //   setImagePreviews([]);
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = ''; // Clear file input
  //   }
  //   setDebug(''); // Clear debug info
  // };

  // const handleImageChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   if (files.length === 0) return;

  //   const selectedFiles = files.slice(0, 5); // Limit to 5 images
  //   setImageFiles(prevFiles => [...prevFiles, ...selectedFiles].slice(0, 5));

  //   // Convert to data URLs instead of blob URLs
  //   selectedFiles.forEach(file => {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setImagePreviews(prevPreviews => [...prevPreviews, e.target.result].slice(0, 5));
  //     };
  //     reader.readAsDataURL(file);
  //   });
  // }

  // const removeImage = (index) => {
  //   setImageFiles(prev => prev.filter((_, i) => i !== index));
  //   setImagePreviews(prev => prev.filter((_, i) => i !== index));
  // };

  // Updated function to properly format image data for the Motoko backend
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setMessage('Saving pet information...');
  //   setDebug(''); // Clear previous debug info

  //   try {
  //     if (!petName || !category) {
  //       setMessage('Name and Category are required fields');
  //       setLoading(false);
  //       return;
  //     }

  //     // Let's use a modified approach for images
  //     let imageBlobs = null; // Default to null if no images

  //     if (imageFiles.length > 0) {
  //       setMessage('Processing images...');
  //       setDebug('Starting image processing');

  //       try {
  //         // First convert files to readable arrays
  //         const imageArrays = [];

  //         for (const file of imageFiles) {
  //           const arrayBuffer = await file.arrayBuffer();
  //           // Convert ArrayBuffer to Array of Numbers (Uint8Array -> Array)
  //           const uint8Array = new Uint8Array(arrayBuffer);
  //           const numbersArray = Array.from(uint8Array);

  //           // Debug the size
  //           setDebug(prev => prev + `\nProcessed image of size: ${numbersArray.length} bytes`);

  //           // Only store images smaller than 400KB to prevent overflow issues
  //           if (numbersArray.length > 400000) {
  //             setDebug(prev => prev + `\nImage too large (${numbersArray.length} bytes), skipping`);
  //             continue;
  //           }

  //           imageArrays.push(numbersArray);
  //         }

  //         // If we have any valid images, use them
  //         if (imageArrays.length > 0) {
  //           imageBlobs = [imageArrays]; // Must be wrapped in an outer array to match backend type
  //           setDebug(prev => prev + `\nFinal image data: ${imageArrays.length} images processed`);
  //         } else {
  //           imageBlobs = null;
  //           setDebug(prev => prev + `\nNo valid images to upload`);
  //         }
  //       } catch (err) {
  //         console.error("Error processing images:", err);
  //         setDebug(prev => prev + `\nError processing images: ${err.message || err}`);
  //         setMessage(`Error processing images: ${err.message}`);
  //         setLoading(false);
  //         return;
  //       }
  //     }

  //     const petInput = {
  //       name: petName,
  //       petType: petType,
  //       breed: breed,
  //       color: color,
  //       height: height,
  //       location: location,
  //       category: category,
  //       date: date,
  //       area: area,
  //       imageData: imageBlobs
  //     };

  //     setDebug(prev => prev + `\nSending pet data to backend: ${JSON.stringify({
  //       ...petInput,
  //       imageData: imageBlobs ? `[Array with ${imageBlobs[0].length} images]` : null
  //     })}`);

  //     const generatedId = await Lost_Pet_Finder_backend.addPet(petInput);
  //     setMessage(`Pet information saved successfully! Assigned ID: ${generatedId}`);
  //     clearForm();
  //     fetchPets();
  //   } catch (error) {
  //     console.error("Error saving pet:", error);
  //     setDebug(prev => prev + `\nBackend error: ${error.message || error}`);
  //     setMessage(`Error saving pet information: ${error.message || error}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loggedInUser) {
      setMessage('You must be logged in to register a pet.');
      return;
    }
    setLoading(true);
    setMessage('Saving pet information...');
    setDebug(''); // Clear previous debug info

    try {
      if (!petName || !category) {
        setMessage('Name and Category are required fields');
        setLoading(false);
        return;
      }

      // Let's use a modified approach for images
      let imageBlobs = null; // Default to null if no images

      if (imageFiles.length > 0) {
        setMessage('Processing images...');
        setDebug('Starting image processing');

        try {
          const imageArrays = []; // Initialize imageArrays here

          for (const file of imageFiles) {
            const arrayBuffer = await file.arrayBuffer();
            // Convert ArrayBuffer to Array of Numbers (Uint8Array -> Array)
            const uint8Array = new Uint8Array(arrayBuffer);
            const numbersArray = Array.from(uint8Array);

            // Debug the size
            setDebug(prev => prev + `\nProcessed image of size: ${numbersArray.length} bytes`);

            // Only store images smaller than 400KB to prevent overflow issues
            if (numbersArray.length > 400000) {
              setDebug(prev => prev + `\nImage too large (${numbersArray.length} bytes), skipping`);
              continue;
            }

            imageArrays.push(numbersArray);
          }

          // If we have any valid images, use them
          if (imageArrays.length > 0) {
            imageBlobs = [imageArrays]; // Must be wrapped in an outer array to match backend type
            setDebug(prev => prev + `\nFinal image data: ${imageArrays.length} images processed`);
          } else {
            imageBlobs = null;
            setDebug(prev => prev + `\nNo valid images to upload`);
          }
        } catch (err) {
          console.error("Error processing images:", err);
          setDebug(prev => prev + `\nError processing images: ${err.message || err}`);
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
        imageData: imageBlobs
      };

      setDebug(prev => prev + `\nSending pet data to backend: ${JSON.stringify({
        ...petInput,
        imageData: imageBlobs ? `[Array with ${imageBlobs[0].length} images]` : null
      })}`);

      const generatedId = await Lost_Pet_Finder_backend.addPet(petInput);
      setMessage(`Pet information saved successfully! Assigned ID: ${generatedId}`);
      clearForm();
      fetchPets();
    } catch (error) {
      console.error("Error saving pet:", error);
      setDebug(prev => prev + `\nBackend error: ${error.message || error}`);
      setMessage(`Error saving pet information: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Pet Search Handlers ---
  // const handleGetPet = async () => {
  //   if (!searchId) {
  //     setMessage('Please enter a pet ID to search');
  //     return;
  //   }
  
  //   setLoading(true);
  //   setMessage('Retrieving pet information...');
  
  //   try {
  //     const result = await Lost_Pet_Finder_backend.getPet(searchId);
  //     console.log("Raw result from getPet:", result);
  
  //     if (result) {
  //       // Fix: Check if the result is an array and extract the first item
  //       const petData = Array.isArray(result) ? result[0] : result;
  
  //       console.log("Pet data extracted:", petData);
  
  //       if (petData) {
  //         setSelectedPet(petData);
  //         setMessage('Pet information retrieved successfully');
          
  //         // Fetch messages for this pet
  //         fetchPetMessages(petData.id);
  //       } else {
  //         setMessage('Pet not found or data structure unexpected');
  //         setSelectedPet(null);
  //       }
  //     } else {
  //       setMessage('Pet not found');
  //       setSelectedPet(null);
  //     }
  //   } catch (error) {
  //     console.error("Error retrieving pet:", error);
  //     setMessage(`Error retrieving pet information: ${error.message || error}`);
  //     setSelectedPet(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // --- Pet Listing Handlers ---
  
  // const fetchPets = async () => {
  //   setLoading(true);
  //   try {
  //     let pets = [];
  //     if (viewMode === 'lost') {
  //       pets = await Lost_Pet_Finder_backend.getPetsByCategory('Lost');
  //     } else if (viewMode === 'found') {
  //       pets = await Lost_Pet_Finder_backend.getPetsByCategory('Found');
  //     } else {
  //       pets = await Lost_Pet_Finder_backend.getAllPets();
  //     }
  //     setAllPets(pets);
  //   } catch (error) {
  //     setMessage(`Error fetching pets: ${error.message || error}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleDeletePet = async (id) => {
  //   if (!id) {
  //     setMessage('No pet ID specified for deletion');
  //     return;
  //   }
  //   if (!window.confirm(`Are you sure you want to delete pet with ID ${id}?`)) {
  //     return;
  //   }

  //   setLoading(true);
  //   setMessage('Deleting pet information...');

  //   try {
  //     const result = await Lost_Pet_Finder_backend.deletePet(id);
  //     if ('ok' in result) {
  //       setMessage('Pet information deleted successfully!');
  //       setSelectedPet(null);
  //       fetchPets();
  //     } else {
  //       setMessage(`Error deleting pet information: ${result.err}`);
  //     }
  //   } catch (error) {
  //     setMessage(`Error deleting pet information: ${error.message || error}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // --- Messaging Handlers ---
  // const fetchUserMessages = async () => {
  //   if (!loggedInUser) return; // Do not fetch if not logged in
  //   setMessagingLoading(true);
  //   try {
  //     const messages = await Lost_Pet_Finder_backend.getUserMessages();
  //     console.log("User messages fetched:", messages); // Debug log
      
  //     // Get the current user's Principal (needed to properly identify sent messages)
  //     const authActor = await Lost_Pet_Finder_backend;
  //     const myPrincipal = authActor.getOwnPrincipal ? 
  //       await authActor.getOwnPrincipal() : 
  //       null;
      
  //     // Process messages to determine if they are sent or received
  //     const processedMessages = messages.map(msg => {
  //       // Determine if message was sent by current user by comparing principals
  //       const isSent = myPrincipal && 
  //         myPrincipal.toString() === msg.fromUser.toString();
        
  //       return {
  //         ...msg,
  //         isSent,
  //         contactName: isSent ? 
  //           msg.toUser.toString().slice(0, 8) + '...' : 
  //           msg.fromUser.toString().slice(0, 8) + '...'
  //       };
  //     });
      
  //     setUserMessages(processedMessages);
  //   } catch (error) {
  //     console.error("Error fetching messages:", error);
  //     setMessage(`Error fetching messages: ${error.message || error}`);
  //   } finally {
  //     setMessagingLoading(false);
  //   }
  // };
  // const fetchPetMessages = async (petId) => {
  //   if (!loggedInUser || !petId) return;
  //   setMessagingLoading(true);
  //   try {
  //     const messages = await Lost_Pet_Finder_backend.getMessagesForPet(petId);
  //     console.log("Pet messages fetched:", messages); // Debug log
  //     setPetMessages(messages);
  //   } catch (error) {
  //     console.error("Error fetching pet messages:", error);
  //     setMessage(`Error fetching pet messages: ${error.message || error}`);
  //   } finally {
  //     setMessagingLoading(false);
  //   }
  // };


  // const handleSendMessage = async (petId, toUserPrincipal, content) => {
  //   if (!loggedInUser) {
  //     setMessage('Please log in to send messages.');
  //     return;
  //   }
    
  //   console.log("Sending message:", { petId, toUserPrincipal, content });
  //   setMessagingLoading(true);
    
  //   try {
  //     // Convert the principal string to a Principal object if needed
  //     let principalObj = toUserPrincipal;
  //     if (typeof toUserPrincipal === 'string') {
  //       principalObj = Principal.fromText(toUserPrincipal);
  //     }
      
  //     const result = await Lost_Pet_Finder_backend.sendMessage({
  //       petId: petId,
  //       toUser: principalObj,
  //       content: content,
  //     });
      
  //     if ('ok' in result) {
  //       setMessage('Message sent successfully!');
  //       // Refresh messages after sending
  //       fetchPetMessages(petId);
  //       fetchUserMessages();
  //     } else {
  //       setMessage(`Failed to send message: ${result.err}`);
  //     }
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //     setMessage(`Error sending message: ${error.message || error}`);
  //   } finally {
  //     setMessagingLoading(false);
  //   }
  // };

  // const handleMarkAsRead = async (messageId) => {
  //   setMessagingLoading(true);
  //   try {
  //     const result = await Lost_Pet_Finder_backend.markMessageAsRead(messageId);
  //     if ('ok' in result) {
  //       setMessage(result.ok);
  //       fetchUserMessages(); // Refresh messages to update read status
  //     } else {
  //       setMessage(`Failed to mark as read: ${result.err}`);
  //     }
  //   } catch (error) {
  //     setMessage(`Error marking as read: ${error.message || error}`);
  //   } finally {
  //     setMessagingLoading(false);
  //   }
  // };

  // const handleViewPetFromInbox = async (petId) => {
  //   setSearchId(petId);
  //   await handleGetPet(); // Automatically fetch and display pet details
  // };


  // --- Rendering Helper Functions ---
  // const renderPetImages = (pet) => {
  //   if (!pet.imageData || !pet.imageData.length || !pet.imageData[0] || pet.imageData[0].length === 0) {
  //     return <p className="text-gray-500 text-sm">No images available</p>;
  //   }

  //   return (
  //     <div className="flex flex-wrap gap-2 mt-2">
  //       {pet.imageData[0].map((imgData, idx) => (
  //         <img
  //           key={idx}
  //           src={`data:image/jpeg;base64,${arrayBufferToBase64(imgData)}`}
  //           alt={`${pet.name} - image ${idx + 1}`}
  //           className="w-24 h-24 object-cover rounded border"
  //         />
  //       ))}
  //     </div>
  //   );
  // };

  return (
  <>
    {/* // <div className="container mx-auto p-4">
    // //   <h1 className="text-3xl font-bold mb-6 text-center">Lost & Found Pet Finder</h1> */}
     
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>


      {/* <AuthComponent
        username={username} setUsername={setUsername}
        password={password} setPassword={setPassword}
        email={email} setEmail={setEmail}
        isRegistering={isRegistering} setIsRegistering={setIsRegistering}
        loggedInUser={loggedInUser} authMessage={authMessage}
        handleRegister={handleRegister} handleLogin={handleLogin}
        handleLogout={handleLogout} loading={loading}
      /> */}

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"> */}
        {/* Pet Entry Form */}
        {/* <PetForm
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
        /> */}

        {/* Pet Listings */}
        {/* <PetListing
          allPets={allPets}
          viewMode={viewMode} setViewMode={setViewMode}
          loading={loading}
          setSelectedPet={setSelectedPet}
          setSearchId={setSearchId}
          setMessage={setMessage}
          handleDeletePet={handleDeletePet}
          loggedInUser={loggedInUser} // Pass loggedInUser for conditional delete button
        /> */}
      {/* </div> */}

      {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"> */}
        {/* Inbox Component */}
        {/* {loggedInUser && (
          <InboxComponent
            messages={userMessages}
            onViewPet={handleViewPetFromInbox}
            onMarkAsRead={handleMarkAsRead}
            loading={messagingLoading}
          />
        )} */}

        {/* Pet Searcher - outside grid for full width */}
        {/* <PetSearcher
          searchId={searchId} setSearchId={setSearchId}
          handleGetPet={handleGetPet} loading={loading}
          message={message} selectedPet={selectedPet}
          renderPetImages={renderPetImages}
          handleDeletePet={handleDeletePet}
          loggedInUser={loggedInUser} // Pass loggedInUser for conditional delete button
          onSendMessage={handleSendMessage}
          messages={petMessages} // Pass petMessages to PetSearcher -> MessageComponent
        /> */}
      {/* </div> */}


      {/* {message && !selectedPet && ( // Show general messages when not viewing a selected pet
        <div className={`mt-6 p-3 rounded ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {message}
        </div>
      )}
      {debug && (
        <div className="mt-4 p-2 border rounded bg-gray-100 overflow-x-auto">
          <pre className="text-xs">{debug}</pre>
        </div>
      )}
    </div> */}
  </>);
}

export default App;