describe("Timeline category model", function() {
  var timelineCategory, categoryData;

  beforeEach(function() {
    timelineCategory = null;
  });

  it("throws error if no data is passed in", function() {
    function createTimelineCategoryWithoutData() {
      timelineCategory = new TimelineCategory();
    }

    expect(createTimelineCategoryWithoutData).toThrow();
  });

  it("is not null", function() {
    categoryData = {
      id: 0
    };

    timelineCategory = new TimelineCategory(categoryData);

    expect(timelineCategory).not.toEqual(null);
  });

  it("sets defaults if only id is passed in", function() {
    categoryData = {
      id: 0
    };

    timelineCategory = new TimelineCategory(categoryData);

    expect(timelineCategory.name()).toEqual("New Category");
    expect(timelineCategory.color()).toEqual("#333");
    expect(timelineCategory.dates()).toEqual([]);
  });

  it("data is passed in correctly", function() {
    categoryData = {
      id: 123123123123,
      name: 'Deadpool likes chimichungas',
      color: 'YOURFACE',
      dates: ['Wade', 'Wilson', 0, 4.8, { property: 'someValue' }, ['Nested array']]
    };

    timelineCategory = new TimelineCategory(categoryData);

    expect(timelineCategory.id).toEqual(123123123123);
    expect(timelineCategory.name()).toEqual("Deadpool likes chimichungas");
    expect(timelineCategory.color()).toEqual("YOURFACE");
    expect(timelineCategory.dates()).toEqual(['Wade', 'Wilson', 0, 4.8, { property: 'someValue' }, ['Nested array']]);
  });

  it("computed latestDate method is returning correct value", function() {
    categoryData = {
      id: 0,
      dates: ["First", "Second"]
    };

    timelineCategory = new TimelineCategory(categoryData);

    expect(timelineCategory.latestDate()).toEqual("Second");
  });
});
