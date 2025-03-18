import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Lost_Pet_Finder_backend } from '../../../../declarations/Lost_Pet_Finder_backend';

const PetForm = () => {
  const {
    petName, setPetName,
    petType, setPetType,
    breed, setBreed,
    color, setColor,
    height, setHeight,
    location, setLocation,
    category, setCategory,
    date, setDate,
    area, setArea,
    imagePreviews, setImagePreviews,
    fileInputRef, loading,
    imageFiles, setImageFiles,
    setLoading, setMessage, setDebug,
    viewMode, setViewMode,
    allPets, setAllPets
    
  } = useAppContext();


  //functions
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Saving pet information...');
    setDebug('');

    try {
      if (!petName || !category) {
        setMessage('Name and Category are required fields');
        setLoading(false);
        return;
      }

      let imageBlobs = null;
      if (imageFiles.length > 0) {
        setMessage('Processing images...');
        setDebug('Starting image processing');
        try {
          const imageArrays = [];
          for (const file of imageFiles) {
            const arrayBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            const numbersArray = Array.from(uint8Array);

            if (numbersArray.length > 400000) continue;
            imageArrays.push(numbersArray);
          }
          if (imageArrays.length > 0) {
            imageBlobs = [imageArrays];
          }
        } catch (err) {
          console.error('Error processing images:', err);
          setMessage(`Error processing images: ${err.message}`);
          setLoading(false);
          return;
        }
      }

      const petInput = {
        name: petName,
        petType,
        breed,
        color,
        height,
        location,
        category,
        date,
        area,
        imageData:imageBlobs
      };

      const generatedId = await Lost_Pet_Finder_backend.addPet(petInput);
      setMessage(`Pet information saved successfully! Assigned ID: ${generatedId}`);
      clearForm();
      fetchPets();
    } catch (error) {
      console.error('Error saving pet:', error);
      setMessage(`Error saving pet information: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImageFiles((prevFiles) => [...prevFiles, ...files].slice(0, 5));

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prevPreviews) => [...prevPreviews, e.target.result].slice(0, 5));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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

  return (
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
                      alt={'preview ${index}'}
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
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 disabled:opacity-50 "
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default PetForm; 