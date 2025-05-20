export const extractNumber = (str: string): number => {
  if (!str) return 0;
  // Match the first sequence of digits in the string
  const match = str.match(/\d+/);
  return match ? Number(match[0]) : 0;
};

type TokenPayload = { exp?: number } | null;
export const isTokenValid = (token: string): boolean => {
  try {
    const [, payload] = token.split(".");
    if (!payload) return false;

    const decoded = JSON.parse(atob(payload)) as TokenPayload;

    if (!decoded?.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp > now;
  } catch {
    return false;
  }
};
