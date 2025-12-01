import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function Home() {
  return (
    <div className="min-h-[calc(100vh-60px)] bg-gray-50 flex flex-col items-center justify-center text-center p-4 overflow-hidden">
      <img 
        src={logo} 
        alt="Indian Food Logo" 
        className="w-full max-w-4xl h-auto max-h-[250px] mx-auto object-contain mb-6 drop-shadow-lg hover:scale-105 transition-transform duration-500" 
      />
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
        Welcome to <span className="text-orange-600">IndianFood</span>
      </h1>
      <p className="text-base text-gray-600 max-w-xl mb-8 leading-relaxed">
        Experience the authentic taste of India delivered straight to your doorstep. 
        Fresh ingredients, traditional recipes, and unforgettable flavors.
      </p>
      <div className="flex gap-3 justify-center">
        <Link to="/menu" className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-orange-700 transition shadow-md transform hover:-translate-y-1">
          View Menu
        </Link>
        <Link to="/contact" className="bg-white text-gray-800 border border-gray-300 px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition shadow-sm">
          Contact Us
        </Link>
      </div>

    </div>
  );
}

export default Home;