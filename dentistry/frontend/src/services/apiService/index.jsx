import realApiService from "./realApiService";

const isMockMode = import.meta.env.VITE_API_MOCK === "true";

if (isMockMode) {
  console.log("isMockMode:", isMockMode);
}

const apiService = isMockMode
  ? await import("./mockApiService").then((mod) => mod.default)
  : realApiService;

export default apiService;
