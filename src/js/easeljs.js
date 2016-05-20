window.onload = function(){
  var stage = new createjs.Stage("demoCanvas");

  // Circle
  var circle1 = new createjs.Shape();
  circle1.graphics.beginFill("DeepSkyBlue").drawCircle(100, 20, 7);

  // Line
  var line = new createjs.Shape();
  line.graphics.beginFill("DeepSkyBlue").drawRect(115,17,150,6);

  // Circle
  var circle2 = new createjs.Shape();
  circle2.graphics.beginFill("DeepSkyBlue").drawCircle(280, 20, 7);

  // Update stage
  stage.addChild(circle1, line, circle2);
  stage.update();
};
