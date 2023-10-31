// display the introduction and ending words
function displayWords(words) {
  push();
  drawingContext.shadowBlur = 20;     //shadow of rectangle
  drawingContext.shadowColor = color(47, 0, 100);
  noStroke();
  fill(47, 0, 100, 70);
  rectMode(CENTER);
  rect(0, -10, width, 210);   //background of words

  drawingContext.shadowOffsetX = 5;     //shadow of texts
  drawingContext.shadowOffsetY = -3;
  drawingContext.shadowBlur = 8;
  drawingContext.shadowColor = color(47, 0, 0);
  fill(47, 75, 100);
  textStyle(BOLDITALIC)

  if(words == 'Intro') {    //introduction
    let line1 = 'Turn on the camera and move your head';
    let line2 = 'to control the arcs bouncing these bling-blings';
    let line3 = 'to reach their destinations (four conners).';

    textSize(36);
    textAlign(CENTER);

    text(line1, 0, -60);
    text(line2, 0, 0);
    text(line3, 0, 60);
  }

  if(words == 'Ending') {    //ending
    let line1 = 'THANKS!';

    textSize(54);
    textAlign(CENTER);

    text(line1, 0, 10);
  }

  pop();
}
