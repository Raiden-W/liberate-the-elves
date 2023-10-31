//destinations located at the four corners on the canvas
class Destination {
  constructor(index, dia) {
    this.index = index;   //to decide its location (which conner)
    this.dia = dia;   //diameter
    this.x = cos(QUARTER_PI + this.index*HALF_PI) * width*0.5 / sin(QUARTER_PI);    //figure out the xy position by its index
    this.y = sin(QUARTER_PI + this.index*HALF_PI) * width*0.5 / sin(QUARTER_PI);
    this.xPin = cos(QUARTER_PI + this.index*HALF_PI) * (width*0.5 / sin(QUARTER_PI) - 50);    //the position that pins the creature
    this.yPin = sin(QUARTER_PI + this.index*HALF_PI) * (width*0.5 / sin(QUARTER_PI) - 50);

    this.numL= 12;    //num of circles that form the wave animation

    this.arrival = false;   //signal of whether this destination has been arrived at by any creatures
  }

  //check if the creature overlaps this destination, if so, set the boolean to true
  checkArrival(myCreature) {
    let distance = dist(this.x, this.y, myCreature.pos.x, myCreature.pos.y);
    if (distance < (this.dia + myCreature.dia)/2) {
      this.arrival = true;
    }
  }

  //display this destination
  display() {
    push();
    noFill();
    stroke(227, 59, 65, 30);
    strokeWeight(16);
    blendMode(ADD);   //this blend mode is just mroe good-looking
    let diaGap = this.dia / this.numL;
    for(let i = 0; i < this.numL; i++) {
      let diaWave = sin((frameCount-i*10)/30) * diaGap;   //use sin() and frameCount to change every circle's diameter to make a wave effect
      ellipse(this.x, this.y, this.dia - i*diaGap + diaWave);
    }
    pop();
  }
}
