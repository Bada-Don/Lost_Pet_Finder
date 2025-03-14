import React from 'react';
import { arrayBufferToBase64, formatDate } from '../../utils/helpers';

const PetListing = ({
  allPets,
  viewMode,
  setViewMode,
  loading,
  setSelectedPet,
  setSearchId,
  setMessage,
  handleDeletePet,
  loggedInUser
}) => {
  return (
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
      {loading ? (
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
                    {pet.imageData && pet.imageData.length > 0 && (
                      <div className="mt-2 flex gap-1">
                        {pet.imageData.slice(0, 3).map((imgData, idx) => (
                          <img
                            key={idx}
                            src={`data:image/jpeg;base64,${arrayBufferToBase64(imgData)}`}
                            alt={`${pet.name} - thumbnail ${idx + 1}`}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ))}
                        {pet.imageData.length > 3 && (
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
                            +{pet.imageData.length - 3}
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
                        setSearchId(petToView.id);
                        setMessage('Pet details loaded from listing');
                      }}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      View
                    </button>
                    {loggedInUser && (
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
  );
};

export default PetListing;