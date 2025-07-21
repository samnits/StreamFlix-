import axios from "axios";
const BASE_URL=import.meta.env.MODE==='development'? 'http://localhost:5001/api' : '/api';

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
    withCredentials: true, // Enable cross-site requests with cookies
});