import React, { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function Menu() {
  const [dishes, setDishes] = useState([]);

  // Modal state
  const [openModal, setOpenModal] = useState(false);

  // Add Dish form states
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
      setOpenModal(false);

      // Reset fields
      setName("");
      setPrice("");
      setDesc("");
      setFile(null);
      setPreview(null);
    } catch {
      toast.error("Failed to add dish.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this dish?")) return;

    api
      .delete(`/delete/${id}`)
      .then(() => {
        toast.success("Dish deleted!");
        fetchDishes();
      })
      .catch(() => toast.error("Failed to delete dish"));
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Menu</h2>

        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => setOpenModal(true)}
        >
          + Add Dish
        </button>
      </div>

      {/* ADD DISH MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-3">Add a New Dish</h3>

            {preview && (
              <img
                src={preview}
                className="w-full h-40 object-cover rounded mb-3"
                alt="Preview"
              />
            )}

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-3">
              <input
                type="text"
                placeholder="Dish Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full"
                required
              />

              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border p-2 w-full"
                required
              />

              <textarea
                placeholder="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="border p-2 w-full"
                required
              />

              <input
                type="file"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setPreview(URL.createObjectURL(e.target.files[0]));
                }}
                className="border p-2 w-full"
                accept="image/*"
                required
              />

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Dish"}
              </button>

              <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded w-full mt-2"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DISH GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {dishes.map((dish) => (
          <div key={dish.id} className="bg-white rounded-lg shadow">
            <img
              src={
                dish.image_url
                  ? dish.image_url
                  : "https://via.placeholder.com/400x300?text=No+Image"
              }
              className="w-full h-40 object-cover"
            />

            <div className="p-3">
              <h3 className="font-bold text-lg">{dish.name}</h3>
              <p className="text-gray-600">{dish.description}</p>

              <div className="flex gap-2 mt-3">
                <Link
                  to={`/edit/${dish.id}`}
                  className="bg-orange-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(dish.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
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
