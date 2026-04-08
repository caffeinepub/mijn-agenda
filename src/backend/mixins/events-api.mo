import Map "mo:core/Map";
import List "mo:core/List";
import Types "../types/events";
import EventsLib "../lib/events";

mixin (
  events : Map.Map<Types.DateKey, List.List<Types.Event>>,
  nextEventId : { var value : Nat },
) {
  public func addEvent(dateKey : Types.DateKey, input : Types.EventInput) : async Types.EventId {
    EventsLib.addEvent(events, nextEventId, dateKey, input);
  };

  public query func getEvents(dateKey : Types.DateKey) : async [Types.Event] {
    EventsLib.getEvents(events, dateKey);
  };

  public func deleteEvent(eventId : Types.EventId) : async () {
    EventsLib.deleteEvent(events, eventId);
  };

  public query func getEventsByMonth(year : Nat, month : Nat) : async [Types.DayEvents] {
    EventsLib.getEventsByMonth(events, year, month);
  };
};
