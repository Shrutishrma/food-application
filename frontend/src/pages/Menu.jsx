import React, { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function Menu() {
  const [dishes, setDishes] = useState([]);

  // Add Form
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = () => {
    api
      .get("/dishes")
      .then((res) => setDishes(res.data))
      .catch(() => toast.error("Failed to load dishes!"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !desc || !file) {
      toast.error("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", desc);
    formData.append("image", file);

    try {
      setLoading(true);
      await api.post("/create", formData);
      toast.success("Dish added successfully!");
      fetchDishes();

      // reset form
      setName("");
      setPrice("");
      setDesc("");
      setFile(null);
      setPreview(null);
    } catch (err) {
      toast.error("Failed to add dish.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* HEADER */}
      <h2 className="text-3xl font-bold mb-6">Menu</h2>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* --- ADD DISH BOX (INLINE) --- */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
          <h3 className="text-xl font-semibold mb-3">Add New Dish</h3>

          {preview && (
            <img
              src={preview}
              className="w-full h-40 rounded object-cover mb-3"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Dish Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full rounded"
            />

            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border p-2 w-full rounded"
            />

            <textarea
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="border p-2 w-full rounded"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
              }}
              className="border p-2 w-full rounded"
            />

            <button
              type="submit"
              className="bg-green-600 text-white font-semibold px-4 py-2 rounded w-full hover:bg-green-700 transition"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Dish"}
            </button>
          </form>
        </div>

        {/* --- EXISTING DISHES --- */}
        {dishes.map((dish) => (
          <div
            key={dish.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
          >
            <img
              src={
                dish.image_url
                  ? dish.image_url
                  : "https://via.placeholder.com/400x300?text=No+Image"
              }
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            />

            <div className="p-4">
              <h3 className="font-bold text-xl">{dish.name}</h3>
              <p className="text-gray-600 mb-3">{dish.description}</p>

              <div className="flex gap-3">
                <Link
                  to={`/edit/${dish.id}`}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                >
                  Edit
                </Link>

                <button
                  onClick={() => {
                    if (confirm("Delete this item?")) {
                      api.delete(`/delete/${dish.id}`).then(() => {
                        toast.success("Deleted!");
                        fetchDishes();
                      });
                    }
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Menu;
