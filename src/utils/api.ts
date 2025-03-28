const API_URL = "/api";

export async function fetchHello() {
  const response = await fetch(`${API_URL}/hello`);
  return response.json();
}
