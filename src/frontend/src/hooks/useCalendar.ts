import type { CalendarDay, DateKey, MonthData } from "@/types/calendar";
import { useMemo, useState } from "react";

function toDateKey(date: Date): DateKey {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function buildMonth(year: number, month: number, todayKey: DateKey): MonthData {
  // month is 1-based
  const firstDay = new Date(year, month - 1, 1);
  // Week starts Monday: 0=Mon … 6=Sun
  const startDow = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells: CalendarDay[] = [];

  // Pad leading days from previous month
  for (let i = startDow - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, -i);
    cells.push({
      date,
      dateKey: toDateKey(date),
      isCurrentMonth: false,
      isToday: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    const dateKey = toDateKey(date);
    cells.push({
      date,
      dateKey,
      isCurrentMonth: true,
      isToday: dateKey === todayKey,
    });
  }

  // Pad trailing days — always fill to complete 6 rows (42 cells)
  const totalCells = 42;
  let next = 1;
  while (cells.length < totalCells) {
    const date = new Date(year, month, next++);
    cells.push({
      date,
      dateKey: toDateKey(date),
      isCurrentMonth: false,
      isToday: false,
    });
  }

  const weeks: CalendarDay[][] = [];
  for (let w = 0; w < 6; w++) {
    weeks.push(cells.slice(w * 7, w * 7 + 7));
  }

  return { year, month, weeks };
}

export function useCalendar() {
  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => toDateKey(today), [today]);

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-based

  const monthData: MonthData = useMemo(
    () => buildMonth(year, month, todayKey),
    [year, month, todayKey],
  );

  function prevMonth() {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  function goToToday() {
    setYear(today.getFullYear());
    setMonth(today.getMonth() + 1);
  }

  return {
    year,
    month,
    today,
    todayKey,
    monthData,
    prevMonth,
    nextMonth,
    goToToday,
    toDateKey,
  };
}
