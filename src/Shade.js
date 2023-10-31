//the multiple layers of shades that bounce the creature back
//these shades are operated by the tracking point of nose
class Shade{
  constructor(index, radius, thickness, numUnitPer) {
    this.index = index;   //tell the even or odd layer and decide the way of distrubuting the arcs
    this.radius = radius;
    this.thickness = thickness;   //stroke weight when draw the arcs, also the value of unit circle's size

    this.numUnitPer = numUnitPer;   //how many circular units an arc has
    this.anglesArc = [];    //4 angles defines the location of the 4 arcs
    this.angleUnit = [];    //to store all the angles of all the units
    this.xUnit = [];    //to store all the positions of all the units
    this.yUnit = [];

    this.xOperator = 0;    //the constrained position of the input from the tracking nose point
    this.yOperator = 0;
  }

  //distribute 4 arcs according to the converted tracking nose position(input position)
  distributeArcs(InputPosition) {
    //caculate the angle between the line connecting input postion and center of canvas and x axis
    let v1 = createVector(InputPosition.x - (width/2), InputPosition.y - (height/2));
    let v2 = createVector(1, 0);
    let angle = v1.angleBetween(v2);
    //use the real-time angle and a confined radius to figure out a circular 2D range on the canvas that constrains the input position in it
    let outterX = abs(cos(angle) * this.radius * 0.6);
    let outterY = abs(sin(angle) * this.radius * 0.6);
    this.xOperator = constrain(InputPosition.x - (width/2), -outterX, outterX);
    this.yOperator = constrain(InputPosition.y - (height/2), -outterY, outterY);

    //if this shade is in even number layer, distrubute the 4 arcs in a "+" way
    if(this.index % 2 == 0) {
      //use anti-trigonometry to figure out the angle of each arc in turn
      this.anglesArc[0] = asin(this.yOperator / this.radius);
      this.anglesArc[2] = PI - this.anglesArc[0];
      this.anglesArc[1] = acos(this.xOperator / this.radius);
      this.anglesArc[3] = TWO_PI - this.anglesArc[1];
    }

    //if this shade is in odd number layer, distrubute the 4 arcs in a "x" way
    else {
      //link the horizontal and vertical range of movement to the range of a arc's changing angle
      let angleX = map(this.xOperator, -this.radius*0.55, this.radius*0.55, -QUARTER_PI/2, QUARTER_PI/2);
      let angleY = map(this.yOperator, -this.radius*0.55, this.radius*0.55, -QUARTER_PI/2, QUARTER_PI/2);
      //figure out the angle of each arc in turn
      this.anglesArc[0] = QUARTER_PI + angleY - angleX;
      this.anglesArc[1] = HALF_PI + QUARTER_PI - angleY - angleX;
      this.anglesArc[2] = HALF_PI * 2 + QUARTER_PI - angleY + angleX;
      this.anglesArc[3] = HALF_PI * 3 + QUARTER_PI + angleY + angleX;
    }
  }

  //display all the arcs and divided them into many circular units
  displayArcs() {
  let gapUnit = QUARTER_PI / (this.numUnitPer - 1);
    //each shade has 4 arcs and we have each arc's specific angle
    for (let i = 0; i < this.numUnitPer * 4; i += 4) {
      //use the angle of each arc to caculate every unit's angle
      this.angleUnit[i] = this.anglesArc[0] - QUARTER_PI/2 + (i/4)*gapUnit;
      this.angleUnit[i+1] = this.anglesArc[1] - QUARTER_PI/2 + (i/4)*gapUnit;
      this.angleUnit[i+2] = this.anglesArc[2] - QUARTER_PI/2 + (i/4)*gapUnit;
      this.angleUnit[i+3] = this.anglesArc[3] - QUARTER_PI/2 + (i/4)*gapUnit;
    }

    //use each unit's angle and shade radius to caculate all the xy position, doing this is to
    //use these position check the collision with creatrues
    for (let i in this.angleUnit) {
      this.xUnit[i] = cos(this.angleUnit[i]) * this.radius;
      this.yUnit[i] = sin(this.angleUnit[i]) * this.radius;
    }

    //draw the arcs
    push();
    noFill();
    for (let i in this.anglesArc) {
      drawingContext.shadowColor = color(279, 89, 53);    //shadow
      drawingContext.shadowBlur = 15;
      strokeWeight(this.thickness);
      stroke(279, 89, 53);
      arc(0, 0, this.radius*2, this.radius*2, this.anglesArc[i] - QUARTER_PI/2, this.anglesArc[i] + QUARTER_PI/2);
      strokeWeight(this.thickness*0.6);
      stroke(0, 0, 100);    //draw one more time to make a effect similar to stroke
      arc(0, 0, this.radius*2, this.radius*2, this.anglesArc[i] - QUARTER_PI/2, this.anglesArc[i] + QUARTER_PI/2);
    }
    pop();
  }
}
