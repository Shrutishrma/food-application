import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold flex items-center gap-2 hover:opacity-90 transition">
              <span className="text-2xl">🥘</span> 
              <span><span className="text-orange-500">Indian</span>Food</span>
          </Link>

          {/* Links - Smaller text */}
          <div className="flex gap-6 text-sm font-medium text-gray-300">
              <Link to="/" className="hover:text-orange-500 transition">Home</Link>
              <Link to="/menu" className="hover:text-orange-500 transition">Menu</Link>
              <Link to="/contact" className="hover:text-orange-500 transition">Contact</Link>
          </div>
      </div>
    </nav>
  );
}

export default Navbar;