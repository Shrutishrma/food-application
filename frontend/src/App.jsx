import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Contact from './pages/Contact';
import AddDish from './pages/AddDish';
import EditDish from './pages/EditDish';  

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">

        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/add-dish" element={<AddDish />} />
          <Route path="/edit-dish/:id" element={<EditDish />} />  
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
