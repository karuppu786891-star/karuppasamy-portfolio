import nextEnv from "@next/env";
import { getAdminAuthConfigStatus } from "../src/lib/auth/environment.ts";

// Use the same env-file precedence and $ expansion as Next.js itself.
nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");
const status = getAdminAuthConfigStatus();

console.log(`ADMIN_EMAIL: ${status.emailValid ? "OK" : "MISSING"}`);
console.log(`ADMIN_PASSWORD_HASH: ${!status.hashPresent ? "MISSING" : status.hashValid ? "OK" : "INVALID_FORMAT"}`);
console.log(`AUTH_SECRET: ${status.secretValid ? "OK" : "MISSING"}`);
console.log(`DATABASE_URL: ${process.env.DATABASE_URL?.trim() ? "OK" : "MISSING"}`);

if (!status.configured || !process.env.DATABASE_URL?.trim()) process.exitCode = 1;
