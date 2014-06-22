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

function drawImage(ctx, o, img) {
    // scale by radius
    // divide by 1000 to get more reasonable sizes
    // (hack for normalization storage in ints)
    ctx.drawImage(img, o.x, o.y, 
                  img.width * o.radius / 1000, 
                  img.height * o.radius / 1000);
}

function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x : e.clientX - rect.left,
        y : e.clientY - rect.top
    };
}

// used to create a bubble with the given spec
// future possible params:
// difficulty of popping,
// filepath to sprite used to draw the bubble,
// acceleration,
// etc
function bubble(canvas, radius, buoyancy, sprite) {
    var bubble = {
        x: Math.random() * canvas.width,
        y: 600 + radius * 2, 
        velocity: 0,
        radius : radius,
        buoyancy: buoyancy,
        sprite: sprite
    }
    console.log(canvas.height);
    return bubble;
}

// adds HUD
// currently only displays meters to the ground
function addHUD(w, ctx) {
    // TODO right align HUD
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    heightFromGround = Math.max(10000 - Math.floor(w.objects[0].y), 0) + "m";
    ctx.fillText(heightFromGround, canvas.width - 40, 20);
}

// w - world representation (i.e. model)
// c - html canvas (i.e. view)
function animate(w, canvas) {
    //console.log("Timestep: " + w.timestep);
    //console.log("Bunny coords: (" + w.objects[0].x + ", " + w.objects[0].y + ")");

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
    w.timestep = w.time - w.startTime;
    // loop through objects, update positions
    // x = vit + at^2
    w.objects.forEach(function (o) {
        // TODO (low priority) might want to add drag here to be slightly more accurate
        o.velocity -= w.gravity;
        o.velocity += o.buoyancy;
        o.y -= o.velocity;
    });

    // TODO don't add bubbles randomly, add them to beat of a song
    // XXX Need to generate a bunch of bubble images of random sizes at the start,
    // resizing bubbles dynamically makes for canvas flicker...
    if (Math.random()*100 < 2) {
        var scale = 50 + Math.random()*50;
        w.objects[w.objects.length] = bubble(canvas, scale, .02, "bubbleFull");
    }
}

// for rendering the world to the view
function renderWorld(w, canvas) {
    var ctx = canvas.getContext("2d");

    // scaling factor... could probably be cleaned up
    // so much fizix... using d = vit + 1/2at^2 to find time
    // ok pls fizix why isn't this correct ;-;
    var factor = Math.sqrt(2*w.gravity*canvas.height);
    document.getElementById("bg").getContext("2d").canvas.height =
        canvas.height * factor;

    //testing remove scrolling -- scaling seems to add overflow
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
            //drawCircle(ctx, o.x, o.y, o.radius, o.color);
            //drawImage(ctx, o.x, o.y, o.radius, w.sprites[o.sprite]);
            drawImage(ctx, o, w.sprites[o.sprite]);
        });
        $("#bg").css("background-position-y",-(w.objects[0].y - 10));
    } else {
        if (!w.over) {
            alert("oh noes, you're falling too fast!");
            w.over = true;
        }
    }

    addHUD(w, ctx);
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
        radius: 50,
        sprite: "upsideDown"
    };

    canvas.addEventListener("mousemove", function(e) {
        var mousePos = getMousePos(canvas, e);
        bunny.x = mousePos.x;
    });

    // list of filenames for images we'll draw
    var sprites = {
        bubbleFull: "./assets/bubbles/full.png",
        circle: "./assets/bunnies/circle.png",
        upsideDown: "./assets/bunnies/upsidedown.png"
    };

    // cache the images before the game starts
    var keys = Object.keys(sprites);
    keys.forEach(function(key) {
        var img = new Image();
        img.src = sprites[key]; // filename
        // deal with size
        img.onload = function() {
            // normalize
            var norm = img.width * img.width + img.height * img.height;
            var width = img.width / Math.sqrt(norm);
            var height = img.height / Math.sqrt(norm);
            img.width = width * 1000;
            img.height = height * 1000;
        };
        sprites[key] = img; 
    });

    // world representation; initially no bubbles/obstacles
    var world = {
        startTime: Date.now(),
        time: Date.now(),
        objects: [bunny], 
        gravity: .01,
        over: false,
        sprites: sprites
    };

    // TODO loading screen, start button, menu for selecting songs, etc
    animate(world, canvas);
});
