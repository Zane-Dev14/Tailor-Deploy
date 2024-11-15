import React from 'react';
import { useHistory } from 'react-router-dom';
import { logout } from '../api/api';

const LogoutButton = () => {
    const history = useHistory();

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem('user'); // Remove user from localStorage
    localStorage.removeItem('token'); // Clear token from localStorage
    history.push('/login'); // Redirect to login page
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200">
            Logout
        </button>
    );
};

export default LogoutButton;
