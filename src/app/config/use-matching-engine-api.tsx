export function useMatchingEngineApi() {
  const baseUrl = process.env.NEXT_PUBLIC_MATCHING_ENGINE_BASE_URL ?? "";
  const apiKey = process.env.NEXT_PUBLIC_MATCHING_ENGINE_API_KEY ?? "";

  return { baseUrl, apiKey };
}
