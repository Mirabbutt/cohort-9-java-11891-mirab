import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create an axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Automatically attach the auth token to every request (if logged in)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ---------- Auth APIs ----------
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const changePassword = (data) => api.post('/auth/change-password', data);

// ---------- Contact APIs ----------
export const getContacts = (page = 0, size = 10) =>
    api.get(`/contacts?page=${page}&size=${size}`);

export const searchContacts = (keyword, page = 0, size = 10) =>
    api.get(`/contacts/search?keyword=${keyword}&page=${page}&size=${size}`);

export const getContactById = (id) => api.get(`/contacts/${id}`);

export const createContact = (data) => api.post('/contacts', data);

export const updateContact = (id, data) => api.put(`/contacts/${id}`, data);

export const deleteContact = (id) => api.delete(`/contacts/${id}`);

export default api;