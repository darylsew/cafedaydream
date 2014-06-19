// TODO 
//take advantage of browser caching jquery
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
function drawCircle(ctx, x, y, r, color) {
    // lovely shade of blue
    // ctx.fillStyle = "rgba(0, 200, 200, 0.5)";
    ctx.fillStyle = color;
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
    renderWorld(w, canvas);

    // make updates to the world - time, gravity, etc
    updateWorld(w, canvas);

    // call animate again with the updated world and context
    // in other words, request a new animation frame once the current one
    // is done rendering.
    requestAnimFrame(function() {
        animate(w, canvas);
    });
}

// for any updates to our world
function updateWorld(w, canvas) {
    w.time = Date.now();
    // loop through objects, update positions
    // x = vit + at^2
    w.objects.forEach(function (o) {
        // TODO might want to add drag here to be slightly more accurate
        o.velocity -= w.gravity;
        o.velocity += o.buoyancy;
        o.y -= o.velocity;
    });


    // TODO don't add bubbles randomly, add them to beat of a song
    if (Math.random()*100 < 2) {
        w.objects[w.objects.length] = bubble(canvas, 25, .02, "rgba(255, 255, 255, 0.5");
    }
}

// for rendering the world to the view
function renderWorld(w, canvas) {
    // loop through objects in the world and draw circles for each of them
    // TODO draw image sprites based on objects, 
    // which will store filepaths to images
    var ctx = canvas.getContext("2d");

    // scaling factor... could probably be cleaned up
    // so much fizix... using d = vit + 1/2at^2 to find time
    // ok pls fizix why isn't this correct ;-;
    var factor = Math.sqrt(2*w.gravity*canvas.height);
    document.getElementById("bg").getContext("2d").canvas.height =
        canvas.height * factor;

    //testing remove scrolling -- scaling seems to add overflow
    // uhh i found this online
    // http://stackoverflow.com/questions/19817899/jquery-or-javascript-how-to-disable-window-scroll-without-overflowhidden
    $('body').on({
        'mousewheel': function(e) {
            if (e.target.id == 'el') return;
            e.preventDefault();
            e.stopPropagation();
        }
    });

    // drawing circle && panning
    if (w.objects[0].y < canvas.height) {
        w.objects.forEach(function (o) {
            drawCircle(ctx, o.x, o.y, o.radius, o.color);
        });
        $("#bg").css("background-position-y",-(w.objects[0].y - 10));
    } else {
        if (!w.over) {
            alert("oh noes, you're falling too fast!");
            w.over = true;
        }
    }

    // adding HUD
    // TODO right align HUD
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    heightFromGround = Math.max(5000 - Math.floor(w.objects[0].y), 0) + "m"
    ctx.fillText(heightFromGround, canvas.width - 40, 20);
}

// used to create a bubble with the given spec
// future possible params:
// difficulty of popping,
// filepath to sprite used to draw the bubble,
// acceleration,
// etc
function bubble(canvas, radius, buoyancy, color) {
    var bubble = {
        x: Math.random() * canvas.width,
        y: screen.height + radius * 2,
        velocity: 0,
        radius : radius,
        buoyancy: buoyancy,
        color: color
    }
    return bubble;
}

$(document).ready(function() {
    var canvas = $("#canvas")[0];

    // bunny constants. 
    // (x, y) initial position on canvas
    // velocity - initial velocity
    // buoyancy - buoyancy (really weight of fluid displaced but we don't care)
    var bunny = {
        x: 200,
        y: 10,
        velocity: 0,
        buoyancy: 0,
        radius: 20,
        color: "rgba(0, 200, 200, 0.5)"
    };

    canvas.addEventListener("mousemove", function(e) {
        var mousePos = getMousePos(canvas, e);
        bunny.x = mousePos.x;
        //bunny.y = mousePos.y;
    });


    // world representation; initially no bubbles/obstacles
    var world = {
        startTime: Date.now(),
        time: Date.now(),
        objects: [bunny], 
        gravity: .01,
        over: false
    };

    animate(world, canvas);
});
