// src/api.js
const API_BASE_URL =
import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function getToken() {
return localStorage.getItem('token');
}

export async function apiFetch(path, options = {}) {
const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
};

const token = getToken();
if (token) {
    headers.Authorization = `Bearer ${token}`;
}

const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
});

let data = null;
try {
    data = await res.json();
} catch {
    // kalau backend tidak mengirim JSON
}

if (!res.ok) {
    throw new Error(data?.message || `Request failed: ${res.status}`);
}

return data;
}
