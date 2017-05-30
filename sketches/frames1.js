var sketch = function( p ) {
    p.setup = function() {
        p.createCanvas(900, 300);
        p.frameRate(15);
    };

    p.draw = function() {
        p.background(50);
        axes();
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
    }
};

var p5_1 = new p5(sketch, 'frames1_id');
