/**
 Mini Map
 by Jean Pierre Charalambos.
 
 Refer to the SceneGraph example first.
 
 This sketch implements the following scene-graph:
 
 World
 ^
 |\
 | \
 L1 Eye
 ^
 |\
 | \
 L2  L3
 
 The scene-graph has en eye frame used to navigate the scene.
 
 Using off-screen rendering we draw the above scene-graph twice.
 See: https://p5js.org/reference/#/p5/createGraphics
 
 The eye frame is typically used to navigate the scene where it
 is defined. Here, however, the main scene eye (canvas1) is used
 to navigate the minimap scene (canvas2). 
 
 Press the space-bar to toggle the minimap and the arrows to
 scale the minimap.
*/

var sketch = function( p ) {
    var canvas1;
    var canvas2;
    var showMiniMap = false;

    //eye params
    var eyePosition = p.createVector(0,0);
    var eyeOrientation = 0;
    var eyeScaling = 0.5;
    
    p.setup = function() {
        p.createCanvas(700, 700);
        p.frameRate(15);
        canvas1 = p.createGraphics(p.width, p.height);
        canvas2 = p.createGraphics(p.width/2, p.height/2);
    };

    p.draw = function() {
        //p.background(0);
        canvas1.background(50);
        // call scene off-screen rendering on canvas 1
        scene(canvas1);
        if (showMiniMap)
            drawEye();
        // draw canvas onto screen
        p.image(canvas1, 0, 0);
        // minimap
        if (showMiniMap) {
            canvas2.background(0);
            // the eye matrix is defined as the inverted matrix
            // used to set the drawEye() for canvas1:
            // inv(T(eyePosition)*R(eyeOrientation)*S(eyeScaling)) =
            // inv(S(eyeScaling)) * inv(R(eyeOrientation)) * inv(T(eyePosition)) =
            // S(1/eyeScaling) * R(-eyeOrientation) * T(-eyePosition)
            canvas2.push();
            canvas2.scale(1/eyeScaling);
            canvas2.rotate(-eyeOrientation);
            canvas2.translate(-eyePosition.x, -eyePosition.y);
            scene(canvas2);
            canvas2.pop();
            // draw canvas onto screen
            p.image(canvas2, 0, p.height/2);
        }
    };
    
    p.mouseMoved = function () {
        eyePosition.x = p.mouseX;
        eyePosition.y = p.mouseY;
        //return false;
    }
    
    p.mouseDragged = function () {
        if (p.mouseButton == p.CENTER)
            if(p.mouseX > p.pmouseX)
                eyeScaling *= 1.03;
            else
                eyeScaling /= 1.03;
        //return false;
    }
    
    p.mouseWheel = function (event) {
        eyeOrientation += event.delta;
        //uncomment to block page scrolling
        //return false;
    }
    
    p.mouseClicked = function () {
        if (p.mouseButton == p.LEFT)
            showMiniMap = !showMiniMap;
        //return false;
    }
    
    function scene(pg) {
        axes(pg);
        // define a local frame L1 (respect to the world)
        pg.push();
        pg.translate(400, 40);
        pg.rotate(p.QUARTER_PI / 2);
        axes(pg);
        // draw a robot in L1
        pg.fill(255, 0, 255);
        robot(pg);
        // define a local frame L2 respect to L1
        pg.push();
        pg.translate(200, 300);
        pg.rotate(-p.QUARTER_PI);
        pg.scale(2);
        axes(pg);
        // draw a house in L2
        pg.fill(0, 255, 255);
        house(pg);
        // "return" to L1
        pg.pop();
        // define a local coordinate system L3 respect to L1
        pg.push();
        pg.translate(-80, 160);
        pg.rotate(p.HALF_PI);
        pg.scale(1.5);
        axes(pg);
        // draw a robot in L3
        pg.fill(255, 255, 0);
        robot(pg);
        // return to L1
        pg.pop();
        // return to World
        pg.pop();
    };
    
    function drawEye() {
        // define an eye frame L1 (respect to the world)
        canvas1.push();
        // the position of the minimap rect is defined according to eye parameters as:
        // T(eyePosition)*R(eyeOrientation)*S(eyeScaling)
        canvas1.translate(eyePosition.x, eyePosition.y);
        canvas1.rotate(eyeOrientation);
        canvas1.scale(eyeScaling);
        canvas1.stroke(0, 255, 0);
        canvas1.strokeWeight(8);
        canvas1.noFill();
        canvas1.rect(0, 0, canvas2.width, canvas2.height);
        // return to World
        canvas1.pop();
    }
    
    function axes(pg) {
        pg.push();
        // X-Axis
        pg.strokeWeight(4);
        pg.stroke(255, 0, 0);
        pg.fill(255, 0, 0);
        pg.line(0, 0, 100, 0);
        pg.text("X", 100 + 5, 0);
        // Y-Axis
        pg.stroke(0, 0, 255);
        pg.fill(0, 0, 255);
        pg.line(0, 0, 0, 100);
        pg.text("Y", 0, 100 + 15);
        pg.pop();
    };
    
    //taken from: https://processing.org/tutorials/transform2d/
    function robot(pg) {
        pg.push();
        pg.noStroke();
        pg.rect(20, 0, 38, 30); // head
        pg.rect(14, 32, 50, 50); // body
        pg.rect(0, 32, 12, 37); // left arm
        pg.rect(66, 32, 12, 37); // right arm
        pg.rect(22, 84, 16, 50); // left leg
        pg.rect(40, 84, 16, 50); // right leg
        pg.fill(222, 222, 249);
        pg.ellipse(30, 12, 12, 12); // left eye
        pg.ellipse(47, 12, 12, 12); // right eye
        pg.pop();
    }

    //taken from: https://processing.org/tutorials/transform2d/
    function house(pg) {
        pg.push();
        pg.triangle(15, 0, 0, 15, 30, 15);
        pg.rect(0, 15, 30, 30);
        pg.rect(12, 30, 10, 15);
        pg.pop();
    };
};

var p5_mm = new p5(sketch, 'minimap_id');
