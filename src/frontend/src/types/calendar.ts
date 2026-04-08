/** DateKey format: "YYYY-MM-DD" */
export type DateKey = string;

export type EventId = bigint;

export type EventColor = "green" | "orange" | "red";

export interface Event {
  id: EventId;
  title: string;
  description?: string;
  color?: EventColor;
  createdAt: bigint;
}

export interface EventInput {
  title: string;
  description?: string;
  color?: EventColor;
}

export interface CalendarDay {
  date: Date;
  dateKey: DateKey;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export interface MonthData {
  year: number;
  month: number; // 1–12
  weeks: CalendarDay[][];
}
