function TimelineScaling(multiplier) {
  var self = this;
  var defaultScale = 160;
  self.multiplier = multiplier || 1;
  self.scaling = ko.computed(function() {
    return self.multiplier * defaultScale;
  });
}
