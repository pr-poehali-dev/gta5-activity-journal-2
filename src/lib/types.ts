export const API_AUTH = "https://functions.poehali.dev/0faae4ff-54b8-40f4-988a-aa6bbebd01f0";
export const API_USERS = "https://functions.poehali.dev/93e60fdd-bf88-468d-88c8-f312a5f61460";

export type Role = "user" | "leader" | "admin" | "curator";
export type Status = "online" | "afk" | "offline";
export type Tab = "stats" | "leaderboard" | "users" | "moderation" | "admin_panel";

export interface Player {
  id: number;
  username: string;
  rank: string;
  title: string;
  role: Role;
  status: Status;
  level: number;
  xp: number;
  xpMax: number;
  reputation: number;
  onlineToday: number;
  onlineWeek: number;
  warnings: number;
  weekActivity?: number[]; // минуты за каждый день недели [Пн..Вс]
}

export interface AuthUser extends Player { token: string; }

export const ROLE_LABELS: Record<Role, string> = {
  user: "ИГРОК", leader: "ЛИДЕР", admin: "АДМИНИСТРАТОР", curator: "КУРАТОР",
};

export const STATUS_COLORS: Record<Status, string> = {
  online: "bg-emerald-400 dot-online",
  afk: "bg-amber-400 dot-afk",
  offline: "bg-zinc-600",
};

export const STATUS_LABELS: Record<Status, string> = {
  online: "ОНЛАЙН", afk: "АФК", offline: "ОФЛАЙН",
};

export const MOCK_USERS: (Player & { token: string; password: string })[] = [
  { id: 1, username: "BlackStar_IX", password: "curator123", token: "mock-token-1", rank: "IV", title: "Командующий", role: "curator", status: "online", level: 87, xp: 8700, xpMax: 10000, reputation: 9850, onlineToday: 312, onlineWeek: 2140, warnings: 0, weekActivity: [285, 310, 190, 340, 270, 312, 433] },
  { id: 2, username: "Nexus_Prime",  password: "admin123",   token: "mock-token-2", rank: "III", title: "Генерал",     role: "admin",   status: "online", level: 64, xp: 6400, xpMax: 7000,  reputation: 7200, onlineToday: 185, onlineWeek: 1340, warnings: 0, weekActivity: [145, 200, 185, 220, 185, 160, 245] },
  { id: 3, username: "Shadow_Wolf",  password: "leader123",  token: "mock-token-3", rank: "II",  title: "Майор",       role: "leader",  status: "online", level: 42, xp: 4200, xpMax: 5000,  reputation: 4800, onlineToday: 220, onlineWeek: 1560, warnings: 0, weekActivity: [180, 240, 110, 260, 220, 330, 220] },
  { id: 4, username: "Ghost_Rider",  password: "user123",    token: "mock-token-4", rank: "I",   title: "Сержант",     role: "user",    status: "online", level: 21, xp: 2100, xpMax: 3000,  reputation: 2300, onlineToday: 130, onlineWeek: 890,  warnings: 0, weekActivity: [90,  130,  45, 180,  95, 130, 220] },
];

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}ч ${m}м` : `${m}м`;
}

export async function apiPost(url: string, body: object) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { ok: res.ok, data: typeof data === "string" ? JSON.parse(data) : data };
}

export async function apiGet(url: string) {
  const res = await fetch(url);
  const data = await res.json();
  return { ok: res.ok, data: typeof data === "string" ? JSON.parse(data) : data };
}