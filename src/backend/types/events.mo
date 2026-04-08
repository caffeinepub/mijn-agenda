module {
  // Date key in "YYYY-MM-DD" format
  public type DateKey = Text;

  public type EventId = Nat;

  // Color indicates priority: "green" = normal, "orange" = important, "red" = urgent
  // Stored as ?Text so existing events without a color remain compatible after upgrade
  public type Event = {
    id : EventId;
    title : Text;
    description : ?Text;
    color : ?Text;
    createdAt : Int;
  };

  public type EventInput = {
    title : Text;
    description : ?Text;
    color : ?Text;
  };

  // Used for getEventsByMonth response
  public type DayEvents = {
    dateKey : DateKey;
    events : [Event];
  };
};
