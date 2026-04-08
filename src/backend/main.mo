import Map "mo:core/Map";
import List "mo:core/List";
import Types "types/events";
import EventsApi "mixins/events-api";

actor {
  let events = Map.empty<Types.DateKey, List.List<Types.Event>>();
  let nextEventId = { var value : Nat = 0 };

  include EventsApi(events, nextEventId);
};
