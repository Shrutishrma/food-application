import { useState } from "react";
import axios from "axios";

export default function AddDish() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image_url: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Because backend expects a FILE upload
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("image", form.image_url); // multer expects the field name "image"

    await axios.post("http://localhost:8081/create", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    alert("Dish added successfully!");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Dish</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        <input
          className="border p-2 rounded"
          placeholder="Dish Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border p-2 rounded"
          placeholder="Price"
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <textarea
          className="border p-2 rounded"
          placeholder="Description"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* This matches your multer upload.single("image") */}
        <input
          type="file"
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, image_url: e.target.files[0] })}
        />

        <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-800">
          Add Dish
        </button>

      </form>
    </div>
  );
}
