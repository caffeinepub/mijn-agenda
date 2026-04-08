import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/events";

module {
  public func addEvent(
    events : Map.Map<Types.DateKey, List.List<Types.Event>>,
    nextId : { var value : Nat },
    dateKey : Types.DateKey,
    input : Types.EventInput,
  ) : Types.EventId {
    let id = nextId.value;
    nextId.value += 1;

    let event : Types.Event = {
      id;
      title = input.title;
      description = input.description;
      createdAt = Time.now();
    };

    switch (events.get(dateKey)) {
      case (?list) { list.add(event) };
      case null {
        let list = List.empty<Types.Event>();
        list.add(event);
        events.add(dateKey, list);
      };
    };

    id;
  };

  public func getEvents(
    events : Map.Map<Types.DateKey, List.List<Types.Event>>,
    dateKey : Types.DateKey,
  ) : [Types.Event] {
    switch (events.get(dateKey)) {
      case (?list) { list.toArray() };
      case null { [] };
    };
  };

  public func deleteEvent(
    events : Map.Map<Types.DateKey, List.List<Types.Event>>,
    eventId : Types.EventId,
  ) : () {
    for ((dateKey, list) in events.entries()) {
      let filtered = list.filter(func(e : Types.Event) : Bool { e.id != eventId });
      if (filtered.size() < list.size()) {
        list.clear();
        list.append(filtered);
        return;
      };
    };
  };

  // Returns all days with events for a given year and month (1-indexed month)
  public func getEventsByMonth(
    events : Map.Map<Types.DateKey, List.List<Types.Event>>,
    year : Nat,
    month : Nat,
  ) : [Types.DayEvents] {
    // Build prefix "YYYY-MM-" to match all dateKeys for that month
    let yearText = padNat(year, 4);
    let monthText = padNat(month, 2);
    let prefix = yearText # "-" # monthText # "-";

    let result = List.empty<Types.DayEvents>();
    for ((dateKey, list) in events.entries()) {
      if (dateKey.startsWith(#text prefix) and list.size() > 0) {
        result.add({ dateKey; events = list.toArray() });
      };
    };
    result.toArray();
  };

  // Zero-pads a Nat to a minimum width
  private func padNat(n : Nat, width : Nat) : Text {
    var t = n.toText();
    while (t.size() < width) {
      t := "0" # t;
    };
    t;
  };
};
