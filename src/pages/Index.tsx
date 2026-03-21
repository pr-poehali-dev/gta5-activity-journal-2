import { useState } from "react";
import Icon from "@/components/ui/icon";

type Role = "user" | "leader" | "admin" | "curator";
type Status = "online" | "afk" | "offline";
type Tab = "stats" | "leaderboard" | "users" | "moderation" | "admin_panel";

interface Player {
  id: number;
  name: string;
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
}

const MOCK_PLAYERS: Player[] = [
  { id: 1, name: "BlackStar_IX", rank: "IV", title: "Командующий", role: "curator", status: "online", level: 87, xp: 8700, xpMax: 10000, reputation: 9850, onlineToday: 312, onlineWeek: 2140, warnings: 0 },
  { id: 2, name: "Nexus_Prime", rank: "III", title: "Генерал", role: "admin", status: "online", level: 64, xp: 6400, xpMax: 7000, reputation: 7200, onlineToday: 185, onlineWeek: 1340, warnings: 0 },
  { id: 3, name: "Viktor_AFK", rank: "III", title: "Полковник", role: "admin", status: "afk", level: 58, xp: 5800, xpMax: 7000, reputation: 6100, onlineToday: 95, onlineWeek: 980, warnings: 1 },
  { id: 4, name: "Shadow_Wolf", rank: "II", title: "Майор", role: "leader", status: "online", level: 42, xp: 4200, xpMax: 5000, reputation: 4800, onlineToday: 220, onlineWeek: 1560, warnings: 0 },
  { id: 5, name: "R3aper_X", rank: "II", title: "Лейтенант", role: "leader", status: "afk", level: 38, xp: 3800, xpMax: 5000, reputation: 3900, onlineToday: 45, onlineWeek: 720, warnings: 2 },
  { id: 6, name: "Ghost_Rider", rank: "I", title: "Сержант", role: "user", status: "online", level: 21, xp: 2100, xpMax: 3000, reputation: 2300, onlineToday: 130, onlineWeek: 890, warnings: 0 },
  { id: 7, name: "CrimeWave99", rank: "I", title: "Рядовой", role: "user", status: "offline", level: 12, xp: 1200, xpMax: 2000, reputation: 980, onlineToday: 0, onlineWeek: 245, warnings: 3 },
  { id: 8, name: "Neon_Drift", rank: "I", title: "Новобранец", role: "user", status: "online", level: 7, xp: 700, xpMax: 1000, reputation: 450, onlineToday: 78, onlineWeek: 310, warnings: 0 },
];

const CURRENT_USER: Player = MOCK_PLAYERS[3];
const VIEWER_ROLE: Role = "admin";

const ROLE_LABELS: Record<Role, string> = {
  user: "ИГРОК",
  leader: "ЛИДЕР",
  admin: "АДМИНИСТРАТОР",
  curator: "КУРАТОР",
};

const STATUS_COLORS: Record<Status, string> = {
  online: "bg-green-400 dot-online",
  afk: "bg-yellow-400 dot-afk",
  offline: "bg-gray-600",
};

const STATUS_LABELS: Record<Status, string> = {
  online: "ОНЛАЙН",
  afk: "АФК",
  offline: "ОФЛАЙН",
};

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}ч ${m}м` : `${m}м`;
}

function RoleBadge({ role }: { role: Role }) {
  const cls: Record<Role, string> = {
    user: "text-gray-400 border-gray-600",
    leader: "text-yellow-400 border-yellow-700",
    admin: "text-cyan-400 border-cyan-800",
    curator: "text-orange-400 border-orange-700",
  };
  return (
    <span className={`text-[10px] font-hud tracking-widest px-2 py-0.5 border rounded-sm ${cls[role]}`}>
      {ROLE_LABELS[role]}
    </span>
  );
}

function StatusDot({ status }: { status: Status }) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${STATUS_COLORS[status]}`} />
  );
}

