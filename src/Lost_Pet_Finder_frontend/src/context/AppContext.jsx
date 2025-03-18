import { createContext, useContext, useState, useRef } from "react";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // --- Authentication State ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
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

  // --- Messaging State ---
  const [userMessages, setUserMessages] = useState([]);
  const [petMessages, setPetMessages] = useState([]);
  const [messagingLoading, setMessagingLoading] = useState(false);

  // --- UI State ---
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState('');

  return (
    <AppContext.Provider value={{
      // Authentication
      username, setUsername,
      password, setPassword,
      email, setEmail,
      loggedInUser, setLoggedInUser,
      authMessage, setAuthMessage,
      isRegistering, setIsRegistering,

      // Pet Form
      petName, setPetName,
      petType, setPetType,
      breed, setBreed,
      color, setColor,
      height, setHeight,
      location, setLocation,
      category, setCategory,
      date, setDate,
      area, setArea,
      imageFiles, setImageFiles,
      imagePreviews, setImagePreviews,
      fileInputRef,

      // Pet Listing & Search
      allPets, setAllPets,
      viewMode, setViewMode,
      selectedPet, setSelectedPet,
      searchId, setSearchId,

      // Messaging
      userMessages, setUserMessages,
      petMessages, setPetMessages,
      messagingLoading, setMessagingLoading,

      // UI
      message, setMessage,
      loading, setLoading,
      debug, setDebug,
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook to use the context
export const useAppContext = () => useContext(AppContext);
