import { createActor } from "@/backend";
import type { DateKey, Event, EventColor, EventInput } from "@/types/calendar";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type MonthEventMap = Record<DateKey, Event[]>;

function toEventColor(raw: string | undefined): EventColor {
  if (raw === "orange" || raw === "red") return raw;
  return "green";
}

export function useMonthEvents(year: number, month: number) {
  const { actor } = useActor(createActor);

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
          description: e.description,
          color: toEventColor(e.color),
          createdAt: e.createdAt,
        }));
      }
      return map;
    },
    enabled: !!actor,
  });
}

export function useAddEvent(year: number, month: number) {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      dateKey,
      input,
    }: { dateKey: DateKey; input: EventInput }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addEvent(dateKey, {
        title: input.title,
        description: input.description,
        color: input.color,
      });
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["events", "month", year, month],
      });
    },
  });
}

export function useDeleteEvent(year: number, month: number) {
  const { actor } = useActor(createActor);
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
