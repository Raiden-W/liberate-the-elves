//Move your face to operate the multuple-layer shades to bounce the ceratures back to the outter layer and
//prevent them falling back to the center of the canvas. If you make all of them arrive at the destinations located
//at the conners of the canvas seperatedly, then you will trigger the final effect!
//（I planned to add more kinds of creature that can interact with myCreature and also more effects of vision. But time is simply running
//out before I could do these things. It's a pity!)
//-----------------------------------------------------------------------------------------------

var cam;
var poseNet; /*to store the pose-recognition object from the library ml5*/
var posInput; /*to store the object from the class that I create to convert recognised nose position from camera to canvas,
so I can use the propeties x and y to input to other places*/

const numShade = 6; /*how many layers of the shades*/
const rMinShade = 50; /*radius of the most inmost shade*/
var rMaxShade; /*radius of the most outmost shade*/
var rGap;

var shades = [];

var myCreature = [];
var zone =
	[]; /*zones dividied by the shade, boolean to tell which zone my creature is located*/

var des =
	[]; /*destinations (the four conners of the canvas) that players try to help the creatures arrive at*/
var timeArr = 0; /*we have 4 creatrues and 4 destinations, so how many times whichever creature has arrived whichever zone*/
var thisFrame; /*use frame count to record the momemnt when all the creatures arrive all the destinations*/

function setup() {
	const size = window.innerHeight;
	createCanvas(size, size);
	colorMode(HSB, 360, 100, 100, 100);
	background(212, 40, 95);

	cam = createCapture(VIDEO);
	cam.hide();

	poseNet =
		ml5.poseNet(cam); /*link the pose-recognition onject to my camera object*/
	poseNet.on(
		"pose",
		gotPoses
	); /*use a defined function gotPoses (bottom of this sketch) to grab the recognised information*/

	posInput =
		new ConvertNosePos(); /*link the pose-recognition onject to my camera object*/

	rMaxShade =
		(width / 2) * 0.95; /*radius of the most outmost shade decided by width*/
	rGap =
		(rMaxShade - rMinShade) /
		(numShade - 1); /*caculate the gap size betwween every layer of shade*/

	//initial the shades
	for (let i = 0; i < numShade; i++) {
		//                   (index, radius, thickness, numUnitPer)
		shades[i] = new Shade(i, rMinShade + i * rGap, 9 + i * 1.2, 18 + i * 7);
	}

	//initial my creatures and destinations
	for (let i = 0; i < 4; i++) {
		myCreature[i] = new MyCreature();
		des[i] = new Destination(i, 280);
	}
}

function draw() {
	background(212, 40, 95);
	cam.loadPixels();

	posInput.inputPos(); //call the method of posInput to convert nose position from camera into the canvas position

	push();
	translate(width / 2, height / 2);
	drawBackground(); //a function defined to draw the circular background with colors changed according to camera

	//distrubuted the arcs of every shades according to the nose-position input and display them
	for (let i = 0; i < numShade; i++) {
		shades[i].distributeArcs(posInput);
		shades[i].displayArcs();
	}

	//display destinations
	for (let i = 0; i < 4; i++) {
		des[i].display();
	}

	//deal with every creature
	for (let j = 0; j < 4; j++) {
		//use creature's position and distance to center to tell whether this creature is in a particular zone, output a boolean array by zones
		let distToCenter = dist(myCreature[j].pos.x, myCreature[j].pos.y, 0, 0);
		for (let i = 0; i < numShade + 1; i++) {
			if (
				distToCenter > rMinShade + (i - 1) * rGap &&
				distToCenter < rMinShade + i * rGap
			) {
				this.zone[i] = true;
			} else {
				this.zone[i] = false;
			}
		}

		//creatures are attracted by the center
		myCreature[j].attraction();

		//check if this creature arrives any destinations
		for (let k = 0; k < 4; k++) {
			if (des[k].arrival == false) {
				//if there are no creature ever arrived at this destination, continue to check it
				des[k].checkArrival(myCreature[j]);
				if (des[k].arrival == true) {
					//if this destination has been arrived at by this creature,
					myCreature[j].setArrival(des[k]); //then link this creature to the destination that it arrived
					timeArr++; //if an arrival has ever happend, count 1 time
				}
			}
		}

		//if this creature has not yet arrived any destination, execute the following
		if (myCreature[j].arrival == false) {
			//check this creature with every shade
			for (let i = 0; i < numShade + 1; i++) {
				//if this creature is in this partucular zone, then continue to check; ontherwise dont check
				if (this.zone[i]) {
					//check the inner and outter shade of this zone and see if they are collided by this creature
					if (i < numShade && myCreature[j].checkCollision(shades[i])) {
						//if the outter shade of this zone is collided
						//creature bounces back and given a speedup towards center
						myCreature[j].bounce();
						myCreature[j].speedUpInner();
					}

					if (i > 0 && myCreature[j].checkCollision(shades[i - 1])) {
						//if the inner shade of this zone is collided
						//creature bounces back and given a speedup opposite center
						myCreature[j].bounce();
						myCreature[j].speedUpOutter();
					}
				}
			}

			myCreature[j].updatePos(); //add all the velocity to this creature's position
		} else {
			//if this creature has arrived a destination, execute the arrive action
			myCreature[j].arrive();
		}

		myCreature[j].display(); //display every creature

		if (timeArr < 4) {
			//if not all the 4 creatures arrived their destinations
			//save the frameCount all the time untill all the 4 creatures arrived their destinations, so it gonna stop at when all 4 arrived
			thisFrame = frameCount;
		} else {
			//after all the 4 creature arrived
			if (frameCount > thisFrame + 60) {
				//then wait for another 2s
				myCreature[j].finish(); //trigger the finishing effect
			}
			if (frameCount > thisFrame + 360) {
				//then wait for another 12s
				displayWords("Ending"); //display the ending words
			}
		}
	}

	if (frameCount < 360) {
		//at the beginning of the program, display the introduction words for 12s
		displayWords("Intro");
	}
	pop();
}

//function defined to grab the nose position from camera using ml5 'pose'
function gotPoses(poses) {
	if (poses.length > 0) {
		xTrack = poses[0].pose.keypoints[0].position.x; //originally tracked x position of nose
		yTrack = poses[0].pose.keypoints[0].position.y; //originally tracked y position of nose
		xNose = lerp(xNose, xTrack, 0.6); //smooth the jerky value
		yNose = lerp(yNose, yTrack, 0.6);
	}
}
