import { randomBytes } from "node:crypto";

console.log(randomBytes(32).toString("base64url"));
console.log("Add this value as AUTH_SECRET in .env. This value is printed once; keep it private.");
