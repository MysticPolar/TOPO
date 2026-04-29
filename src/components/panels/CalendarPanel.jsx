import { useState, useEffect } from "react";
import { COLORS, FONTS as F, CARD_COLORS } from "../../styles/tokens.js";
import { fetchReadingHistory } from "../../utils/db.js";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function CalendarPanel() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReadingHistory()
      .then(data => setEntries(data || []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  const entryMap = {};
  entries.forEach(e => {
    const d = e.date;
    if (!entryMap[d]) entryMap[d] = [];
    entryMap[d].push(e);
  });

  const cells = buildCalendarDays(year, month);
  const todayStr = now.toISOString().slice(0, 10);

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDate(null);
  };

  const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const monthStr = `${MONTH_NAMES[month]} ${year}`;

  const selectedKey = selectedDate
    ? `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`
    : null;
  const selectedEntries = selectedKey ? (entryMap[selectedKey] || []) : [];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0", fontFamily: F.body, fontStyle: "italic", fontSize: 12, color: COLORS.muted }}>
        Loading reading log…
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button onClick={prevMonth} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 8px", fontFamily: F.ui, fontSize: 16, color: COLORS.muted }}>‹</button>
        <div style={{ fontFamily: F.chinese, fontWeight: 700, fontSize: 13, color: COLORS.ink, letterSpacing: 2 }}>{monthStr}</div>
        <button onClick={nextMonth} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 8px", fontFamily: F.ui, fontSize: 16, color: COLORS.muted }}>›</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
        {DAY_LABELS.map(l => (
          <div key={l} style={{ textAlign: "center", fontFamily: F.ui, fontSize: 9, letterSpacing: 1, color: COLORS.muted, padding: "2px 0" }}>{l}</div>
        ))}
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />;
          const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const hasEntry = !!entryMap[dateKey];
          const isToday = dateKey === todayStr;
          const isSelected = day === selectedDate;

          return (
            <div
              key={idx}
              onClick={() => hasEntry && setSelectedDate(isSelected ? null : day)}
              style={{
                position: "relative",
                textAlign: "center",
                padding: "6px 0",
                cursor: hasEntry ? "pointer" : "default",
                background: isSelected ? COLORS.ink : isToday ? "rgba(201,162,39,0.12)" : "transparent",
                border: isToday && !isSelected ? `1px solid rgba(201,162,39,0.35)` : "1px solid transparent",
                transition: "background 0.15s ease",
              }}
            >
              <span style={{
                fontFamily: F.ui,
                fontSize: 11,
                color: isSelected ? COLORS.goldLight : isToday ? COLORS.gold : COLORS.ink,
                fontWeight: isToday || hasEntry ? 700 : 400,
              }}>{day}</span>
              {hasEntry && (
                <span style={{
                  position: "absolute",
                  bottom: 2, left: "50%", transform: "translateX(-50%)",
                  width: 4, height: 4, borderRadius: "50%",
                  background: isSelected ? COLORS.goldLight : COLORS.gold,
                  display: "block",
                }} />
              )}
            </div>
          );
        })}
      </div>

      {selectedEntries.length > 0 && (
        <div style={{ marginTop: 12, borderTop: `1px solid rgba(42,31,14,0.1)`, paddingTop: 12 }}>
          {selectedEntries.map((entry, i) => (
            <div key={i} style={{
              marginBottom: i < selectedEntries.length - 1 ? 10 : 0,
              padding: "10px 12px",
              background: COLORS.paperDark,
              borderLeft: `3px solid ${CARD_COLORS[entry.color] || COLORS.gold}`,
            }}>
              {entry.question_text && (
                <div style={{ fontFamily: F.chinese, fontStyle: "italic", fontSize: 11, color: COLORS.muted, marginBottom: 5, lineHeight: 1.5 }}>
                  "{entry.question_text}"
                </div>
              )}
              {entry.book_title && (
                <div style={{ fontFamily: F.chinese, fontWeight: 700, fontSize: 12, color: COLORS.ink, lineHeight: 1.4 }}>
                  {entry.book_title}
                </div>
              )}
              {entry.book_author && (
                <div style={{ fontFamily: F.ui, fontSize: 10, color: COLORS.muted, marginTop: 2, letterSpacing: 0.5 }}>{entry.book_author}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {Object.keys(entryMap).length === 0 && (
        <div style={{ textAlign: "center", padding: "20px 0 8px", fontFamily: F.body, fontStyle: "italic", fontSize: 11, color: COLORS.muted, opacity: 0.6, lineHeight: 1.8 }}>
          Tap "Start Reading" and<br />your reading life will be logged here.
        </div>
      )}
    </div>
  );
}
