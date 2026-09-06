const urlArg = process.argv.find((a) => a.startsWith("--url="));
const keyArg = process.argv.find((a) => a.startsWith("--key="));

const BASE_URL = urlArg ? urlArg.split("=")[1] : "http://localhost:3000";
const KEY = keyArg ? keyArg.split("=")[1] : "";

if (!KEY) {
  console.log("Usage: npm run seed -- --url=http://localhost:3000 --key=YOUR_ADMIN_BOOTSTRAP_KEY");
  process.exit(1);
}

(async () => {
  const res = await fetch(`${BASE_URL}/api/bootstrap/seed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: KEY })
  });

  const text = await res.text();
  console.log("Status:", res.status);
  console.log(text);
})();