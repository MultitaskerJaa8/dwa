const http = require("http");

function loadEnvFile(file) {
  const fs = require("fs");
  if (!fs.existsSync(file)) return;
  const txt = fs.readFileSync(file, "utf8");
  for (const line of txt.split(/\r?\n/)) {
    const l = line.trim();
    if (!l || l.startsWith("#")) continue;
    const idx = l.indexOf("=");
    if (idx === -1) continue;
    const k = l.slice(0, idx).trim();
    let v = l.slice(idx + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!process.env[k]) process.env[k] = v;
  }
}

async function fetchJSON(url, options) {
  const { default: fetch } = await import("node-fetch").catch(() => ({ default: global.fetch }));
  const res = await fetch(url, options);
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch {}
  if (!res.ok) throw new Error((json && json.message) || text || `HTTP ${res.status}`);
  return json;
}

function isServerUp(url) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const req = http.request(
        { method: "GET", hostname: u.hostname, port: u.port || 80, path: "/login" },
        () => resolve(true)
      );
      req.on("error", () => resolve(false));
      req.end();
    } catch {
      resolve(false);
    }
  });
}

async function main() {
  // load env from .env.local then .env
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  const argUrl = process.argv.find((a) => a.startsWith("--url="));
  const argKey = process.argv.find((a) => a.startsWith("--key="));

  const baseUrl = argUrl ? argUrl.split("=")[1] : "http://localhost:3000";
  const key = argKey ? argKey.split("=")[1] : process.env.ADMIN_BOOTSTRAP_KEY;

  if (!key) {
    console.log("Missing ADMIN_BOOTSTRAP_KEY");
    console.log("Use: npm run seed -- --url=http://localhost:3000 --key=YOUR_KEY");
    process.exit(1);
  }

  const up = await isServerUp(baseUrl);
  if (!up && baseUrl.includes("localhost")) {
    console.log("Server not running. Start it in another terminal: npm run dev");
    console.log("Then run: npm run seed");
    process.exit(1);
  }

  const out = await fetchJSON(`${baseUrl}/api/bootstrap/seed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, resetPasswords: true })
  });

  console.log("Seed done:", out);
}

main().catch((e) => {
  console.error("Seed failed:", e.message);
  process.exit(1);
});