import React, { useContext, useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import Modal from "../components/Modal";
import PetForm from "../components/Pets/PetForm";
import PetSearcher from "../components/Pets/PetSearcher";
import { useNavigate } from 'react-router-dom';
import PetListing from "../components/Pets/PetListing";

const HomePage = () => {
  const { loggedInUser, allPets } = useAppContext();
  const [showRegister, setShowRegister] = useState(false);
  const [showFind, setShowFind] = useState(false);
  const navigate=useNavigate();
useEffect(()=>{
  if(!loggedInUser){
    navigate('/', { replace: true })
  }
},[loggedInUser])
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pet Finder</h1>
        <div className="flex gap-4">
          <button onClick={() => setShowRegister(true)} className="hover:underline">
            Register Lost Pet
          </button>
          <button onClick={() => setShowFind(true)} className="hover:underline">
            Find Your Pet
          </button>
        </div>
      </nav>

      {/* Logged-in User Info */}
      <div className="p-6 bg-white shadow-md rounded-lg m-4">
        {loggedInUser ? (
          <div>
            <h2 className="text-xl font-semibold">Welcome, {loggedInUser.username}!</h2>
            <button
              onClick={()=>{}}//handlelogout
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <h2 className="text-xl font-semibold">You are not logged in.</h2>
        )}
      </div>

      {/* Pet List Section (Placeholder) */}
      <div className="p-6 bg-white shadow-md rounded-lg m-4">
        <h2 className="text-xl font-semibold">Lost & Found Pets</h2>
        {allPets.length!=0 && <PetListing/>}
        {allPets.length === 0}<p className="text-gray-600">Pet list will be displayed here...</p>
      </div>

      {/* Register Pet Modal */}
      <Modal isOpen={showRegister} closeModal={() => setShowRegister(false)}>
        <PetForm closeForm={() => setShowRegister(false)} />
      </Modal>

      {/* Find Pet Modal */}
      {/* <Modal isOpen={showFind} closeModal={() => setShowFind(false)}>
        <PetSearcher closeForm={() => setShowFind(false)} />
      </Modal> */}
    </div>
  );
};

export default HomePage;
