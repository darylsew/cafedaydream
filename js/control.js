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

// w - world representation (i.e. model)
// c - html canvas (i.e. view)
function animate(w, canvas) {
    w.timestep = w.time - w.startTime;
    console.log("Timestep: " + w.timestep);
    console.log("Bunny coords: (" + w.objects[0].x + ", " + w.objects[0].y + ")");

    // get the graphics context from the canvas
    // this is an object that lets us draw onto the canvas
    var ctx = canvas.getContext("2d");
    // clear context to draw the new stuff
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderWorld(w, ctx);

    // make updates to the world - time, gravity, etc
    updateWorld(w);

    // call animate again with the updated world and context
    // in other words, request a new animation frame once the current one
    // is done rendering.
    requestAnimFrame(function() {
        animate(w, canvas);
    });
}

// for any updates to our world
function updateWorld(w) {
    w.time = Date.now();
    // loop through objects, update positions
    // x = vit + at^2
    w.objects.forEach(function (o) {
        o.v -= w.acceleration;
        o.y -= o.v;
    });
}

// for rendering the world to the view
function renderWorld(w, ctx) {
    // loop through objects in the world and draw circles for each of them
    // TODO draw image sprites based on objects, 
    // which will store filepaths to images
    w.objects.forEach(function (o) {
        drawCircle(ctx, o.x, o.y, 20);
    });
}

$(document).ready(function() {
    var canvas = $("#canvas")[0];

    // bunny constants. (x, y) initial position on canvas
    var bunny = {
        x : 200,
        y : 10,
        v : 0
    };

    canvas.addEventListener("mousemove", function(e) {
        var mousePos = getMousePos(canvas, e);
        bunny.x = mousePos.x;
        //bunny.y = mousePos.y;
    });

    
    // world representation; initially no bubbles/obstacles
    var world = {
        startTime : Date.now(),
        time : Date.now(),
        objects : [bunny], 
        acceleration : .01
    };

    animate(world, canvas);
});
