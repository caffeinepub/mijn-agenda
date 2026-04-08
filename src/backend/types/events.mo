module {
  // Date key in "YYYY-MM-DD" format
  public type DateKey = Text;

  public type EventId = Nat;

  public type Event = {
    id : EventId;
    title : Text;
    description : ?Text;
    createdAt : Int;
  };

  public type EventInput = {
    title : Text;
    description : ?Text;
  };

  // Used for getEventsByMonth response
  public type DayEvents = {
    dateKey : DateKey;
    events : [Event];
  };
};
