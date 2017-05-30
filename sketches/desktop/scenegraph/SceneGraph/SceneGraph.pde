/**
 Scene Graph
 by Jean Pierre Charalambos.
 
 Scene-graphs are simply a hierarchy of nested coordinate systems (frames).
 
 This sketch implements the following scene-graph:
 
 World
  ^
  |
  |
 L1
  ^
  |\
  | \
 L2  L3
 
 Each frame is defined by a single affine transformation
 or by a composition of several affine transformations read in
 left-to-right order (top-down in the code).
 Refer to the 'mnemonic rule 2' in the presentation.
 
 This sketch also shows how to use a matrix stack of transformations
 to "navigate" among the scene-graph frames.
 See: http://processing.org/reference/pushMatrix_.html
 
 A scene-graph with an eye frame is implemented in the MiniMap sketch
 */

PFont font;

//Choose FX2D, JAVA2D, P2D
String renderer = P2D;

void setup() {
  size(700, 700, renderer);
  font = createFont("Arial", 12);
  textFont(font, 12);
}

void draw() {
  background(50);
  axes();
  // define a local frame L1 (respect to the world)
  pushMatrix();
  translate(400, 40);
  rotate(QUARTER_PI / 2);
  axes();
  // draw a robot in L1
  fill(255, 0, 255);
  robot();
  // define a local frame L2 respect to L1
  pushMatrix();
  translate(200, 300);
  rotate(-QUARTER_PI);
  scale(2);
  axes();
  // draw a house in L2
  fill(0, 255, 255);
  house();
  // "return" to L1
  popMatrix();
  // define a local coordinate system L3 respect to L1
  pushMatrix();
  translate(-80, 160);
  rotate(HALF_PI);
  scale(1.5);
  axes();
  // draw a robot in L3
  fill(255, 255, 0);
  robot();
  // return to L1
  popMatrix();
  // return to World
  popMatrix();
}

//taken from: https://processing.org/tutorials/transform2d/
void robot() {
  pushStyle();
  noStroke();
  rect(20, 0, 38, 30); // head
  rect(14, 32, 50, 50); // body
  rect(0, 32, 12, 37); // left arm
  rect(66, 32, 12, 37); // right arm
  rect(22, 84, 16, 50); // left leg
  rect(40, 84, 16, 50); // right leg
  fill(222, 222, 249);
  ellipse(30, 12, 12, 12); // left eye
  ellipse(47, 12, 12, 12); // right eye
  popStyle();
}

//taken from: https://processing.org/tutorials/transform2d/
void house() {
  pushStyle();
  triangle(15, 0, 0, 15, 30, 15);
  rect(0, 15, 30, 30);
  rect(12, 30, 10, 15);
  popStyle();
}

void axes() {
  pushStyle();
  // X-Axis
  strokeWeight(4);
  stroke(255, 0, 0);
  fill(255, 0, 0);
  line(0, 0, 100, 0);
  text("X", 100 + 5, 0);
  // Y-Axis
  stroke(0, 0, 255);
  fill(0, 0, 255);
  line(0, 0, 0, 100);
  text("Y", 0, 100 + 15);
  popStyle();
}
