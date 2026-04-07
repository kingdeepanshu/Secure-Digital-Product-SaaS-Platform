import axios from "axios";

const API = axios.create({
  baseURL: "https://secure-digital-product-saas-platform.onrender.com", // or your render URL
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export default API;