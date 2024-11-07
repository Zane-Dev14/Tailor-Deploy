// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div
            className="bg-cover bg-center min-h-screen flex flex-col justify-center items-center p-6"
            style={{ backgroundImage: "url('https://www.huntsmansavilerow.com/cdn/shop/files/Kingsman_Web_Image_4_900x.png?v=1672752439')" }}
        >
            {/* Semi-transparent overlay */}
            <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

            {/* Content on top of the overlay */}
            <div className="relative z-10 text-center text-white max-w-2xl">
                <h1 className="text-5xl font-extrabold mb-8">
                    Welcome to the Tailor Shop Management System
                </h1>
                <p className="mb-12 text-lg text-gray-200">
                    Efficiently manage employees and orders with ease.
                </p>
                <div className="flex space-x-4">
                    <Link
                        to="/employees"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg transition duration-300 ease-in-out"
                    >
                        Manage Employees
                    </Link>
                    <Link
                        to="/orders"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg transition duration-300 ease-in-out"
                    >
                        Manage Orders
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
