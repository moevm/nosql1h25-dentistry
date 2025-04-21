import realApiService from "./realApiService";

const isMockMode = import.meta.env.VITE_MOCK_MODE === "true";

const apiService = isMockMode
  ? await import("./mockApi").then((mod) => mod.default)
  : realApiService;

export default apiService;
