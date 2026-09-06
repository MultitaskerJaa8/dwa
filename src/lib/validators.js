export function isEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").toLowerCase());
}

export function required(value, name = "field") {
  if (!value || String(value).trim() === "") {
    throw Object.assign(new Error(`${name} is required`), { statusCode: 400 });
  }
}