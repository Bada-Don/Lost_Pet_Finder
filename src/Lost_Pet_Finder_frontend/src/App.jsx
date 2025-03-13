import React, { useState, useEffect } from 'react';
import { Lost_Pet_Finder_backend } from '../../declarations/Lost_Pet_Finder_backend';

function App() {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [retrievedValue, setRetrievedValue] = useState('');
  const [message, setMessage] = useState('');
  const [allEntries, setAllEntries] = useState([]); // State for all entries

  // Fetch all entries on component mount
  useEffect(() => {
    fetchAllEntries();
  }, []);

  const handleSet = async () => {
    setMessage('Setting...');
    try {
      await Lost_Pet_Finder_backend.set(key, value);
      setMessage('Key-value pair set successfully!');
      setKey('');
      setValue('');
      fetchAllEntries(); // Refresh the list after setting
    } catch (error) {
      setMessage(`Error setting key-value pair: ${error}`);
    }
  };

  const handleGet = async () => {
    setMessage('Retrieving...');
    try {
      const result = await Lost_Pet_Finder_backend.get(key);
      if (result === null) {
        setRetrievedValue('Key not found');
      } else {
        setRetrievedValue(result);
      }
      setMessage('');
    } catch (error) {
      setMessage(`Error retrieving value: ${error}`);
    }
  };

  const handleDelete = async () => {
    setMessage('Deleting...');
    try {
      await Lost_Pet_Finder_backend.delete(key);
      setMessage('Key-value pair deleted successfully!');
      setKey('');
      fetchAllEntries(); // Refresh after deletion
    } catch (error) {
      setMessage(`Error deleting key-value pair: ${error}`);
    }
  };

  const fetchAllEntries = async () => {
    try {
      const entries = await Lost_Pet_Finder_backend.getAll();
      setAllEntries(entries);
    } catch (error) {
      setMessage(`Error fetching all entries: ${error}`);
    }
  };

    const handleContainsKey = async () => {
        setMessage('Checking...');
        try{
            const contains = await Lost_Pet_Finder_backend.containsKey(key);
            if(contains) {
                setMessage(`Key ${key} found!`);
            }
            else{
                setMessage(`Key ${key} not found!`);
            }
        }
        catch(error){
            setMessage(`Error checking if map contains key: ${error}`);
        }
    };

  return (
    <div>
      <h1>Key-Value Store</h1>

      <div>
        <label>Key:</label>
        <input type="text" value={key} onChange={(e) => setKey(e.target.value)} />
      </div>

      <div>
        <label>Value:</label>
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
      </div>

      <button onClick={handleSet}>Set Key-Value</button>
      <button onClick={handleGet}>Get Value</button>
      <button onClick={handleDelete}>Delete Key</button>
      <button onClick={handleContainsKey}>Contains Key?</button>


      {message && <p>{message}</p>}

      {retrievedValue && (
        <div>
          <h2>Retrieved Value:</h2>
          <p>{retrievedValue}</p>
        </div>
      )}

      <h2>All Entries:</h2>
      <ul>
        {allEntries.map((entry, index) => (
          <li key={index}>
            <strong>{entry[0]}</strong>: {entry[1]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App; // Make sure to export the App component