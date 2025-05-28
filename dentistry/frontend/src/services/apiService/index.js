import realApiService from "./realApiService";

const isMockMode = import.meta.env.VITE_MOCK_MODE === "true";

const apiService = realApiService;

export default apiService;
