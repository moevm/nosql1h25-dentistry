import realAuthApiService from "./realAuthApiService";

const isMockMode = import.meta.env.VITE_API_MOCK === "true";

if (isMockMode) {
  console.log("isMockMode:", isMockMode);
}

const apiService = isMockMode
  ? await import("./mockAuthApiService").then((mod) => mod.default)
  : realAuthApiService;

export default apiService;
