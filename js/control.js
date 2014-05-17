var xcoords = [0, 5, 10, 15, 20, 25, 30];

function draw() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        ctx.beginPath();
        var x = 25; // init x for bunny
        var y = 25; // init y for bunny
        var r = 20; // temp arc radius for bunny
        ctx.arc(x, y, r, 0, 2*Math.PI, true);
        ctx.fill();
    }
}


function animate() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        ctx.fillStyle = "rgba(0, 200, 200, 0.5)";
        ctx.beginPath();
        var x = 25; // init x for bunny
        var y = 25; // init y for bunny
        var r = 20; // temp arc radius for bunny
        ctx.arc(x, y, r, 0, 2*Math.PI, true);
        ctx.fill();
    }
}
