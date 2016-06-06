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
