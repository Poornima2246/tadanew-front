import axios from "axios";

const API = axios.create({
  baseURL: " https://tadanew-bac.onrender.com/api", // backend url
});

// user routes
export const registerUser = (data) => API.post("/users/register", data);
export const loginUser = (data) => API.post("/users/login", data);

// seller routes
export const registerSeller = (data) => API.post("/sellers/register", data);
export const loginSeller = (data) => API.post("/sellers/login", data);

// product routes
export const getProducts = () => API.get("/products");
export const createProduct = (data, token) =>
  API.post("/products", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// order routes
export const createOrder = (data, token) =>
  API.post("/orders", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// payment routes
export const makePayment = (data) => API.post("/payment", data);
export const verifyPayment = (data) => API.post("/payment/verify", data);