import { codeExists } from "./storage";

const CODE_REGEX = /^[A-Za-z0-9_-]{3,20}$/;

export function isValidUrl(str) {
  try {
    const u = new URL(str);
    return ["http:", "https:"].includes(u.protocol);
  } catch {
    return false;
  }
}

export function isValidCode(str) {
  return CODE_REGEX.test(str);
}

function randomCode(len = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function makeUniqueCode(preferred) {
  if (preferred && !codeExists(preferred)) return preferred;
  let code = preferred || randomCode();
  while (codeExists(code)) code = randomCode();
  return code;
}

export function minutesToExpiryTS(minutes) {
  const mins = Number.isFinite(+minutes) && +minutes > 0 ? +minutes : 30;
  return Date.now() + mins * 60 * 1000;
}

export function fmt(ts) {
  return new Date(ts).toLocaleString();
}
