import React, { useEffect } from 'react';
import {Lost_Pet_Finder_backend} from '../../../declarations/Lost_Pet_Finder_backend'
import { useAppContext } from '../context/AppContext'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';
const AuthPage = () => {
  const {
    username, setUsername,
    password, setPassword,
    email, setEmail,
    isRegistering, setIsRegistering,
    loggedInUser, authMessage, setAuthMessage,
    loading, setLoading, setUserMessages, userMessages,
    setLoggedInUser
  } = useAppContext()

  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser) {
      navigate('/home', { replace: true }); // Redirect to home if already logged in
    }
  }, [loggedInUser, navigate]);


  //all the functions

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

        // Get the user's Principal and store it along with username
        const authActor = await Lost_Pet_Finder_backend;
        const userPrincipal = await authActor.getOwnPrincipal();

        setLoggedInUser({
          username: username,
          principal: userPrincipal.toString()
        });

        setUsername('');
        setPassword('');
        setEmail('');
        // fetchUserMessages(); // Fetch messages after login
        navigate('/home', { replace: true }); // Navigate to home page after login
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
    setUserMessages([]); // Clear messages on logout
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{isRegistering ? 'Register' : 'Login'}</h2>

        {loggedInUser ? (
          <div>
            <p>Logged in as: <strong>{loggedInUser.username}</strong></p>
            <button
              onClick={handleLogout}
              className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 mt-2"
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-2 text-red-500">{authMessage}</p>
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
    </div>
  );
};

export default AuthPage;
