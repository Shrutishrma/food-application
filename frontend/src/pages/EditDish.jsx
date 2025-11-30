import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditDish() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dish, setDish] = useState({
    name: "",
    price: "",
    description: ""
  });

  useEffect(() => {
    axios.get(`http://localhost:8081/dishes/${id}`)
      .then(res => setDish(res.data[0]))
      .catch(err => console.log(err));
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8081/update/${id}`, dish)
      .then(() => navigate("/menu"))
      .catch(err => console.log(err));
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Edit Dish</h2>

      <form className="flex flex-col gap-3" onSubmit={handleUpdate}>

        <input className="border p-2 rounded"
          value={dish.name}
          onChange={(e) => setDish({ ...dish, name: e.target.value })}
        />

        <input className="border p-2 rounded"
          value={dish.price}
          onChange={(e) => setDish({ ...dish, price: e.target.value })}
        />

        <textarea className="border p-2 rounded"
          value={dish.description}
          onChange={(e) => setDish({ ...dish, description: e.target.value })}
        />

        <button className="bg-orange-600 text-white rounded p-2">
          Update Dish
        </button>

      </form>
    </div>
  );
}

export default EditDish;
