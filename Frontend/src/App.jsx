import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import UserRegistration from './UserRegistration';
import Login from './UserLogin';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    document.documentElement.classList.toggle('dark', !darkMode); // Toggle the 'dark' class
  };

  return (
    <Router>
      <div
        className={`min-h-screen ${darkMode 
          ? 'dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900' 
          : 'bg-gradient-to-br from-indigo-50 to-purple-50'} 
          flex flex-col justify-center items-center py-12 px-6 transition-all`}
      >
        {/* Dark Mode Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className={`fixed top-6 right-6 p-3 rounded-full shadow-lg focus:outline-none transition-colors ${
            darkMode 
            ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
        >
          {darkMode ? '🌙 Dark Mode' : '🌞 Light Mode'}
        </button>

        <Routes>
          {/* Registration Page */}
          <Route
            path="/"
            element={
              <div className={`w-full max-w-md p-8 shadow-lg rounded-xl transition-all ${
                darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}>
                <h1 className={`text-4xl font-extrabold ${darkMode ? 'text-white' : 'text-indigo-700'} mb-8`}>
                  Register Here
                </h1>
                <UserRegistration />
                <div className="text-center mt-4">
                  <Link
                    to="/login"
                    className="text-indigo-600 hover:text-indigo-800 dark:text-yellow-400 dark:hover:text-yellow-300 underline"
                  >
                    Already registered? Login here.
                  </Link>
                </div>
              </div>
            }
          />

          {/* Login Page */}
          <Route
            path="/login"
            element={
              <div className={`w-full max-w-md p-8 shadow-lg rounded-xl transition-all ${
                darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}>
                <h1 className={`text-4xl font-extrabold ${darkMode ? 'text-white' : 'text-indigo-700'} mb-8`}>
                  Login Here
                </h1>
                <Login />
                <div className="text-center mt-4">
                  <Link
                    to="/"
                    className="text-indigo-600 hover:text-indigo-800 dark:text-yellow-400 dark:hover:text-yellow-300 underline"
                  >
                    New user? Register here.
                  </Link>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
