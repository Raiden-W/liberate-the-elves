//bling-bling things
class MyCreature {
  constructor() {
    this.pos = createVector(0, 0);   //position
    this.dia = 20;    //diameter
    this.limitVel = 5.2;    //velocity limitation value
    this.vel = (createVector(0, this.limitVel)).rotate(random(TWO_PI));     //initial random direction of velocity
    this.acc = createVector(0, 0);    //acceleration
    this.accVal = 0.15;   //magnitude of acceleration

    this.numPar = 15;   //num of particles around the creature
    this.particle = [];
    this.seed = random(1000);  //random perlin noise seed

    this.arrival = false;   //signal of whether the creature has arrived any destination
    this.xArr;    //the static position from destination to fix the creature
    this.yArr;
    this.distParVar = 0;    //the variables to change the distance to center and the size of particles to make a finishing effect
    this.rParVar = 0;
  }

  // creatures are attracted by the center
  attraction() {
    let directionAtt = p5.Vector.mult(this.pos, -1);
    directionAtt.normalize();    //unit vector always towards the center
    this.acc = p5.Vector.mult(directionAtt, this.accVal);   //figure out the attractive acceleration
    noiseSeed(this.seed);
    let move = (noise(frameCount/100) * 2) - 1;   //deviate the attractive acceleration with a continuous and random angle
    this.acc.rotate(QUARTER_PI * move * 0.85);    //to make the movement go towards either side
    this.vel.add(this.acc);                       //add the acceleration to velocity
  }

  //give a speedup opposite the center
  speedUpOutter() {
    let accPer = this.pos.copy();
    accPer.normalize();
    accPer.mult(this.limitVel);
    this.vel.add(accPer);
  }

  //give a speedup towards the center
  speedUpInner() {
    let accPer = this.pos.copy();
    accPer.mult(-1);
    accPer.normalize();
    accPer.mult(this.limitVel);
    this.vel.add(accPer);
  }

  //flip the velocity towards the center and keep the perpendicular one
  bounce() {
    let temPos = this.pos.copy();
    this.vel.reflect(temPos);   //flip the current velocity with a normal line which is the vector towards the center
  }

  //add all the influences to the posotion with a velocity limitation
  updatePos() {
    this.vel.limit(this.limitVel);
    this.pos.add(this.vel);
  }

  //set the static position from the destination to this creature, let this creature stop moving, and set the signal to true
  setArrival(destination) {
    this.arrival = true;
    this.xArr = destination.xPin;
    this.yArr = destination.yPin;
  }

  //let the cerature smoothly move to the target position
  arrive() {
    this.pos.x = lerp(this.pos.x, this.xArr, 0.1);
    this.pos.y = lerp(this.pos.y, this.yArr, 0.1);
  }

  //check if the ceature collides with a particular shade
  checkCollision(shade) {
    //every shade has 4 arcs being divided into many circles, here to check if the creature overlaps any circles, and return a boolean
    for(let i = 0; i < shade.numUnitPer * 4; i++){
      let distToShadeOutter = dist(this.pos.x, this.pos.y, shade.xUnit[i], shade.yUnit[i]);
      if(distToShadeOutter < (this.dia/2 + shade.thickness/2)) {
        return true;
        break;
      }
    }
  }

  //the finishing effect triggered after all creatures arrive their destinations
  finish() {
    this.xArr = 0;    //all creature gathers to the center of canvas
    this.yArr = 0;
    if(this.dia < (width*1.5)) {
      this.dia += 1.8;    //creature size becomes larger
      this.distParVar += 1.5;   //particle sizes become larger
      this.rParVar += 0.1;    //particles distances to the center of creature become larger
    }
  }

  //display the creatures
  display() {
    push();
    noiseSeed(this.seed);
    blendMode(ADD);   //let the creature and particles have a glow effect
    let col = color(47, 84, 99);
    drawingContext.shadowColor = col;   //draw the shadow of the creature and particles
    drawingContext.shadowBlur = 30;
    noStroke();
    fill(col);
    ellipse(this.pos.x, this.pos.y, this.dia);
    translate(this.pos.x, this.pos.y);    //draw particles around ths center of the creature
    //use polar system and perlin noise to draw constant and random variety in size, distance from center and movement of the particles
    for(let i = 0; i < this.numPar; i++) {
      let distPar = (noise(i, frameCount/100)+0.2) * (25 + this.distParVar);
      let anglePar = noise(i+100, frameCount/50) * PI * 4;
      let rPar = noise(i+200, frameCount/100) * (10 + this.rParVar);
      ellipse(cos(anglePar) * distPar, sin(anglePar) * distPar, rPar);
    }
    pop();
  }

}
