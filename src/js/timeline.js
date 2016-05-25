// Models
function TimelineEvent(data) {
  var self = this;
  self.id = data.id;
  self.name = ko.observable(data.name || "Event");
  self.date = ko.observable(data.date || new Date());
  self.description = ko.observable(data.description || "Description");
  self.isDeleted = ko.observable(data.isDeleted || false);

  this.dateString = ko.computed(function() {
    var day = self.date().getDate() + 1;
    var month = self.date().getMonth() + 1;
    var year = self.date().getFullYear();
    return day + '/' + month + '/' + year;
  });
}

function TimelineCategory(data) {
  var self = this;
  self.id = data.id;
  self.name = ko.observable(data.name || "New Category");
  self.color = ko.observable(data.color || 0);
  self.events = ko.observableArray(data.events || null);
}

function TimelineScaling(multiplier) {
  var self = this;
  var defaultScale = 4;
  self.multiplier = multiplier || 1;
  self.scaling = ko.computed(function() {
    return self.multiplier * defaultScale;
  });
}

// ViewModel
function TimelineViewModel() {
  var self = this;

  // Editable data
  self.categories = ko.observableArray([
    new TimelineCategory({ id: 0, name: "Default", color: '#DD3333', events: [
      new TimelineEvent({
        id: 0,
        name: "Started work",
        date: new Date(2016, 4, 25),
        description: "Started working on this weird but cool thingymajig.",
        isDeleted: false
      }),
      new TimelineEvent({
        id: 1,
        name: "Committed changes",
        date: new Date(2016, 4, 26),
        description: "After making some changes, I committed them and all that cool jazzy-like shizzle fits.",
        isDeleted: false
      })
    ]}),
    new TimelineCategory({ id: 1, name: "Work", color: '#3333DD', events: [
      new TimelineEvent({
        id: 2,
        name: "First day",
        date: new Date(2016, 1, 11),
        description: "First day on the job at Fisher & Paykel.",
        isDeleted: false
      }),
      new TimelineEvent({
        id: 3,
        name: "First day",
        date: new Date(2016, 1, 11),
        description: "First day on the job at Fisher & Paykel.",
        isDeleted: true
      }),
      new TimelineEvent({
        id: 4,
        name: "Scrum Master",
        date: new Date(2016, 3, 4),
        description: "I was appointed as Scrum Master! Though I basically put up my own hand.",
        isDeleted: false
      })
    ]}),
    new TimelineCategory({ id: 2, name: "Empty", color: '#33DD33'})
  ]);

  self.scaling = ko.observable(new TimelineScaling(1));

  // Methods
  self.paintDotForEvent = function(eventId, color) {
    // Find stage to draw canvas
    var stage = new createjs.Stage("timeline-dot--" + eventId);

    // Circle
    var circle = new createjs.Shape();
    circle.graphics.beginFill(color).drawCircle(6, 6, 6);

    // Update stage
    stage.addChild(circle);
    stage.update();
  };

  self.paintLineForEvent = function(categoryId, eventId, color) {
    var currentCategory = _.findWhere(self.categories(), { id: categoryId });
    var currentEvent = _.findWhere(currentCategory.events(), { id: eventId });

    if (self.hasNextEvent(currentCategory, currentEvent)) {
      var timeToNextEvent = self.findTimeToNextEvent(categoryId, eventId);

      // Find stage to draw canvas
      var stage = new createjs.Stage("timeline-line--" + eventId);

      // Circle
      var line = new createjs.Shape();
      line.graphics.beginFill(color).drawRect(0, 3, timeToNextEvent, 6); // x, y, width, height

      // Update stage
      stage.addChild(line);
      stage.update();
    }
  };

  self.getCategory = function(categoryId) {
    return _.findWhere(self.categories(), { id: categoryId });
  };

  self.getEvent = function(categoryId, eventId) {
    var category = self.getCategory(categoryId);
    return _.findWhere(category.events(), { id: eventId });
  };

  self.getEventIndex = function(currentCategory, currentEvent) {
    return _.indexOf(currentCategory.events(), currentEvent);
  };

  self.hasNextEvent = function(currentCategory, currentEvent) {
    var currentEventIndex = self.getEventIndex(currentCategory, currentEvent);

    if (currentCategory.events().length > currentEventIndex + 1) {
      return true;
    }

    return false;
  };

  self.findTimeToNextEvent = function(categoryId, eventId) {
    var currentCategory = self.getCategory(categoryId);
    var currentEvent = self.getEvent(categoryId, eventId);

    if (self.hasNextEvent(currentCategory, currentEvent)) {
      var nextEvent = self.getNextEvent(currentCategory, currentEvent);

      var timeDifferenceInMilliseconds = nextEvent.date() - currentEvent.date();
      var scaling = self.scaling().scaling() * timeDifferenceInMilliseconds / 3600000;

      return Math.floor(scaling);
    }

    return 0;
  };

  self.getNextEvent = function(currentCategory, currentEvent) {
    var currentEventIndex = self.getEventIndex(currentCategory, currentEvent);
    var nextEvent;
    var nextEventIndex = currentEventIndex + 1;

    if (self.hasNextEvent(currentCategory, currentEventIndex)) {
      while (nextEvent === undefined || nextEvent.isDeleted() === true) {
        nextEvent = currentCategory.events()[nextEventIndex];
        nextEventIndex++;
      }
    } else {
      return null;
    }

    return nextEvent;
  };

  self.showEventDetails = function(id) {
    var clicked = $("#timeline-details--" + id);
    var currentlyEnabled = clicked.hasClass('active');

    $(".timeline-event--bubble.active").removeClass('active');

    if (!currentlyEnabled) {
      clicked.toggleClass('active');
    }
  };

  self.addEvent = function() {

  };
}

// Bindings
ko.applyBindings(new TimelineViewModel());
