// Models
function TimelineEvent(category, name, date) {
    var self = this;
    self.category = ko.observable(category);
    self.name = ko.observable(name);
    self.date = ko.observable(date);
}

// ViewModel
function TimelineViewModel() {
    var self = this;

    // Non-editable catalog data - would come from the server
    self.categories = [
        { name: "Default", color: 0 }
    ];

    // Editable data
    self.events = ko.observableArray([
        new TimelineEvent(self.categories[0], "Started work", "26/04/2016"),
        new TimelineEvent(self.categories[0], "Committed changes", "26/04/2016")
    ]);

    self.loginUser = function() {
      self.user.isLoggedIn(true);
    };
}

// Bindings
ko.applyBindings(new TimelineViewModel());
