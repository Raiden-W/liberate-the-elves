//to draw a background consists of many layers of arcs and each arc grabs the camera pixiel color information to decide its
function drawBackground(numGap = 1, numInner = 1, numLayer = 25) {
  noStroke();
  //how many layers of arcs do we have in this pattern
  for (let i = numLayer; i > 0; i--) {
    let num = numInner + i*numGap;    //num of arc in this layer
    let angle = TWO_PI / num;   //the angle range of each arc in this layer
    let d = (rMinShade + (i-1)*rGap*0.5);   //diameter of this layer
      for (let j = 0; j < num; j++) {   //go though every arc in this layer
        let x = cos(angle*(j+0.5) + i*0.08) * d/2;    //the xy position of the middle point on the arc
        let y = sin(angle*(j+0.5) + i*0.08) * d/2;
        //convert the canvas position back to the camera position with flipping x value
        let xCam = int(map(x, -width/2, width/2, cam.width*0.5 + cam.height*0.4, cam.width*0.5 - cam.height*0.4));
        let yCam = int(map(y, -height/2, height/2, cam.height*0.1, cam.height*0.9));
        let indexCam = (xCam + yCam*cam.width)*4;   //figure out the index of the pixiel array
        let red = cam.pixels[indexCam];           //get r g b information of each pixiel
        let green = cam.pixels[indexCam + 1];
        let blue = cam.pixels[indexCam + 2];
        let sat = map((red + green + blue)/3, 0, 255, 50, 15);    //get an average value and translated it into saturation

        fill(212, sat, 95);
        arc(0, 0, d, d, angle*j + i*0.08, angle*(j+1) + i*0.08);    //draw the arc
      }
  }
}
