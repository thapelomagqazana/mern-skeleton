/**
 * Home Page Component
 *
 * - Displays a welcome message.
 * - Provides navigation links.
 * - Includes a beautiful background image from Unsplash.
 */

import React from "react";
import { Link } from "react-router-dom";
import backgroundImageUrl from "../assets/images/bridge.jpg";

const Home: React.FC = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div className="bg-white bg-opacity-80 p-10 rounded-lg shadow-lg text-center max-w-lg">
        <h1 className="text-4xl font-bold text-blue-600">Welcome to Our App</h1>
        <p className="mt-4 text-lg text-gray-700">
          This is a MERN skeleton application built with React, Vite, and TypeScript.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <Link
            to="/signup"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
          >
            Sign Up
          </Link>
          <Link
            to="/signin"
            className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-700 transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
