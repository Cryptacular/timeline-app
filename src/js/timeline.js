// Defaults
var defaultCategory = { name: "Default", color: 0 };

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
        id: 0,
        name: "First day",
        date: new Date(2016, 1, 11),
        description: "First day on the job at Fisher & Paykel.",
        isDeleted: false
      }),
      new TimelineEvent({
        id: 1,
        name: "First day",
        date: new Date(2016, 1, 11),
        description: "First day on the job at Fisher & Paykel.",
        isDeleted: true
      }),
      new TimelineEvent({
        id: 2,
        name: "Scrum Master",
        date: new Date(2016, 3, 4),
        description: "I was appointed as Scrum Master! Though I basically put up my own hand.",
        isDeleted: false
      })
    ]}),
    new TimelineCategory({ id: 2, name: "Empty", color: '#3333DD'})
  ]);
}

// Bindings
ko.applyBindings(new TimelineViewModel());
