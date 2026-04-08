/** DateKey format: "YYYY-MM-DD" */
export type DateKey = string;

export type EventId = bigint;

export interface Event {
  id: EventId;
  title: string;
  description: string | null;
  createdAt: bigint;
}

export interface EventInput {
  title: string;
  description: string | null;
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
