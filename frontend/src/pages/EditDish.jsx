import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

export default function EditDish() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);

  // form fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch();
    // cleanup
    return () => preview && URL.revokeObjectURL(preview);
    // eslint-disable-next-line
  }, [id]);

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/dishes/${id}`);
      setDish(res.data);
      setName(res.data.name || "");
      setPrice(res.data.price || "");
      setDescription(res.data.description || "");
      setPreview(res.data.image_url || null);
    } catch (err) {
      toast.error("Unable to load dish");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name || !price || !description) return toast.error("Please fill all fields");

    const fd = new FormData();
    fd.append("name", name);
    fd.append("price", price);
    fd.append("description", description);
    if (file) fd.append("image", file);

    try {
      setSaving(true);
      await api.put(`/update/${id}`, fd);
      toast.success("Updated");
      navigate("/menu");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded" />
          <div className="h-6 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!dish) {
    return <div className="p-6">Dish not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Dish</h2>

      <form onSubmit={handleUpdate} className="space-y-4 bg-white p-5 rounded shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Preview</label>
          <div className="h-44 bg-gray-100 rounded overflow-hidden">
            <img
              src={preview || "https://via.placeholder.com/800x400?text=No+Image"}
              alt="preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Dish Name</label>
          <input
            className="w-full border rounded p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            step="0.01"
            className="w-full border rounded p-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full border rounded p-2"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Replace Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files[0];
              setFile(f);
              if (f) setPreview(URL.createObjectURL(f));
            }}
            className="w-full"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/menu")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
