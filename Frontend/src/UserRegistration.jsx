import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Use Link for navigation

const UserRegistration = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const [userData, setUserData] = useState({
    userName: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    userType: 'client',
    answer: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/v1/user/register', userData);

      if (response.status === 200) {
        console.log(response.data);
        // Redirect to the login page after successful registration
        navigate('/login');
      } else {
        setError(response.data.message || 'An error occurred during registration.');
      }
    } catch (error) {
      setError('Failed to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gradient-to-br from-blue-100 to-purple-100 shadow-lg rounded-xl">
      <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-6">Register</h1>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-gray-800">Username</label>
          <input
            type="text"
            id="userName"
            placeholder="Username"
            value={userData.userName}
            onChange={(e) => setUserData({ ...userData, userName: e.target.value })}
            className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-800">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-800">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-800">Address</label>
          <input
            type="text"
            id="address"
            placeholder="Address"
            value={userData.address}
            onChange={(e) => setUserData({ ...userData, address: e.target.value })}
            className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-800">Phone</label>
          <input
            type="text"
            id="phone"
            placeholder="Phone"
            value={userData.phone}
            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
            className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="userType" className="block text-sm font-medium text-gray-800">User Type</label>
          <select
            id="userType"
            value={userData.userType}
            onChange={(e) => setUserData({ ...userData, userType: e.target.value })}
            className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="client">Client</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label htmlFor="answer" className="block text-sm font-medium text-gray-800">Security Answer</label>
          <input
            type="text"
            id="answer"
            placeholder="Your favorite color?"
            value={userData.answer}
            onChange={(e) => setUserData({ ...userData, answer: e.target.value })}
            className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <span className="text-sm">Already have an account?</span>
        <Link
          to="/login"
          className="ml-2 text-indigo-600 hover:text-indigo-700"
        >
          Login here
        </Link>
      </div>
    </div>
  );
};

export default UserRegistration;
