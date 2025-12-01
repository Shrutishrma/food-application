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
    <div className="max-w-7xl mx-auto p-6">

      {/* PAGE TITLE */}
      <h2 className="text-3xl font-bold mb-8">Menu</h2>

      {/* 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT SIDE – ADD FORM */}
        <div className="bg-white p-6 rounded-xl shadow-md border lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4">Add New Dish</h3>

          {preview && (
            <img
              src={preview}
              className="w-full h-40 rounded object-cover mb-3"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
            >
              {loading ? "Adding..." : "Add Dish"}
            </button>
          </form>
        </div>

        {/* RIGHT SIDE – DISH GRID */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">

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
                    to={`/edit-dish/${dish.id}`}
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
    </div>
  );
}

export default Menu;
