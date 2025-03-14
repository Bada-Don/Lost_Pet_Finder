import React, { useState, useEffect } from 'react';
import { arrayBufferToBase64, formatDate } from '../../utils/helpers';
import MessageComponent from '../Messages/MessageComponent';

const PetSearcher = ({
  searchId, setSearchId,
  handleGetPet, loading,
  message, selectedPet,
  renderPetImages, handleDeletePet,
  loggedInUser, onSendMessage, messages
}) => {
  const [showMessages, setShowMessages] = useState(false);

  return (
    <div>
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
            <p><strong>Date:</strong> {selectedPet.date ? formatDate(selectedPet.date) : 'Not specified'}</p>
            <p><strong>Area:</strong> {selectedPet.area || 'Not specified'}</p>
          </div>

          <div className="mt-3">
            <p className="font-medium">Images:</p>
            {renderPetImages(selectedPet)}
          </div>

          <div className="mt-4 flex gap-3">
            {loggedInUser && (
              <button
                onClick={() => handleDeletePet(selectedPet.id)}
                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 text-sm"
              >
                Delete This Pet Record
              </button>
            )}
            
            {/* Only show contact button if the user is logged in and not the owner */}
            {loggedInUser && selectedPet.owner.toString() !== loggedInUser.toString() && (
              <button
                onClick={() => setShowMessages(true)}
                className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 text-sm"
              >
                Contact Owner
              </button>
            )}
          </div>

          {/* Messaging component */}
          {showMessages && (
            <MessageComponent
              loggedInUser={loggedInUser}
              petId={selectedPet.id}
              petOwner={selectedPet.owner}
              onClose={() => setShowMessages(false)}
              onSendMessage={(content) => onSendMessage(selectedPet.id, selectedPet.owner, content)}
              messages={messages}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PetSearcher;
