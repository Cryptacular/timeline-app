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
            id: 1,
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
            id: 2,
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
            id: 3,
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
            id: 4,
            name: "Undid stuff",
            time: "1 June 2016 16:53:49",
            description: "Ctrl+Z and all that jazz.",
            isDeleted: false
          })
        ]
      })
    ]}),
    new TimelineCategory({ id: 1, name: "Work", color: '#33DD33', dates: [
      new TimelineDate({
        id: 0,
        date: "30 May 2016",
        events: [
          new TimelineEvent({
            id: 5,
            name: "Started work",
            time: "30 May 2016 16:53:49",
            description: "Started working on this weird but cool thingymajig.",
            isDeleted: false
          }),
          new TimelineEvent({
            id: 6,
            name: "Started work second title",
            time: "30 May 2016 17:14:23",
            description: "Started working more on this weird but cool thingymajig.",
            isDeleted: false
          })
        ]
      }),
      new TimelineDate({
        id: 1,
        date: "3 June 2016",
        events: [
          new TimelineEvent({
            id: 7,
            name: "Committed changes",
            time: "3 June 2016 16:53:49",
            description: "After making some changes, I committed them and all that cool jazzy-like shizzle fits.",
            isDeleted: false
          })
        ]
      })
    ]})
    // new TimelineCategory({ id: 2, name: "Empty", color: '#33DD33'})
  ]);

  self.scaling = ko.observable(new TimelineScaling(1));

  // Methods
  self.paintAllEvents = function() {
    var categories,
        totalCategories,
        categoryId,
        categoryColor,
        dates,
        totalDates,
        dateId,
        events,
        totalEvents,
        eventId,
        currentEvent;

    categories = self.categories();
    totalCategories = categories.length;

    for (var categoryIndex = 0; categoryIndex < totalCategories; categoryIndex++) {
      categoryId = categories[categoryIndex].id;
      categoryColor = categories[categoryIndex].color();
      dates = categories[categoryIndex].dates();
      totalDates = dates.length;

      for (var dateIndex = 0; dateIndex < totalDates; dateIndex++) {
        dateId = dates[dateIndex].id;
        events = dates[dateIndex].events();
        totalEvents = events.length;

        self.paintDotForDate(categoryId, dateId, categoryColor);
        self.paintLineForDate(categoryId, dateId, categoryColor);
      }
    }
  };

  self.paintDotForDate = function(categoryId, dateId, color) {
    // Find stage to draw canvas
    var stage = new createjs.Stage("timeline-dot--" + categoryId + "-" + dateId);

    // Circle
    var circle = new createjs.Shape();
    circle.graphics.beginFill(color).drawCircle(4, 4, 4);

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
      var stage = new createjs.Stage("timeline-line--" + categoryId + "-" + dateId);

      // Circle
      var line = new createjs.Shape();
      line.graphics.beginFill(color).drawRect(0, 2, timeToNextDate, 4); // x, y, width, height

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

  self.toggleDateDetails = function(categoryId, id) {
    var clicked = $("#timeline-category--" + categoryId).find("#timeline-details--" + id);
    var isCurrentlyEnabled = clicked.hasClass('active');

    $(".timeline-date--bubble.active").removeClass('active');

    if (!isCurrentlyEnabled) {
      clicked.toggleClass('active');
    }
  };

  self.addEvent = function() {

  };

  self.changeScaling = function(multiplier) {
    if (multiplier > 0) {
      self.scaling().multiplier(multiplier);
      self.paintAllEvents();
    }
  };
}

// Bindings
ko.applyBindings(new TimelineViewModel());
