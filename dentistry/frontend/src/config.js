const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const config = {
    API_URL: VITE_API_URL
};

export { API_URL, VITE_API_URL };
export default config;