import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Menu() {
  const [dishes, setDishes] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => { fetchDishes(); }, []);

  const fetchDishes = () => {
    axios.get('http://localhost:8081/dishes')
      .then(res => setDishes(res.data))
      .catch(err => console.log(err));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', desc);
    formData.append('image', file);

    axios.post('http://localhost:8081/create', formData)
      .then(() => { window.location.reload(); })
      .catch(err => console.log(err));
  };

  const handleDelete = (id) => {
    axios.delete('http://localhost:8081/delete/'+id)
      .then(() => fetchDishes())
      .catch(err => console.log(err));
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        
        {/* FORM - Smaller padding and fonts */}
        <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-md sticky top-4 border-t-4 border-orange-600">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Add New Item</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input type="text" placeholder="Dish Name" className="border p-2 rounded text-sm bg-gray-50 focus:outline-orange-500" onChange={e => setName(e.target.value)} required />
            <input type="number" placeholder="Price (₹)" className="border p-2 rounded text-sm bg-gray-50 focus:outline-orange-500" onChange={e => setPrice(e.target.value)} required />
            <input type="file" className="border p-1 rounded text-xs bg-gray-50" onChange={e => setFile(e.target.files[0])} required />
            <textarea placeholder="Description..." className="border p-2 rounded text-sm bg-gray-50 focus:outline-orange-500" onChange={e => setDesc(e.target.value)} rows="3"/>
            <button className="bg-orange-600 text-white font-bold py-2 rounded text-sm hover:bg-orange-700 transition">Add to Menu</button>
          </form>
        </div>

        {/* LIST - Compact Cards */}
        <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dishes.map((dish) => (
            <div key={dish.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition group">
              <div className="h-40 overflow-hidden relative">
                <img src={`http://localhost:8081/images/${dish.image_url}`} alt={dish.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                     onError={(e) => {e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'}}/>
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 rounded text-xs font-bold text-gray-800 shadow-sm">₹{dish.price}</div>
              </div>
              <div className="p-3">
                  <h3 className="text-base font-bold text-gray-800">{dish.name}</h3>
                  <p className="text-gray-500 text-xs mt-1 mb-3 line-clamp-2">{dish.description}</p>
                  <button onClick={() => handleDelete(dish.id)} className="w-full py-1 border border-red-100 text-red-500 rounded text-xs font-semibold hover:bg-red-50 transition">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Menu;