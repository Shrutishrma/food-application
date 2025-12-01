import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

function EditDish() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dish, setDish] = useState(null);
  const [preview, setPreview] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/dishes/${id}`)
      .then((res) => {
        setDish(res.data);
        setPreview(res.data.image_url); // Cloudinary URL
      })
      .catch(() => toast.error("Dish not found."));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!dish.name || !dish.price || !dish.description) {
      toast.error("All fields except image are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", dish.name);
    formData.append("price", dish.price);
    formData.append("description", dish.description);

    if (newImage) formData.append("image", newImage);

    try {
      setLoading(true);
      await api.put(`/update/${id}`, formData);

      toast.success("Dish updated successfully!");
      navigate("/menu");
    } catch {
      toast.error("Failed to update dish.");
    } finally {
      setLoading(false);
    }
  };

  if (!dish) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Edit Dish</h2>

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-full h-40 object-cover mb-3 rounded"
        />
      )}

      <form className="flex flex-col gap-3" onSubmit={handleUpdate}>
        <input
          className="border p-2 rounded"
          value={dish.name}
          onChange={(e) => setDish({ ...dish, name: e.target.value })}
        />

        <input
          className="border p-2 rounded"
          value={dish.price}
          onChange={(e) => setDish({ ...dish, price: e.target.value })}
        />

        <textarea
          className="border p-2 rounded"
          value={dish.description}
          onChange={(e) => setDish({ ...dish, description: e.target.value })}
        />

        <input
          type="file"
          className="border p-2 rounded"
          accept="image/*"
          onChange={(e) => {
            setNewImage(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
          }}
        />

        <button className="bg-orange-600 text-white rounded p-2 disabled:bg-gray-400" disabled={loading}>
          {loading ? "Updating..." : "Update Dish"}
        </button>
      </form>
    </div>
  );
}

export default EditDish;
