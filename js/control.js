// TODO ...yeah this doesn't work
// take advantage of browser caching jquery
// http://stackoverflow.com/questions/1140402/how-to-add-jquery-in-js-file
//var script = document.createElement('script');
//script.src = 'http://code.jquery.com/jquery-1.11.0.min.js';
//script.type = 'text/javascript';
//document.getElementsByTagName('head')[0].appendChild(script);

// using requestAnimFrame for smoother animations
// see http://html5hub.com/request-animation-frame-for-better-performance/#i.mrc38s13une1qq
window.requestAnimFrame = function() {
    return (
            window.requestAnimationFrame        ||
            window.webkitRequestAnimationFrame  ||
            window.mozRequestAnimationFrame     ||
            window.oRequestAnimationFrame       ||
            window.msRequestAnimationFrame      ||
            function(/* function */ callback) {
                window.setTimeout(callback, 1000 / 60);
            }
            );
}();


// utility functions
function drawCircle(ctx, x, y, r) {
    ctx.fillStyle = "rgba(0, 200, 200, 0.5)";
    ctx.beginPath();
    var x = 25; // init x for bunny
    var y = 25; // init y for bunny
    var r = 20; // temp arc radius for bunny
    ctx.arc(x, y, r, 0, 2*Math.PI, true);
    ctx.fill();
}
  
function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x : e.clientX - rect.left,
        y : e.clientY - rect.top
    };
}

// animate function, does *everything*
// w - world representation (i.e. model)
// ctx - html canvas 2d graphics context (i.e. view)
function animate(w, ctx) {
    // calculate timestep difference
    var diff = w.time - w.startTime;
    // animate stuff using diff
    
    
    // update the world time
    w.time = Date.now();

    console.log("Timestep: " + diff);
    console.log("Bunny coords: (" + w.me.x + ", " + w.me.y + ")");

    // call animate again with the updated world and context
    requestAnimFrame(function() {
        animate(w, ctx);
    });
}

$(document).ready(function() {
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");

    // bunny constants
    var bunny = {
        x : 200,
        y : 200
    };

    canvas.addEventListener("mousemove", function(e) {
        var mousePos = getMousePos(canvas, e);
        bunny.x = mousePos.x;
        bunny.y = mousePos.y;
    });

    
    // world representation; initially no bubbles/obstacles
    var world = {
        startTime : Date.now(),
        time : Date.now(),
        me : bunny
    };

    animate(world, ctx);
});
