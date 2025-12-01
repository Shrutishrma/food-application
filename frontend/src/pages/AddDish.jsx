import { useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

export default function AddDish({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: null
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });

    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.description || !form.image) {
      toast.error("All fields including image are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("image", form.image);

    try {
      setLoading(true);
      await api.post("/create", formData);

      toast.success("Dish added successfully!");

      setForm({ name: "", price: "", description: "", image: null });
      setPreview(null);

      if (onSuccess) onSuccess(); // refresh menu
    } catch (err) {
      console.log(err);
      toast.error("Failed to add dish.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">

      <h1 className="text-2xl font-bold mb-4">Add New Dish</h1>

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-full h-40 object-cover rounded mb-3"
        />
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        <input
          className="border p-2 rounded"
          placeholder="Dish Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border p-2 rounded"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <textarea
          className="border p-2 rounded"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="file"
          className="border p-2 rounded"
          accept="image/*"
          onChange={handleImage}
        />

        <button
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-800 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Dish"}
        </button>
      </form>
    </div>
  );
}
