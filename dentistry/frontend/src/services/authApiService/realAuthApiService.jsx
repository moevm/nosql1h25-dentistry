import axios from "axios";

const api = axios.create({
  baseURL: "https://your-api.com",
  headers: {
    "Content-Type": "application/json",
  },
});

const authApiService = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
};

export default authApiService;
