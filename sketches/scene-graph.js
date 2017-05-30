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
 See: https://p5js.org/reference/#/p5/push
      https://p5js.org/reference/#/p5/pop
 
 A scene-graph with an eye frame is implemented in the MiniMap sketch
*/

var sketch = function( p ) {
    p.setup = function() {
        p.createCanvas(700, 700);
        p.frameRate(15);
    };

    p.draw = function() {
        p.background(50);
        axes();
        // define a local frame L1 (respect to the world)
        p.push();
        p.translate(400, 40);
        p.rotate(p.QUARTER_PI / 2);
        axes();
        // draw a robot in L1
        p.fill(255, 0, 255);
        robot();
        // define a local frame L2 respect to L1
        p.push();
        p.translate(200, 300);
        p.rotate(-p.QUARTER_PI);
        p.scale(2);
        axes();
        // draw a house in L2
        p.fill(0, 255, 255);
        house();
        // "return" to L1
        p.pop();
        // define a local coordinate system L3 respect to L1
        p.push();
        p.translate(-80, 160);
        p.rotate(p.HALF_PI);
        p.scale(1.5);
        axes();
        // draw a robot in L3
        p.fill(255, 255, 0);
        robot();
        // return to L1
        p.pop();
        // return to World
        p.pop();
    };
    
    function axes( ) {
        p.push();
        // X-Axis
        p.strokeWeight(4);
        p.stroke(255, 0, 0);
        p.fill(255, 0, 0);
        p.line(0, 0, 100, 0);
        p.text("X", 100 + 5, 0);
        // Y-Axis
        p.stroke(0, 0, 255);
        p.fill(0, 0, 255);
        p.line(0, 0, 0, 100);
        p.text("Y", 0, 100 + 15);
        p.pop();
    };
    
    //taken from: https://processing.org/tutorials/transform2d/
    function robot() {
        p.push();
        p.noStroke();
        p.rect(20, 0, 38, 30); // head
        p.rect(14, 32, 50, 50); // body
        p.rect(0, 32, 12, 37); // left arm
        p.rect(66, 32, 12, 37); // right arm
        p.rect(22, 84, 16, 50); // left leg
        p.rect(40, 84, 16, 50); // right leg
        p.fill(222, 222, 249);
        p.ellipse(30, 12, 12, 12); // left eye
        p.ellipse(47, 12, 12, 12); // right eye
        p.pop();
    }

    //taken from: https://processing.org/tutorials/transform2d/
    function house() {
        p.push();
        p.triangle(15, 0, 0, 15, 30, 15);
        p.rect(0, 15, 30, 30);
        p.rect(12, 30, 10, 15);
        p.pop();
    };
};

var p5_sg = new p5(sketch, 'scene-graph_id');
