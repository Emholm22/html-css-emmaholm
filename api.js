const BASE_URL = "https://v2.api.noroff.dev";

export async function getProducts() {
  const res = await fetch(`${BASE_URL}/rainy-days`);
  if (!res.ok) throw new Error("Failed to load products.");
  const json = await res.json();
  return json.data;
}

export async function getProduct(id) {
  const res = await fetch(`${BASE_URL}/rainy-days/${id}`);
  if (!res.ok) throw new Error("Failed to load product.");
  const json = await res.json();
  return json.data;
}
