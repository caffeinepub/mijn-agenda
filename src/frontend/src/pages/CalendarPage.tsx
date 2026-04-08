import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useCalendar } from "@/hooks/useCalendar";
import { useAddEvent, useDeleteEvent, useMonthEvents } from "@/hooks/useEvents";
import type { DateKey, Event, EventColor } from "@/types/calendar";
import { Calendar, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DUTCH_MONTHS = [
  "Januari",
  "Februari",
  "Maart",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Augustus",
  "September",
  "Oktober",
  "November",
  "December",
];

const DUTCH_DAYS_SHORT = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

const COLOR_OPTIONS: {
  value: EventColor;
  label: string;
  dot: string;
  ring: string;
}[] = [
  {
    value: "green",
    label: "Normaal",
    dot: "bg-emerald-500",
    ring: "ring-emerald-500",
  },
  {
    value: "orange",
    label: "Belangrijk",
    dot: "bg-orange-500",
    ring: "ring-orange-500",
  },
  { value: "red", label: "Urgent", dot: "bg-red-500", ring: "ring-red-500" },
];

const EVENT_COLOR_DOT: Record<EventColor, string> = {
  green: "bg-emerald-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
};

const EVENT_COLOR_BORDER: Record<EventColor, string> = {
  green: "border-l-emerald-500",
  orange: "border-l-orange-500",
  red: "border-l-red-500",
};

interface AddEventDialogProps {
  dateKey: DateKey;
  displayDate: string;
  year: number;
  month: number;
  onClose: () => void;
}

function AddEventDialog({
  dateKey,
  displayDate,
  year,
  month,
  onClose,
}: AddEventDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<EventColor>("green");
  const addEvent = useAddEvent(year, month);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await addEvent.mutateAsync({
        dateKey,
        input: {
          title: title.trim(),
          description: description.trim() || undefined,
          color,
        },
      });
      toast.success("Afspraak toegevoegd");
      onClose();
    } catch {
      toast.error("Kon afspraak niet opslaan");
    }
  }

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            Toevoegen — {displayDate}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="event-title">Titel</Label>
            <Input
              id="event-title"
              placeholder="Bijv. Tandarts 14:00"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              data-ocid="event-title-input"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Prioriteit</Label>
            <div className="flex gap-2" data-ocid="event-color-picker">
              {COLOR_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setColor(opt.value)}
                  className={[
                    "flex items-center gap-2 flex-1 px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-150",
                    color === opt.value
                      ? `border-transparent ring-2 ${opt.ring} bg-muted`
                      : "border-border bg-card hover:bg-muted/60 text-muted-foreground",
                  ].join(" ")}
                  aria-pressed={color === opt.value}
                  aria-label={opt.label}
                  data-ocid={`color-option-${opt.value}`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${opt.dot}`}
                  />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="event-desc">Notitie (optioneel)</Label>
            <Textarea
              id="event-desc"
              placeholder="Extra informatie…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              data-ocid="event-description-input"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuleren
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || addEvent.isPending}
              data-ocid="event-submit-btn"
            >
              {addEvent.isPending ? "Opslaan…" : "Opslaan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DayCellProps {
  dateKey: DateKey;
  dayNum: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
  onAdd: (dateKey: DateKey) => void;
  onDelete: (eventId: bigint) => void;
}

function DayCell({
  dateKey,
  dayNum,
  isCurrentMonth,
  isToday,
  events,
  onAdd,
  onDelete,
}: DayCellProps) {
  return (
    <article
      className={[
        "group relative flex flex-col border-b border-r border-border overflow-hidden transition-colors duration-150",
        isCurrentMonth ? "bg-card" : "bg-muted/30",
        isToday ? "border-l-2 border-l-accent" : "",
      ].join(" ")}
      data-ocid={`day-cell-${dateKey}`}
    >
      {/* Clickable overlay for adding events */}
      {isCurrentMonth && (
        <button
          type="button"
          className="absolute inset-0 w-full h-full opacity-0 hover:bg-secondary/40 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent transition-colors duration-150 cursor-pointer"
          onClick={() => onAdd(dateKey)}
          tabIndex={0}
          aria-label={`Voeg toe op ${dateKey}`}
        />
      )}

      {/* Content sits above the overlay */}
      <div className="relative z-10 flex flex-col p-2 h-full pointer-events-none">
        {/* Day number row */}
        <div className="flex items-start justify-between mb-1">
          <span
            className={[
              "inline-flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full transition-colors",
              isToday
                ? "bg-accent text-accent-foreground"
                : isCurrentMonth
                  ? "text-foreground"
                  : "text-muted-foreground/50",
            ].join(" ")}
          >
            {dayNum}
          </span>
          {isCurrentMonth && (
            <button
              type="button"
              className="pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-sm hover:bg-accent/20 text-muted-foreground hover:text-accent"
              onClick={(e) => {
                e.stopPropagation();
                onAdd(dateKey);
              }}
              aria-label="Toevoegen"
              data-ocid={`add-event-${dateKey}`}
            >
              <Plus size={12} />
            </button>
          )}
        </div>

        {/* Events */}
        <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
          {events.slice(0, 3).map((ev) => (
            <div
              key={String(ev.id)}
              className={[
                "pointer-events-auto group/ev flex items-center gap-1 text-xs leading-tight pl-1.5 border-l-2 rounded-sm",
                EVENT_COLOR_BORDER[ev.color ?? "green"],
              ].join(" ")}
            >
              <span
                className={[
                  "w-1 h-1 rounded-full flex-shrink-0",
                  EVENT_COLOR_DOT[ev.color ?? "green"],
                ].join(" ")}
              />
              <span className="truncate flex-1 text-foreground/80">
                {ev.title}
              </span>
              <button
                type="button"
                className="opacity-0 group-hover/ev:opacity-100 focus-visible:opacity-100 text-muted-foreground hover:text-destructive transition-opacity flex-shrink-0 p-1 rounded-sm focus-visible:ring-2 focus-visible:ring-accent"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(ev.id);
                }}
                aria-label={`Verwijder ${ev.title}`}
                data-ocid={`delete-event-${String(ev.id)}`}
              >
                <X size={10} />
              </button>
            </div>
          ))}
          {events.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{events.length - 3} meer
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function CalendarPage() {
  const { year, month, today, monthData, prevMonth, nextMonth, goToToday } =
    useCalendar();
  const { data: eventMap, isLoading } = useMonthEvents(year, month);
  const deleteEvent = useDeleteEvent(year, month);
  const [addingTo, setAddingTo] = useState<DateKey | null>(null);

  const safeMap = eventMap ?? {};

  function handleDelete(eventId: bigint) {
    deleteEvent.mutate(eventId, {
      onSuccess: () => toast.success("Afspraak verwijderd"),
      onError: () => toast.error("Kon afspraak niet verwijderen"),
    });
  }

  function getDisplayDate(dateKey: DateKey): string {
    const [, m, d] = dateKey.split("-").map(Number);
    return `${d} ${DUTCH_MONTHS[m - 1]} ${year}`;
  }

  const monthName = DUTCH_MONTHS[month - 1];
  const showingCurrentMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-5 py-3 bg-card border-b border-border shadow-xs">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-accent" />
          <span className="font-display text-base font-semibold text-foreground tracking-tight">
            Daglicht
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevMonth}
              aria-label="Vorige maand"
              data-ocid="prev-month-btn"
              className="h-8 w-8"
            >
              <ChevronLeft size={16} />
            </Button>

            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
              onClick={goToToday}
              data-ocid="month-label-btn"
            >
              <span className="font-display font-semibold text-sm text-foreground">
                {monthName}
              </span>
              <span
                className={`text-sm ${showingCurrentMonth ? "text-accent font-medium" : "text-muted-foreground"}`}
              >
                {year}
              </span>
            </button>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextMonth}
              aria-label="Volgende maand"
              data-ocid="next-month-btn"
              className="h-8 w-8"
            >
              <ChevronRight size={16} />
            </Button>
          </div>

          <div className="w-px h-5 bg-border mx-1" aria-hidden="true" />

          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            data-ocid="go-today-btn"
            className="text-xs h-8"
          >
            Vandaag
          </Button>
        </div>
      </header>

      {/* Calendar grid */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 flex-shrink-0 bg-muted/30 border-b border-border">
          {DUTCH_DAYS_SHORT.map((d) => (
            <div
              key={d}
              className="py-2 text-center text-xs font-semibold text-muted-foreground tracking-wide uppercase border-r border-border last:border-r-0"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Weeks — fill remaining height, always 6 rows */}
        <div className="flex-1 grid grid-rows-6 overflow-hidden border-l border-t border-border">
          {isLoading
            ? (["r0", "r1", "r2", "r3", "r4", "r5"] as const).map((rk) => (
                <div key={rk} className="grid grid-cols-7">
                  {(["c0", "c1", "c2", "c3", "c4", "c5", "c6"] as const).map(
                    (ck) => (
                      <div
                        key={ck}
                        className="border-b border-r border-border p-2"
                      >
                        <Skeleton className="h-4 w-6 mb-2" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    ),
                  )}
                </div>
              ))
            : monthData.weeks.map((week) => (
                <div key={week[0].dateKey} className="grid grid-cols-7">
                  {week.map((cell) => (
                    <DayCell
                      key={cell.dateKey}
                      dateKey={cell.dateKey}
                      dayNum={cell.date.getDate()}
                      isCurrentMonth={cell.isCurrentMonth}
                      isToday={cell.isToday}
                      events={safeMap[cell.dateKey] ?? []}
                      onAdd={setAddingTo}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              ))}
        </div>
      </div>

      {/* Add event dialog */}
      {addingTo && (
        <AddEventDialog
          dateKey={addingTo}
          displayDate={getDisplayDate(addingTo)}
          year={year}
          month={month}
          onClose={() => setAddingTo(null)}
        />
      )}
    </div>
  );
}
