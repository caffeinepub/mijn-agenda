import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type DateKey = string;
export interface EventInput {
    title: string;
    description?: string;
}
export type EventId = bigint;
export interface DayEvents {
    dateKey: DateKey;
    events: Array<Event>;
}
export interface Event {
    id: EventId;
    title: string;
    createdAt: bigint;
    description?: string;
}
export interface backendInterface {
    addEvent(dateKey: DateKey, input: EventInput): Promise<EventId>;
    deleteEvent(eventId: EventId): Promise<void>;
    getEvents(dateKey: DateKey): Promise<Array<Event>>;
    getEventsByMonth(year: bigint, month: bigint): Promise<Array<DayEvents>>;
}
