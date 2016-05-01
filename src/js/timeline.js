// Defaults
var defaultCategory = { name: "Default", color: 0 };

// Models
function TimelineEvent(data) {
    var self = this;
    self.category = ko.observable(data.category || defaultCategory);
    self.name = ko.observable(data.name || "");
    self.date = ko.observable(data.date || new Date());
    self.description = ko.observable(data.description);

    this.dateString = ko.computed(function() {
      var day = self.date().getDate() + 1;
      var month = self.date().getMonth() + 1;
      var year = self.date().getFullYear();
      return day + '/' + month + '/' + year;
    });
}

// ViewModel
function TimelineViewModel() {
    var self = this;

    // Non-editable catalog data - would come from the server
    self.categories = [
        defaultCategory,
        { name: "Work", color: 1 }
    ];

    // Editable data
    self.events = ko.observableArray([
        new TimelineEvent(self.categories[0], "Started work", new Date(2016, 4, 25)),
        new TimelineEvent(self.categories[1], "Committed changes", new Date(2016, 4, 26))
    ]);

    // Methods
    self.loginUser = function() {
      self.user.isLoggedIn(true);
    };
}

// Bindings
ko.applyBindings(new TimelineViewModel());
