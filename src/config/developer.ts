 // Developer role configuration
// Define developer accounts by email without touching the DB enum.
// Configure via .env (VITE_DEVELOPER_EMAILS) as a comma-separated list.
// Example: VITE_DEVELOPER_EMAILS=dev1@example.com,dev2@example.com

function parseList(raw: unknown): string[] {
  if (typeof raw !== "string") return [];
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.includes("@"));
}

// Read from Vite env at build time
const envList = parseList((import.meta as any)?.env?.VITE_DEVELOPER_EMAILS);

// Optional client-side override for local dev/testing
// Run in devtools: localStorage.setItem('DEV_EMAILS', 'me@example.com,other@example.com')
const lsRaw = typeof window !== "undefined" ? window.localStorage.getItem("DEV_EMAILS") : null;
const lsList = parseList(lsRaw || undefined);

// Hardcoded developer emails that should always be recognized
const hardcodedList = [
  'artist2819@gmail.com',
  'demo@talent.com', // Demo user for trailer
];

// Merge unique emails
export const DEVELOPER_EMAILS: string[] = Array.from(new Set([ ...envList, ...lsList, ...hardcodedList ]));

export function isDeveloperEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const e = email.trim().toLowerCase();
  return DEVELOPER_EMAILS.includes(e);
}
