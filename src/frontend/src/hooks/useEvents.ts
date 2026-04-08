import { createActor } from "@/backend";
import type { DateKey, Event, EventInput } from "@/types/calendar";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type MonthEventMap = Record<DateKey, Event[]>;

type DescriptionOption =
  | { __kind__: "Some"; value: string }
  | { __kind__: "None" };

interface RawEvent {
  id: bigint;
  title: string;
  description: DescriptionOption;
  createdAt: bigint;
}

// Actor interface matching the backend contract (populated after bindgen)
interface DayEvents {
  dateKey: DateKey;
  events: RawEvent[];
}

interface CalendarActor {
  getEventsByMonth(year: bigint, month: bigint): Promise<DayEvents[]>;
  addEvent(
    dateKey: DateKey,
    input: { title: string; description: DescriptionOption },
  ): Promise<bigint>;
  deleteEvent(eventId: bigint): Promise<void>;
}

function normalizeOption(opt: DescriptionOption): string | null {
  if (opt.__kind__ === "None") return null;
  return opt.value;
}

export function useMonthEvents(year: number, month: number) {
  const { actor: rawActor, isFetching } = useActor(createActor);
  const actor = rawActor as unknown as CalendarActor | null;

  return useQuery<MonthEventMap>({
    queryKey: ["events", "month", year, month],
    queryFn: async () => {
      if (!actor) return {};
      const entries = await actor.getEventsByMonth(BigInt(year), BigInt(month));
      const map: MonthEventMap = {};
      for (const { dateKey, events } of entries) {
        map[dateKey] = events.map((e) => ({
          id: e.id,
          title: e.title,
          description: normalizeOption(e.description),
          createdAt: e.createdAt,
        }));
      }
      return map;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddEvent(year: number, month: number) {
  const { actor: rawActor } = useActor(createActor);
  const actor = rawActor as unknown as CalendarActor | null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      dateKey,
      input,
    }: { dateKey: DateKey; input: EventInput }) => {
      if (!actor) throw new Error("Actor not ready");
      const descOption: DescriptionOption = input.description
        ? { __kind__: "Some", value: input.description }
        : { __kind__: "None" };
      return actor.addEvent(dateKey, {
        title: input.title,
        description: descOption,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events", "month", year, month],
      });
    },
  });
}

export function useDeleteEvent(year: number, month: number) {
  const { actor: rawActor } = useActor(createActor);
  const actor = rawActor as unknown as CalendarActor | null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteEvent(eventId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events", "month", year, month],
      });
    },
  });
}
