var xNose = 0;    //global value to store the tracked position of nose from ml5'poses'
var yNose = 0;

//convert recognised nose position from camera to canvas, so I can input the propeties x and y to other places
class ConvertNosePos {
  constructor() {
    this.xCur = 0;    //current frame tracked position in camera
    this.yCur = 0;
    this.xPre = 0;    //prebious frame tracked position in camera
    this.yPre = 0;
    this.x = 0;       //ultimate usable position in canvas
    this.y = 0;
  }

  inputPos() {
    //set a 2D square range in the camera image and limit the tracked point always in it to fit the square canvas
    //and I want when nose position is out of this square range, the position can stay at the edge of the range instead of flaying away
    if(xNose < (cam.width*0.5 + cam.height*0.4) && xNose > (cam.width*0.5 - cam.height*0.4)
      && yNose < cam.height*0.9 && yNose > cam.height*0.1) {    //if nose point is in this range
      this.xCur = lerp(this.xCur, xNose, 0.2);    //then update its original position and smooth it
      this.yCur = lerp(this.yCur, yNose, 0.2);
    } else {    //if nose point is out of this range
      this.xCur = this.xPre;    //then set it with the stored previous frame position instead of the really tracked position
      this.yCur = this.yPre;
    }
    this.xPre = this.xCur;    //the previous postion of next frame is up to the current frame's postion
    this.yPre = this.yCur;

    //translate the current position in the cameara to the usable position in the canvas and flip the x value to make the tracked
    //point reacted by face movement in a mirrored way
    this.x = map(this.xCur, cam.width*0.5 - cam.height*0.4, cam.width*0.5 + cam.height*0.4, width ,0);
    this.y = map(this.yCur, cam.height*0.1, cam.height*0.9, 0, height);
  }
}
