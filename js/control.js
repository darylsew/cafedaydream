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

// w - world representation (i.e. model)
// c - html canvas (i.e. view)
function animate(w, canvas) {
    w.timestep = w.time - w.startTime;
//    console.log("Timestep: " + w.timestep);
//    console.log("Bunny coords: (" + w.objects[0].x + ", " + w.objects[0].y + ")");

    // get the graphics context from the canvas
    // this is an object that lets us draw onto the canvas
    var ctx = canvas.getContext("2d");
    // clear context to draw the new stuff
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // render our world representation onto the view
    renderWorld(w, ctx);

//    console.log("World before: " + w.objects[0].y);
    // make updates to the world - time, gravity, etc
    updateWorld(w);
//    console.log("World after: " + w.objects[0].y);

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
    // TODO verify
    // loop through objects, update positions
    // x = vit + at^2
    w.objects.forEach(function (o) {
        console.log("velb4: " + o.v);
        o.v -= w.acceleration;
        o.y -= o.v;
    });
    return w;
}

// for rendering our world to the view
function renderWorld(w, ctx) {
    // TODO verify
    // loop through objects, draw each
    // for now, draw circles; later we'll draw images
    w.objects.forEach(function (o) {
        drawCircle(ctx, o.x, o.y, 20);
    });
}

$(document).ready(function() {
    var canvas = $("#canvas")[0];

    // bunny constants. (x, y) initial position on canvas
    var bunny = {
        x : 200,
        y : 200,
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
        acceleration : 10
    };

    console.log("bunny vel here: " + world.objects[0].v);

    animate(world, canvas);
});
