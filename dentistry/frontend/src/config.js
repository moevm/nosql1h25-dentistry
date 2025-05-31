const API_URL = import.meta.env.API_URL || 'http://localhost:8000';
const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const config = {
    API_URL: API_URL,
    VITE_API_URL: VITE_API_URL
};

export { API_URL };
export default config;