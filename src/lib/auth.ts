import { cookies } from "next/headers";

export const adminCookieName = "heidi_admin_session";

export function getAdminPassword(): string {
  return process.env.NEXT_ADMIN_PASSWORD?.trim() || "LipTipsIsAGoodCat";
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get(adminCookieName)?.value === "1";
}
