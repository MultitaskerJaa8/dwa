export async function api(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    credentials: "include"
  });

  const isJSON = res.headers.get("content-type")?.includes("application/json");

  if (!res.ok) {
    const data = isJSON ? await res.json().catch(() => ({})) : {};
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return isJSON ? res.json() : res;
}