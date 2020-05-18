/*** This file contains all the functions for drawing the curves  ***/

//draws a quadratic curve throught the specified points
function quadraticCurveTo(ctx, x1, y1, x2, y2, xx=0, yy=0, margin_x=boardArea.margin_x, margin_y=boardArea.margin_y,scale=boardArea.scale) {
    x1 *= scale;
    y1 *= scale;
    x2 *= scale;
    y2 *= scale;
    ctx.quadraticCurveTo(margin_x + x1 + xx, margin_y + y1 + yy, margin_x + x2 + xx, margin_y + y2 + yy);
}

//moves the context to the specified location
function moveTo(ctx, x1, y1, xx = 0, yy = 0,  margin_x=boardArea.margin_x, margin_y=boardArea.margin_y,scale=boardArea.scale, bypass = false) {
    var newX = x1 * scale;
    var newY = y1 * scale;
    ctx.moveTo(margin_x + newX + xx, margin_y + newY + yy);
}

//draws a line to the specified coordinates
function lineTo(ctx, x1, y1, xx=0, yy=0, margin_x=boardArea.margin_x, margin_y=boardArea.margin_y,scale=boardArea.scale) {

    var newX = x1 * scale;
    var newY = y1 * scale;

    ctx.lineTo(margin_x + newX + xx, margin_y + newY + yy);
}

function arc(ctx,x1,y1,x2,y2,xx=0,yy=0,initialAngle=0,finalAngle=(2*Math.PI),  margin_x=boardArea.margin_x, margin_y=boardArea.margin_y ,scale=boardArea.scale,direction=true){
    var newX = x1 * scale;
    var newY = y1 * scale;

    var newX2 = x2 * scale;
    var newY2 = y2 * scale;

    radius = Math.sqrt( Math.pow((newX2 - newX) ,2) + Math.pow((newY2 - newY) ,2) );
    ctx.arc(margin_x + newX +xx, margin_y + newY + yy, radius,initialAngle,finalAngle,direction );
}

function correctWidth(w , scale = boardArea.scale) {
    return Math.max(1, Math.round(w * scale));
}
