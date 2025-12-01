import axios from "axios";

const API =
  import.meta.env.VITE_API_URL ||
  "https://food-application-pu9i.onrender.com"; // fallback if Netlify ENV fails

console.log("Frontend using API:", API);

const api = axios.create({
  baseURL: API,
});

export default api;
