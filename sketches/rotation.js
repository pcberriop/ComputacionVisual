/**
 Rotation
 by Jean Pierre Charalambos.
 
 Mnemonic 1 example of 2d rotation about an arbitrary pivot
*/

var sketch = function( p ) {
    var xr=500, yr=250;
    var beta = -p.QUARTER_PI;
    
    p.setup = function() {
        p.createCanvas(700, 700);
    };

    p.draw = function() {
        p.background(50);
        // we do the rotation as: T(xr,yr)Rz(β)T(−xr,−yr)
        // 1. T(xr,yr)
        p.translate(xr, yr);
        // 2. Rz(β)
        p.rotate(beta);
        // 3. T(−xr,−yr)
        p.translate(-xr, -yr);
        pivot();
        lShape();
    };
    
    p.mouseWheel = function (event) {
        beta += event.delta/2;
        //uncomment to block page scrolling
        //return false;
    }
    
    p.mouseDragged = function () {
        beta = p.map(p.mouseX, 0, p.width, 0, -p.HALF_PI);
        //return false;
    }
    
    function pivot() {
        p.push();
        p.stroke(0, 255, 255);
        p.strokeWeight(6);
        p.point(xr, yr);
        p.pop();
    }

    function lShape() {
        p.push();
        p.fill(204, 102, 0, 150);
        p.rect(50, 50, 200, 100);
        p.rect(50, 50, 100, 200);
        p.pop();
    }
};

var p5_0 = new p5(sketch, 'rotation_id');