function XPBar({ value, max, color = "xp-bar" }: { value: number; max: number; color?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden w-full">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function StatCard({ label, value, icon, sub, delay = 0 }: {
  label: string; value: string; icon: string; sub?: string; delay?: number;
}) {
  return (
    <div
      className="hud-panel stat-card p-4 animate-fade-in"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-hud tracking-widest text-gray-500 uppercase">{label}</span>
        <Icon name={icon} size={14} className="text-yellow-400/60" />
      </div>
      <div className="font-hud text-2xl neon-gold">{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1 font-mono-hud">{sub}</div>}
    </div>
  );
}

function PlayerRow({ player, index, canEdit }: { player: Player; index: number; canEdit: boolean }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="animate-fade-in" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
      <div
        className={`flex items-center gap-3 px-4 py-3 border border-transparent hover:border-yellow-400/20 hover:bg-white/[0.02] transition-all cursor-pointer rounded-sm ${expanded ? 'border-yellow-400/20 bg-white/[0.02]' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="font-hud text-xs text-gray-600 w-5 text-center">{index + 1}</div>
        <StatusDot status={player.status} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-hud text-sm tracking-wide text-gray-100">{player.name}</span>
            <span className="rank-badge text-[9px] font-hud px-2 py-0.5 text-yellow-400/80">RNK {player.rank}</span>
          </div>
          <div className="text-[10px] text-gray-600 font-mono-hud">{player.title}</div>
        </div>
        <div className="hidden sm:block">
          <RoleBadge role={player.role} />
        </div>
        <div className="text-right">
          <div className="font-hud text-sm neon-gold">LVL {player.level}</div>
          <div className="text-[10px] text-gray-600 font-mono-hud">{player.reputation.toLocaleString()} REP</div>
        </div>
        <div className="hidden md:block text-right w-20">
          <div className="text-xs text-gray-400 font-mono-hud">{formatTime(player.onlineToday)}</div>
          <div className="text-[10px] text-gray-600 font-mono-hud">сегодня</div>
        </div>
        <Icon name={expanded ? "ChevronUp" : "ChevronDown"} size={14} className="text-gray-600" />
      </div>

      {expanded && (
        <div className="mx-4 mb-2 p-3 bg-black/30 border border-yellow-400/10 rounded-sm animate-scale-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <div>
              <div className="text-[10px] text-gray-600 font-hud tracking-wider mb-1">ОНЛАЙН НЕДЕЛЯ</div>
              <div className="text-sm font-mono-hud text-gray-300">{formatTime(player.onlineWeek)}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-600 font-hud tracking-wider mb-1">СТАТУС</div>
              <div className={`text-sm font-mono-hud ${player.status === 'online' ? 'neon-green' : player.status === 'afk' ? 'text-yellow-400' : 'text-gray-500'}`}>
                {STATUS_LABELS[player.status]}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-600 font-hud tracking-wider mb-1">ПРЕДУПРЕЖДЕНИЯ</div>
              <div className={`text-sm font-mono-hud ${player.warnings > 0 ? 'neon-red' : 'text-gray-500'}`}>
                {player.warnings > 0 ? `⚠ ${player.warnings}` : '—'}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-600 font-hud tracking-wider mb-1">XP</div>
              <div className="text-sm font-mono-hud text-gray-300">{player.xp.toLocaleString()} / {player.xpMax.toLocaleString()}</div>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-600 font-hud w-16">XP</span>
              <XPBar value={player.xp} max={player.xpMax} color="xp-bar" />
              <span className="text-[10px] font-mono-hud text-gray-500">{Math.round((player.xp / player.xpMax) * 100)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-600 font-hud w-16">REP</span>
              <XPBar value={player.reputation} max={10000} color="rep-bar" />
              <span className="text-[10px] font-mono-hud text-gray-500">{Math.round((player.reputation / 10000) * 100)}%</span>
            </div>
          </div>

          {canEdit && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
              <button className="btn-hud text-[10px] font-hud tracking-wider px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-sm hover:bg-yellow-400/20 transition-all">
                РЕДАКТИРОВАТЬ
              </button>
              <button className="btn-hud text-[10px] font-hud tracking-wider px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-sm hover:bg-red-500/20 transition-all">
                ПРЕДУПРЕЖДЕНИЕ
              </button>
              <button className="btn-hud text-[10px] font-hud tracking-wider px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-sm hover:bg-cyan-500/20 transition-all">
                ИЗМЕНИТЬ РАНГ
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("stats");
  const [myStatus, setMyStatus] = useState<Status>("online");
  const [viewerRole] = useState<Role>(VIEWER_ROLE);

  const canAccessAdmin = viewerRole === "admin" || viewerRole === "curator";
  const canManageUsers = viewerRole === "admin" || viewerRole === "curator" || viewerRole === "leader";
  const canSeeFullStats = viewerRole === "curator";

  const TABS: { id: Tab; label: string; icon: string; visible: boolean }[] = [
    { id: "stats", label: "СТАТИСТИКА", icon: "Activity", visible: true },
    { id: "leaderboard", label: "РЕЙТИНГ", icon: "Trophy", visible: true },
    { id: "users", label: "УЧАСТНИКИ", icon: "Users", visible: canManageUsers },
    { id: "moderation", label: "МОДЕРАЦИЯ", icon: "Shield", visible: canManageUsers },
    { id: "admin_panel", label: "ПАНЕЛЬ АДМН", icon: "Settings", visible: canAccessAdmin },
  ].filter(t => t.visible);

  const onlinePlayers = MOCK_PLAYERS.filter(p => p.status === "online").length;
  const afkPlayers = MOCK_PLAYERS.filter(p => p.status === "afk").length;
  const totalOnlineToday = MOCK_PLAYERS.reduce((s, p) => s + p.onlineToday, 0);
  const sorted = [...MOCK_PLAYERS].sort((a, b) => b.reputation - a.reputation);

  return (
    <div className="hud-scanlines min-h-screen bg-[#070a10] text-gray-200 font-body">

      {/* Top HUD bar */}
      <div className="border-b border-yellow-400/20 bg-black/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-400 flex items-center justify-center rounded-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)' }}>
              <Icon name="Zap" size={14} className="text-black" />
            </div>
            <div>
              <div className="font-hud text-sm tracking-widest text-yellow-400 leading-none">АФК ЖУРНАЛ</div>
              <div className="font-mono-hud text-[9px] text-gray-600 tracking-widest">GTA ACTIVITY HUB v2.0</div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 dot-online" />
              <span className="font-mono-hud text-xs text-gray-400">{onlinePlayers} онлайн</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 dot-afk" />
              <span className="font-mono-hud text-xs text-gray-400">{afkPlayers} АФК</span>
            </div>
            <div className="font-mono-hud text-xs text-gray-600">
              {new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="font-hud text-xs tracking-wide text-gray-200">{CURRENT_USER.name}</div>
              <RoleBadge role={viewerRole} />
            </div>
            <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 border border-yellow-400/30 flex items-center justify-center">
              <Icon name="User" size={14} className="text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* My profile card */}
        <div className="hud-panel p-4 mb-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative">
                <div className="w-14 h-14 rounded-sm bg-gradient-to-br from-yellow-400/20 to-transparent border border-yellow-400/40 flex items-center justify-center">
                  <Icon name="User" size={24} className="text-yellow-400" />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-black ${STATUS_COLORS[myStatus]}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-hud text-lg tracking-wider text-yellow-400">{CURRENT_USER.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="rank-badge text-[10px] font-hud px-2 py-0.5 text-yellow-400/80">РАНГ {CURRENT_USER.rank}</span>
                  <span className="text-xs text-gray-500 font-mono-hud">{CURRENT_USER.title}</span>
                </div>
                <div className="flex items-center gap-3 mt-2 max-w-xs">
                  <XPBar value={CURRENT_USER.xp} max={CURRENT_USER.xpMax} color="xp-bar" />
                  <span className="text-[10px] font-mono-hud text-gray-500 whitespace-nowrap">LVL {CURRENT_USER.level}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="text-[10px] font-hud tracking-widest text-gray-600 mb-1">МОЙ СТАТУС</div>
              <div className="flex gap-2">
                {(["online", "afk", "offline"] as Status[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setMyStatus(s)}
                    className={`btn-hud text-[10px] font-hud tracking-wider px-3 py-1.5 rounded-sm border transition-all ${
                      myStatus === s
                        ? s === 'online' ? 'bg-green-400/20 border-green-400/50 text-green-400'
                          : s === 'afk' ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-400'
                          : 'bg-gray-600/20 border-gray-600/50 text-gray-400'
                        : 'bg-transparent border-white/10 text-gray-600 hover:border-white/20 hover:text-gray-400'
                    }`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex gap-0 mb-6 border-b border-yellow-400/10 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-[11px] font-hud tracking-widest whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'text-yellow-400 border-yellow-400 bg-yellow-400/5'
                  : 'text-gray-600 border-transparent hover:text-gray-400 hover:bg-white/[0.02]'
              }`}
            >
              <Icon name={tab.icon} size={12} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── STATISTICS ─── */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Онлайн сегодня" value={formatTime(CURRENT_USER.onlineToday)} icon="Clock" sub="личная статистика" delay={0} />
              <StatCard label="Онлайн за неделю" value={formatTime(CURRENT_USER.onlineWeek)} icon="Calendar" sub="7 дней" delay={80} />
              <StatCard label="Репутация" value={CURRENT_USER.reputation.toLocaleString()} icon="Star" sub={`ТОП ${sorted.findIndex(p => p.id === CURRENT_USER.id) + 1} из ${MOCK_PLAYERS.length}`} delay={160} />
              <StatCard label="Уровень" value={`LVL ${CURRENT_USER.level}`} icon="TrendingUp" sub={`${CURRENT_USER.xp}/${CURRENT_USER.xpMax} XP`} delay={240} />
            </div>

            {/* Weekly activity bars */}
            <div className="hud-panel p-5 animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="font-hud text-sm tracking-widest text-gray-400">АКТИВНОСТЬ ЗА НЕДЕЛЮ</div>
                <span className="font-mono-hud text-[10px] text-gray-600">часы в сети</span>
              </div>
              <div className="flex items-end gap-2 h-24">
                {[2.1, 3.4, 1.8, 4.2, 3.1, 2.8, 3.7].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-sm relative overflow-hidden" style={{ height: `${(val / 5) * 80}px` }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/60 to-yellow-400/20 border border-yellow-400/30" />
                    </div>
                    <span className="font-mono-hud text-[9px] text-gray-600">
                      {['Пн','Вт','Ср','Чт','Пт','Сб','Вс'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reputation bars */}
            <div className="hud-panel p-5 animate-fade-in" style={{ animationDelay: '380ms', animationFillMode: 'both' }}>
              <div className="font-hud text-sm tracking-widest text-gray-400 mb-4">СИСТЕМА РЕПУТАЦИИ</div>
              <div className="space-y-3">
                {[
                  { label: "Боевая репутация", val: 78, color: "xp-bar" },
                  { label: "Социальная репутация", val: 52, color: "rep-bar" },
                  { label: "Рейтинг надёжности", val: 91, color: "xp-bar" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-hud text-gray-500 w-44">{item.label}</span>
                    <div className="flex-1"><XPBar value={item.val} max={100} color={item.color} /></div>
                    <span className="font-mono-hud text-xs text-gray-400 w-8 text-right">{item.val}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── LEADERBOARD ─── */}
        {activeTab === "leaderboard" && (
          <div className="hud-panel overflow-hidden animate-fade-in">
            <div className="px-4 py-3 border-b border-yellow-400/10 flex items-center justify-between">
              <div className="font-hud text-sm tracking-widest text-gray-400">
                ТАБЛИЦА ЛИДЕРОВ <span className="text-yellow-400/40 ml-2">— ПО РЕПУТАЦИИ</span>
              </div>
              {canSeeFullStats && (
                <span className="text-[10px] font-hud text-orange-400 border border-orange-400/30 px-2 py-0.5 rounded-sm">КУРАТОР: ПОЛНАЯ СТАТИСТИКА</span>
              )}
            </div>
            <div className="divide-y divide-white/5">
              {sorted.map((player, i) => (
                <PlayerRow key={player.id} player={player} index={i} canEdit={false} />
              ))}
            </div>
          </div>
        )}

        {/* ─── USERS ─── */}
        {activeTab === "users" && canManageUsers && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="font-hud text-sm tracking-widest text-gray-400">СПИСОК УЧАСТНИКОВ</div>
              <button className="btn-hud flex items-center gap-2 text-[11px] font-hud tracking-wider px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-sm hover:bg-yellow-400/20 transition-all">
                <Icon name="UserPlus" size={12} />
                ДОБАВИТЬ УЧАСТНИКА
              </button>
            </div>
            <div className="hud-panel overflow-hidden">
              <div className="divide-y divide-white/5">
                {MOCK_PLAYERS.map((player, i) => (
                  <PlayerRow key={player.id} player={player} index={i} canEdit={true} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── MODERATION ─── */}
        {activeTab === "moderation" && canManageUsers && (
          <div className="space-y-4 animate-fade-in">
            <div className="font-hud text-sm tracking-widest text-gray-400">ПАНЕЛЬ МОДЕРАЦИИ</div>

            <div className="hud-panel p-0 overflow-hidden">
              <div className="px-4 py-3 border-b border-yellow-400/10">
                <div className="font-hud text-xs tracking-widest text-red-400">АКТИВНЫЕ ПРЕДУПРЕЖДЕНИЯ</div>
              </div>
              {MOCK_PLAYERS.filter(p => p.warnings > 0).map((player) => (
                <div key={player.id} className="flex items-center gap-4 px-4 py-3 border-b border-white/5 last:border-0">
                  <StatusDot status={player.status} />
                  <div className="flex-1">
                    <div className="font-hud text-sm text-gray-200">{player.name}</div>
                    <div className="text-[10px] text-gray-600 font-mono-hud">{player.title}</div>
                  </div>
                  <RoleBadge role={player.role} />
                  <div className="font-mono-hud text-sm neon-red">⚠ {player.warnings}</div>
                  <button className="btn-hud text-[10px] font-hud tracking-wider px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 rounded-sm hover:bg-red-500/20 transition-all">
                    СНЯТЬ
                  </button>
                </div>
              ))}
            </div>

            <div className="hud-panel p-4 border-yellow-400/30">
              <div className="flex items-start gap-3">
                <Icon name="AlertTriangle" size={16} className="text-yellow-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-hud text-xs tracking-widest text-yellow-400 mb-1">АФК НАРУШИТЕЛИ</div>
                  <div className="text-xs text-gray-500">
                    {MOCK_PLAYERS.filter(p => p.status === 'afk').map(p => p.name).join(', ')} — превысили лимит АФК времени
                  </div>
                </div>
                <button className="ml-auto btn-hud text-[10px] font-hud tracking-wider px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-sm hover:bg-yellow-400/20 whitespace-nowrap transition-all">
                  УВЕДОМИТЬ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── ADMIN PANEL ─── */}
        {activeTab === "admin_panel" && canAccessAdmin && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="font-hud text-sm tracking-widest text-gray-400">ПАНЕЛЬ АДМИНИСТРАТОРА</div>
              <RoleBadge role={viewerRole} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Online management */}
              <div className="hud-panel p-0 overflow-hidden">
                <div className="px-4 py-3 border-b border-yellow-400/10 flex items-center gap-2">
                  <Icon name="Activity" size={12} className="text-cyan-400" />
                  <div className="font-hud text-xs tracking-widest text-cyan-400">УПРАВЛЕНИЕ ОНЛАЙНОМ</div>
                </div>
                <div className="p-4 space-y-3">
                  {MOCK_PLAYERS.filter(p => p.role === 'admin' || p.role === 'curator').map(player => (
                    <div key={player.id} className="flex items-center gap-3">
                      <StatusDot status={player.status} />
                      <div className="flex-1">
                        <div className="text-xs font-hud text-gray-300">{player.name}</div>
                        <div className="text-[10px] text-gray-600 font-mono-hud">Сегодня: {formatTime(player.onlineToday)}</div>
                      </div>
                      <RoleBadge role={player.role} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats (curator only) */}
              <div className={`hud-panel p-0 overflow-hidden ${!canSeeFullStats ? 'opacity-40 pointer-events-none' : ''}`}>
                <div className="px-4 py-3 border-b border-yellow-400/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="BarChart3" size={12} className="text-orange-400" />
                    <div className="font-hud text-xs tracking-widest text-orange-400">СТАТИСТИКА АФК</div>
                  </div>
                  {!canSeeFullStats && (
                    <div className="flex items-center gap-1 text-[10px] font-hud text-gray-600">
                      <Icon name="Lock" size={10} />
                      ТОЛЬКО КУРАТОР
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  {[
                    { label: "Общий онлайн сегодня", val: formatTime(totalOnlineToday), icon: "Clock" },
                    { label: "Участников онлайн", val: `${onlinePlayers} / ${MOCK_PLAYERS.length}`, icon: "Users" },
                    { label: "АФК нарушений", val: `${MOCK_PLAYERS.filter(p => p.warnings > 0).length}`, icon: "AlertTriangle" },
                    { label: "Ср. время сессии", val: "2ч 14м", icon: "Timer" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Icon name={item.icon} size={11} className="text-gray-600" />
                        {item.label}
                      </div>
                      <span className="font-mono-hud text-xs neon-gold">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Add user form */}
            <div className="hud-panel p-5">
              <div className="font-hud text-xs tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                <Icon name="UserPlus" size={12} />
                ДОБАВИТЬ УЧАСТНИКА
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="text-[10px] font-hud tracking-widest text-gray-600 mb-1.5">НИКНЕЙМ</div>
                  <input
                    className="w-full bg-black/40 border border-white/10 text-gray-200 text-sm px-3 py-2 rounded-sm font-mono-hud focus:outline-none focus:border-yellow-400/40 placeholder:text-gray-700"
                    placeholder="Имя_игрока"
                  />
                </div>
                <div>
                  <div className="text-[10px] font-hud tracking-widest text-gray-600 mb-1.5">ЗВАНИЕ</div>
                  <input
                    className="w-full bg-black/40 border border-white/10 text-gray-200 text-sm px-3 py-2 rounded-sm font-mono-hud focus:outline-none focus:border-yellow-400/40 placeholder:text-gray-700"
                    placeholder="Рядовой"
                  />
                </div>
                <div>
                  <div className="text-[10px] font-hud tracking-widest text-gray-600 mb-1.5">РОЛЬ</div>
                  <select className="w-full bg-black/40 border border-white/10 text-gray-200 text-sm px-3 py-2 rounded-sm font-mono-hud focus:outline-none focus:border-yellow-400/40">
                    <option value="user">ИГРОК</option>
                    <option value="leader">ЛИДЕР</option>
                    {viewerRole === "curator" && <option value="admin">АДМИНИСТРАТОР</option>}
                  </select>
                </div>
              </div>
              <button className="btn-hud mt-4 text-[11px] font-hud tracking-widest px-6 py-2 bg-yellow-400 text-black rounded-sm hover:bg-yellow-300 transition-all">
                ДОБАВИТЬ В ОРГАНИЗАЦИЮ
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="border-t border-yellow-400/10 mt-8 py-3 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="font-mono-hud text-[10px] text-gray-700 tracking-widest">
            GTA ACTIVITY HUB · {new Date().toLocaleDateString('ru')}
          </div>
          <div className="font-mono-hud text-[10px] text-gray-700">
            УЧАСТНИКОВ: {MOCK_PLAYERS.length} · ОНЛАЙН: {onlinePlayers}
          </div>
        </div>
      </div>
    </div>
  );
}