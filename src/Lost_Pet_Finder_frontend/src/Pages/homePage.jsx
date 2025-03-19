import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import Modal from "../components/Modal";
import PetForm from "../components/Pets/PetForm";
import PetSearcher from "../components/Pets/PetSearcher";
import { useNavigate } from "react-router-dom";
import PetListing from "../components/Pets/PetListing";
import { Lost_Pet_Finder_backend } from "../../../declarations/Lost_Pet_Finder_backend";

const HomePage = () => {
  const {
    loggedInUser,
    allPets,
    setAllPets,
    viewMode,
    setMessage,
    setLoading,
  } = useAppContext();

  const [showRegister, setShowRegister] = useState(false);
  const [showFind, setShowFind] = useState(false);
  const navigate = useNavigate();

  // Fetch pets based on view mode
  const fetchPets = async () => {
    setLoading(true);
    try {
      let pets = [];
      if (viewMode === "lost") {
        pets = await Lost_Pet_Finder_backend.getPetsByCategory("Lost");
      } else if (viewMode === "found") {
        pets = await Lost_Pet_Finder_backend.getPetsByCategory("Found");
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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loggedInUser) {
      navigate("/", { replace: true });
    }
  }, [loggedInUser]);

  useEffect(() => {
    fetchPets();
  }, [viewMode, loggedInUser]); // Refetch pets when view mode or login status changes

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Fixed Navbar with Logout button on the Right */}
      <nav className="bg-blue-600 p-4 text-white flex justify-between items-center fixed top-0 left-0 w-full shadow-lg z-50">
        <h1 className="text-2xl font-bold">Pet Finder</h1>

        {/* Buttons + Logout in Navbar */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowRegister(true)}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Register Lost Pet
          </button>

          <button
            onClick={() => setShowFind(true)}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Find Your Pet
          </button>

          {/* ✅ Moved Logout Button to Navbar */}
          {loggedInUser && (
            <button
              onClick={() => { }} // Handle logout
              className="bg-red-500 text-white px-3 py-1 text-sm rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* ✅ Content Wrapper (To prevent content from getting hidden under fixed navbar) */}
      <div className="pt-20 max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="p-6 bg-white shadow-md rounded-lg mt-6">
          {loggedInUser ? (
            <h2 className="text-xl font-semibold">Welcome, {loggedInUser.username}!</h2>
          ) : (
            <h2 className="text-xl font-semibold text-center">You are not logged in.</h2>
          )}
        </div>

        {/* Pet Listings */}
        <div className="mt-6 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Lost & Found Pets</h2>
          
            <PetListing />
          
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={showRegister} closeModal={() => setShowRegister(false)}>
        <PetForm closeForm={() => setShowRegister(false)} />
      </Modal>

      {/* Uncomment if needed */}
      {/* <Modal isOpen={showFind} closeModal={() => setShowFind(false)}>
        <PetSearcher closeForm={() => setShowFind(false)} />
      </Modal> */}
    </div>
  );
};

export default HomePage;
