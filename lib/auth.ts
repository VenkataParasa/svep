// Demo-only authentication. There is no real backend or session store —
// this exists purely to gate the Admin Panel for the presales demo.
export const DEMO_ADMIN_USERNAME = "admin";
export const DEMO_ADMIN_PASSWORD = "admin123";
export const ADMIN_COOKIE_NAME = "svep_admin";

export function setAdminCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${ADMIN_COOKIE_NAME}=1; path=/; max-age=${60 * 60 * 8}; SameSite=Lax`;
}

export function clearAdminCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${ADMIN_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

export function verifyDemoCredentials(username: string, password: string): boolean {
  return username === DEMO_ADMIN_USERNAME && password === DEMO_ADMIN_PASSWORD;
}
