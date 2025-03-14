import React from 'react';

const AuthComponent = ({
  username, setUsername,
  password, setPassword,
  email, setEmail,
  isRegistering, setIsRegistering,
  loggedInUser, authMessage,
  handleRegister, handleLogin,
  handleLogout, loading
}) => {
  return (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{isRegistering ? 'Register' : 'Login'}</h2>
      {loggedInUser ? (
        <div>
          <p>Logged in as: <strong>{loggedInUser}</strong></p>
          <button onClick={handleLogout} className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 mt-2">
            Logout
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-2">{authMessage}</p>
          <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="w-full p-2 border rounded" 
                required 
              />
            </div>
            {isRegistering && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full p-2 border rounded" 
                  required 
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full p-2 border rounded" 
                required 
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button 
                type="submit" 
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50" 
                disabled={loading}
              >
                {loading ? 'Processing...' : isRegistering ? 'Register' : 'Login'}
              </button>
              <button 
                type="button" 
                onClick={() => setIsRegistering(!isRegistering)} 
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                {isRegistering ? 'Switch to Login' : 'Switch to Register'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AuthComponent;