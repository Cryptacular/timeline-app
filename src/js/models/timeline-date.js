function TimelineDate(data) {
  var self = this;
  self.id = data.id;
  self.date = ko.observable(data.date || moment().format(momentFormat));
  self.events = ko.observableArray(data.events);

  this.dateString = ko.computed(function() {
    return moment(self.date()).format("ll");
  });
}
