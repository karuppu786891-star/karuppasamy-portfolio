export const BCRYPT_HASH_PATTERN = /^\$2[aby]\$(?:0[4-9]|[12]\d|3[01])\$[./A-Za-z0-9]{53}$/;
const ADMIN_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getAdminAuthConfigStatus(env: NodeJS.ProcessEnv = process.env) {
  const emailValid = ADMIN_EMAIL_PATTERN.test(env.ADMIN_EMAIL?.trim() ?? "");
  const hash = env.ADMIN_PASSWORD_HASH ?? "";
  const hashValid = BCRYPT_HASH_PATTERN.test(hash);
  const secretValid = (env.AUTH_SECRET?.length ?? 0) >= 32;

  return {
    emailValid,
    hashPresent: Boolean(hash),
    hashValid,
    secretValid,
    configured: emailValid && hashValid && secretValid,
  };
}
