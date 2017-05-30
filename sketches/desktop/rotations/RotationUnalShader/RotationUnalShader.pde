// 1. Rotation parameters
float xr=500, yr=250;
float beta = -QUARTER_PI;
// 2. unal custom shader:
PShader unalShader;
//the unal shader will emit a custom uniform transform:
PMatrix3D modelview;

void setup() {
  size(700, 700, P2D);
  // unal custom shader, with a custom (unalMatrix) uniform
  unalShader = loadShader("unal_frag.glsl", "unal_vert.glsl");
  shader(unalShader);
  // the unal shader thus requires projection and modelview matrices:
  modelview = new PMatrix3D();
}

void draw() {
  background(0);
  //discard Processing matrices (only necessary in P3D)
  //resetMatrix();
  //load identity
  modelview.reset();
  // we do the rotation as: T(xr,yr)Rz(β)T(−xr,−yr)
  // 1. T(xr,yr)
  modelview.translate(xr, yr);
  // 2. Rz(β)
  modelview.rotate(beta);
  // 3. T(−xr,−yr)
  modelview.translate(-xr, -yr);
  //emit model-view and projection custom matrices
  emitUniforms();
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

//Whenever the model-view or projection matrices changes we need to emit the uniforms
void emitUniforms() {
  //hack to retrieve the Processing projection matrix
  PMatrix3D projectionTimesModelview = new PMatrix3D(((PGraphics2D)g).projection);
  projectionTimesModelview.apply(modelview);
  //GLSL uses column major order, whereas processing uses row major order
  projectionTimesModelview.transpose();
  unalShader.set("unalMatrix", projectionTimesModelview);
}