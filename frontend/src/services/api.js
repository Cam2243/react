import axios from "axios";

const api = axios.create({
  baseURL: "https://obscure-space-giggle-jv65794j66phqgxr-3000.app.github.dev",
  withCredentials: true
});

export default api;