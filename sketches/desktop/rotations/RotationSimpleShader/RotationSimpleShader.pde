// 1. Rotation parameters
float xr=500, yr=250;
float beta = -QUARTER_PI;
boolean applyMatrix = true;
// 2. simple custom shader
PShader simpleShader;

void setup() {
  size(700, 700, P3D);
  // simple custom shader
  simpleShader = loadShader("simple_frag.glsl", "simple_vert.glsl");
  shader(simpleShader);
}

void draw() {
  background(0);
  // default and simple custom shaders:
  if (applyMatrix) {
    // We do the rotation as: T(xr,yr)Rz(β)T(−xr,−yr)
    // 1. T(xr,yr)
    applyMatrix(1, 0, 0, xr, 
      0, 1, 0, yr, 
      0, 0, 1, 0, 
      0, 0, 0, 1);
    // 2. Rz(β)
    applyMatrix(cos(beta), -sin(beta), 0, 0, 
      sin(beta), cos(beta), 0, 0, 
      0, 0, 1, 0, 
      0, 0, 0, 1);
    // 3. T(−xr,−yr)
    applyMatrix(1, 0, 0, -xr, 
      0, 1, 0, -yr, 
      0, 0, 1, 0, 
      0, 0, 0, 1);
  } else {
    // we do the rotation as: T(xr,yr)Rz(β)T(−xr,−yr)
    // 1. T(xr,yr)
    translate(xr, yr);
    // 2. Rz(β)
    rotate(beta);
    // 3. T(−xr,−yr)
    translate(-xr, -yr);
  }
  pivot();
  lShape();
}

void keyPressed() {
  if (key != '+' && key != '-' && key != ' ')
    return;
  if (key == '+')
    beta += .1;
  if (key == '-')
    beta -= .1;
  if (key == ' ')
    applyMatrix = !applyMatrix;
}

void mouseDragged() {
  beta = map(mouseX, 0, width, 0, -HALF_PI);
}

void pivot() {
  pushStyle();
  stroke(0, 255, 255);
  strokeWeight(6);
  point(xr, yr);
  popStyle();
}

void lShape() {
  pushStyle();
  fill(204, 102, 0, 150);
  rect(50, 50, 200, 100);
  rect(50, 50, 100, 200);
  popStyle();
}