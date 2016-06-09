function TimelineCategory(data) {
  var self = this;

  if (data === undefined || data.id === undefined || data.id === undefined) {
    throw "Incomplete Data Exception";
  } else {
    self.id = data.id;
    self.name = ko.observable(data.name || "New Category");
    self.color = ko.observable(data.color || "#333");
    self.dates = ko.observableArray(data.dates || []);

    self.latestDate = ko.computed(function() {
      var latestDate;
      var numberOfDates = self.dates().length;
      if (numberOfDates > 0) {
        latestDate = self.dates()[numberOfDates - 1];
      }
      return latestDate;
    });
  }
}
