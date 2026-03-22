import WeekActivityChart from "@/components/shared/WeekActivityChart";
import { StatCard, XPBar } from "@/components/shared/PlayerRow";
import { AuthUser, formatTime } from "@/lib/types";

interface TabStatsProps {
  authUser: AuthUser;
  myRank: number;
}

export default function TabStats({ authUser, myRank }: TabStatsProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Онлайн сегодня" value={formatTime(authUser.onlineToday)} icon="Clock" sub="личная" delay={0} />
        <StatCard label="За неделю" value={formatTime(authUser.onlineWeek)} icon="Calendar" sub="7 дней" delay={60} />
        <StatCard label="Репутация" value={authUser.reputation.toLocaleString()} icon="Star" sub={myRank > 0 ? `ТОП ${myRank}` : "—"} delay={120} />
        <StatCard label="Уровень" value={`LVL ${authUser.level}`} icon="TrendingUp" sub={`${authUser.xp}/${authUser.xpMax} XP`} delay={180} />
      </div>

      <WeekActivityChart weekActivity={authUser.weekActivity} />

      <div className="hud-panel p-5 animate-fade-in" style={{ animationDelay: "320ms", animationFillMode: "both" }}>
        <div className="font-hud text-sm tracking-wider text-purple-400 mb-4">СИСТЕМА РЕПУТАЦИИ</div>
        <div className="space-y-3.5">
          {[
            { label: "Боевая репутация",    val: 78, color: "xp-bar" },
            { label: "Социальная репутация", val: 52, color: "rep-bar" },
            { label: "Рейтинг надёжности",  val: 91, color: "xp-bar" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-purple-600 font-hud w-44">{item.label}</span>
              <div className="flex-1"><XPBar value={item.val} max={100} color={item.color} /></div>
              <span className="font-mono-hud text-xs text-purple-500 w-8 text-right">{item.val}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
