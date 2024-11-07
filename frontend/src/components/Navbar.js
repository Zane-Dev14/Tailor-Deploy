import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './Logout'; // Adjust the path as needed

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-center items-center space-x-4">
            <Link to="/" className="text-white">Home</Link>
            <Link to="/employees" className="text-white">Employees</Link>
            <Link to="/customers" className="text-white">Customers</Link>
            <Link to="/orders" className="text-white">Orders</Link>
        </div>
        <div className="absolute top-0 right-0 m-4">
            <LogoutButton />
        </div>
    </nav>
    );
};

export default Navbar;
