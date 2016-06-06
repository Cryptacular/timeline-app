// Utilities
var momentFormat = "d MMM YYYY HH:mm:ss";

// Models
function TimelineEvent(data) {
  var self = this;
  self.id = data.id;
  self.name = ko.observable(data.name || "Untitled Event");
  self.time = ko.observable(data.time || moment().format(momentFormat));
  self.description = ko.observable(data.description || "No Description");
  self.isDeleted = ko.observable(data.isDeleted || false);
  this.timeString = ko.computed(function() {
    return moment(self.time()).format("h:mm a");
  });
}

function TimelineDate(data) {
  var self = this;
  self.id = data.id;
  self.date = ko.observable(data.date || moment().format(momentFormat));
  self.events = ko.observableArray(data.events);

  this.dateString = ko.computed(function() {
    return moment(self.date()).format("ll");
  });
}

function TimelineCategory(data) {
  var self = this;
  self.id = data.id;
  self.name = ko.observable(data.name || "New Category");
  self.color = ko.observable(data.color || 0);
  self.dates = ko.observableArray(data.dates || null);
}

function TimelineScaling(multiplier) {
  var self = this;
  var defaultScale = 160;
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
    new TimelineCategory({ id: 0, name: "Default", color: '#DD3333', dates: [
      new TimelineDate({
        id: 0,
        date: "25 May 2016",
        events: [
          new TimelineEvent({
            id: 0,
            name: "Started work",
            time: "25 May 2016 16:53:49",
            description: "Started working on this weird but cool thingymajig.",
            isDeleted: false
          }),
          new TimelineEvent({
            id: 0,
            name: "Started work second title",
            time: "25 May 2016 17:14:23",
            description: "Started working more on this weird but cool thingymajig.",
            isDeleted: false
          })
        ]
      }),
      new TimelineDate({
        id: 1,
        date: "26 May 2016",
        events: [
          new TimelineEvent({
            id: 0,
            name: "Committed changes",
            time: "26 May 2016 16:53:49",
            description: "After making some changes, I committed them and all that cool jazzy-like shizzle fits.",
            isDeleted: false
          })
        ]
      }),
      new TimelineDate({
        id: 2,
        date: "28 May 2016",
        events: [
          new TimelineEvent({
            id: 0,
            name: "Made some other changes",
            time: "28 May 2016 16:53:49",
            description: "Doing things and stuff yup.",
            isDeleted: false
          })
        ]
      }),
      new TimelineDate({
        id: 3,
        date: "1 June 2016",
        events: [
          new TimelineEvent({
            id: 0,
            name: "Undid stuff",
            time: "1 June 2016 16:53:49",
            description: "Ctrl+Z and all that jazz.",
            isDeleted: false
          })
        ]
      }),
    //   new TimelineEvent({
    //     id: 5,
    //     name: "Made some other changes",
    //     date: new Date(2016, 4, 28),
    //     description: "Doing things and stuff yup.",
    //     isDeleted: false
    //   }),
    //   new TimelineEvent({
    //     id: 6,
    //     name: "Undid stuff",
    //     date: new Date(2016, 5, 1),
    //     description: "Ctrl+Z and all that jazz.",
    //     isDeleted: false
    //   })
    // ]}),
    // new TimelineCategory({ id: 1, name: "Work", color: '#3333DD', events: [
    //   new TimelineEvent({
    //     id: 2,
    //     name: "First day",
    //     date: new Date(2016, 2, 27),
    //     description: "First day on the job at Fisher & Paykel.",
    //     isDeleted: false
    //   }),
    //   new TimelineEvent({
    //     id: 3,
    //     name: "First day",
    //     date: new Date(2016, 2, 28),
    //     description: "First day on the job at Fisher & Paykel.",
    //     isDeleted: true
    //   }),
    //   new TimelineEvent({
    //     id: 4,
    //     name: "Scrum Master",
    //     date: new Date(2016, 3, 4),
    //     description: "I was appointed as Scrum Master! Though I basically put up my own hand.",
    //     isDeleted: false
    //   })
    ]}),
    // new TimelineCategory({ id: 2, name: "Empty", color: '#33DD33'})
  ]);

  self.scaling = ko.observable(new TimelineScaling(1));

  // Methods
  self.paintDotForDate = function(dateId, color) {
    // Find stage to draw canvas
    var stage = new createjs.Stage("timeline-dot--" + dateId);

    // Circle
    var circle = new createjs.Shape();
    circle.graphics.beginFill(color).drawCircle(6, 6, 6);

    // Update stage
    stage.addChild(circle);
    stage.update();
  };

  self.paintLineForDate = function(categoryId, dateId, color) {
    var currentCategory = _.findWhere(self.categories(), { id: categoryId });
    var currentDate = _.findWhere(currentCategory.dates(), { id: dateId });

    if (self.hasNextDate(currentCategory, currentDate)) {
      var timeToNextDate = self.findTimeToNextDate(categoryId, dateId);

      // Find stage to draw canvas
      var stage = new createjs.Stage("timeline-line--" + dateId);

      // Circle
      var line = new createjs.Shape();
      line.graphics.beginFill(color).drawRect(0, 3, timeToNextDate, 6); // x, y, width, height

      // Update stage
      stage.addChild(line);
      stage.update();
    }
  };

  self.getCategory = function(categoryId) {
    return _.findWhere(self.categories(), { id: categoryId });
  };

  self.getDate = function(categoryId, dateId) {
    var category = self.getCategory(categoryId);
    return _.findWhere(category.dates(), { id: dateId });
  };

  self.getEvent = function(categoryId, dateId, eventId) {
    var category = self.getCategory(categoryId);
    return _.findWhere(category.dates(), { id: eventId });
  };

  self.getDateIndex = function(currentCategory, currentDate) {
    return _.indexOf(currentCategory.dates(), currentDate);
  };

  self.hasNextDate = function(currentCategory, currentDate) {
    var currentDateIndex = self.getDateIndex(currentCategory, currentDate);

    if (currentCategory.dates().length > currentDateIndex + 1) {
      return true;
    }

    return false;
  };

  self.findTimeToNextDate = function(categoryId, dateId) {
    var currentCategory = self.getCategory(categoryId);
    var currentDate = self.getDate(categoryId, dateId);

    if (self.hasNextDate(currentCategory, currentDate)) {
      var nextDate = self.getNextDate(currentCategory, currentDate);

      var timeDifferenceInSeconds = moment(nextDate.date()).unix() - moment(currentDate.date()).unix();
      var secondsInADay = 60 * 60 * 24;
      var timeDifferenceInDays = self.scaling().scaling() * timeDifferenceInSeconds / secondsInADay;

      return Math.floor(timeDifferenceInDays);
    }

    return 0;
  };

  self.getNextDate = function(currentCategory, currentDate) {
    var currentDateIndex = self.getDateIndex(currentCategory, currentDate);
    var nextDate;
    var nextDateIndex = currentDateIndex + 1;

    if (self.hasNextDate(currentCategory, currentDate)) {
      while (nextDate === undefined || nextDate.events().length === 0) {
        nextDate = currentCategory.dates()[nextDateIndex];
        nextDateIndex++;
      }
    } else {
      return null;
    }

    return nextDate;
  };

  self.toggleDateDetails = function(id) {
    var clicked = $("#timeline-details--" + id);
    var isCurrentlyEnabled = clicked.hasClass('active');

    $(".timeline-event--bubble.active").removeClass('active');

    clicked.toggleClass('active');
  };

  self.addEvent = function() {

  };
}

// Bindings
ko.applyBindings(new TimelineViewModel());
