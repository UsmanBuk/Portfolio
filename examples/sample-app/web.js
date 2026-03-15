const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
const unsafePublicSecret = process.env.NEXT_PUBLIC_SECRET_KEY;

if (!apiBase) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is missing");
}

console.log("API base:", apiBase);
console.log("Potentially unsafe key:", unsafePublicSecret);

