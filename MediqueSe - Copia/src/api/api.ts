import axios from "axios";

const api = axios.create({
  baseURL: "https://mediquesetg.onrender.com",
  timeout: 10000, 
});

export default api;
