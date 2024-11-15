import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { login } from '../api/api';

const Login = () => {
    const [authId, setAuthId] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login({ authId, password });
            // Store user info in localStorage
            localStorage.setItem('user', JSON.stringify(response.user)); // Save user info to localStorage
                localStorage.setItem('token', response.data.token); // Save token in localStorage
            console.log(localStorage);
            history.push('/'); // Redirect to home page
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Auth ID</label>
                        <input
                            type="text"
                            value={authId}
                            onChange={(e) => setAuthId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    {errorMessage && (
                        <div className="mb-4 text-red-500 text-sm">
                            {errorMessage}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
