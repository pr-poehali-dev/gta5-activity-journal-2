import { useState } from "react";
import { formatTime } from "@/lib/types";

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

interface Props {
  weekActivity?: number[]; // минуты за каждый день
}

export default function WeekActivityChart({ weekActivity }: Props) {
  const data = weekActivity && weekActivity.length === 7
    ? weekActivity
    : [126, 204, 108, 252, 186, 168, 222];

  const maxVal = Math.max(...data, 1);
  const totalMinutes = data.reduce((s, v) => s + v, 0);

  // Умное определение единицы: если максимум ≥ 60 мин — показываем в часах
  const useHours = maxVal >= 60;

  // Подпись метки оси Y
  const unitLabel = useHours ? "часы" : "минуты";

  // Высота колонки в px (мин 4, макс 88)
  const barHeight = (val: number) => Math.max(4, Math.round((val / maxVal) * 88));

  // Подпись над баром
  const barLabel = (val: number) => {
    if (useHours) {
      const h = Math.floor(val / 60);
      const m = val % 60;
      return h > 0 ? (m > 0 ? `${h}ч ${m}м` : `${h}ч`) : `${m}м`;
    }
    return `${val}м`;
  };

  const [hovered, setHovered] = useState<number | null>(null);

  // Сегодня = индекс дня недели (0=Пн)
  const todayIdx = (new Date().getDay() + 6) % 7;

  return (
    <div
      className="hud-panel p-5 animate-fade-in"
      style={{ animationDelay: "240ms", animationFillMode: "both" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="font-hud text-sm tracking-wider text-purple-400">АКТИВНОСТЬ ЗА НЕДЕЛЮ</div>
        <span className="font-mono-hud text-[10px] text-purple-700">{unitLabel}</span>
      </div>
      <div className="font-mono-hud text-[10px] text-purple-700 mb-4">
        Итого: <span className="text-purple-400">{formatTime(totalMinutes)}</span>
      </div>

      {/* Chart */}
      <div className="flex items-end gap-2" style={{ height: 112 }}>
        {data.map((val, i) => {
          const h = barHeight(val);
          const isToday = i === todayIdx;
          const isHovered = hovered === i;

          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer group"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Tooltip над баром */}
              <div
                className={`font-mono-hud text-[10px] transition-all duration-200 whitespace-nowrap ${
                  isHovered ? "text-violet-300 opacity-100" : "text-purple-800 opacity-0 group-hover:opacity-100"
                }`}
              >
                {barLabel(val)}
              </div>

              {/* Bar */}
              <div
                className="w-full rounded-lg relative overflow-hidden transition-all duration-300"
                style={{ height: `${h}px` }}
              >
                <div
                  className="absolute inset-0 transition-all duration-300"
                  style={{
                    borderRadius: "8px",
                    background: isToday
                      ? "linear-gradient(to top, rgba(167,139,250,0.9), rgba(216,180,254,0.5))"
                      : isHovered
                      ? "linear-gradient(to top, rgba(124,58,237,0.85), rgba(192,132,252,0.45))"
                      : "linear-gradient(to top, rgba(124,58,237,0.55), rgba(192,132,252,0.2))",
                    boxShadow: isToday
                      ? "0 0 12px rgba(167,139,250,0.4)"
                      : isHovered
                      ? "0 0 10px rgba(124,58,237,0.35)"
                      : "none",
                  }}
                />
                {/* Блик сверху */}
                <div
                  className="absolute top-0 left-0 right-0 h-[40%] opacity-20 rounded-t-lg"
                  style={{ background: "linear-gradient(to bottom, white, transparent)" }}
                />
              </div>

              {/* День */}
              <span
                className={`font-mono-hud text-[9px] transition-colors ${
                  isToday ? "text-violet-400" : isHovered ? "text-purple-400" : "text-purple-700"
                }`}
              >
                {DAYS[i]}
                {isToday && <span className="ml-0.5 text-violet-500">·</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
