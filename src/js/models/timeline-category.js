function TimelineCategory(data) {
  var self = this;
  self.id = data.id;
  self.name = ko.observable(data.name || "New Category");
  self.color = ko.observable(data.color || 0);
  self.dates = ko.observableArray(data.dates || null);
}
