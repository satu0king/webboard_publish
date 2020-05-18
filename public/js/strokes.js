/*** This file has all the objects and classes related to a stroke ***/

function Stroke(startTime = Date.now(), width = boardAttributes.width, color = boardAttributes.color) {
    this.type = this.constructor.name;
    this.startTime = startTime;
    this.width = width;
    this.color = color;
}

Stroke.prototype.optimize = function(){

};
// Fn to be implemented in derived classes. Should be called after before pushing stroke to sessionObject or before saving ?

Stroke.prototype.update = function(position){};
// Fn to be implemented in derived classes. will be called while the mouse is down and moving

Stroke.prototype.mouseLeave = function(position){};
// Fn to be implemented in derived classes. will be called while the mouse is up

Stroke.prototype.stop = function(position){};
// Fn to be implemented in derived classes. Will be called when current stroke HAS to stop. Most cases its mouse leave

Stroke.prototype.render = function(position){};
// Fn to be implemented in derived classes. Will be called when current stroke has to be rendered.

strokeList = {
	"PenStroke":PenStroke,
    "LineStroke":LineStroke,
    "CircleStroke":CircleStroke,
    "QuadStroke":QuadStroke,
    "Eraser":Eraser
};

/* Penstroke */
function PenStroke(startPosition, startTime = Date.now(), width = boardAttributes.width, color = boardAttributes.color) {
    Stroke.call(this, startTime, width, color);
//    var paperPoint = new Point(startPosition.x,startPosition.y);
    this.points = [startPosition];
}

PenStroke.prototype = Object.create(Stroke.prototype);
PenStroke.prototype.constructor = PenStroke;

PenStroke.prototype.update = function(position) {
    // console.log(position);
//    var paperPoint = new Point(position.x,position.y);
    this.points.push(position);
};
PenStroke.prototype.optimize= function(){
    return;
    originalPts = this.points.length;
//    this.points = optimizePoints(this.points,0.5);
    this.points = simplify(this.points,1);
    // console.log(this.points.length);
    // var path = new paper.Path(this.points);
    // this.points = path.expSimple(1);
    optimizedPts = this.points.length;
    optPercent = (originalPts - optimizedPts)*100/originalPts;
    console.log(`Optimized by ${optPercent}%`);
    //console.log(this.points.length);
}
PenStroke.prototype.mouseLeave = function(position) {
    sessionObject.pages[boardArea.currentPageIndex + boardArea.focus_page].strokeList.push(this);
    boardArea.currentStroke = undefined;
    boardArea.context.globalCompositeOperation = 'source-over';
    boardArea.copyTemp();
};
PenStroke.prototype.stop = PenStroke.prototype.mouseLeave;


//method for free hand drawing
PenStroke.prototype.render = function(context, ox, oy , margin_x = boardArea.margin_x, margin_y = boardArea.margin_y,scale = boardArea.scale) {
    context.globalCompositeOperation = 'source-over';
    context.lineJoin = boardArea.temp_context.lineCap = context.lineCap = boardArea.temp_context.lineJoin = 'round';
    context.lineJoin = context.lineCap = 'round';

    function midPointBtw(p1, p2) {
        return {
            x: p1.x + (p2.x - p1.x) / 2,
            y: p1.y + (p2.y - p1.y) / 2
        };
    }

    var points = this.points;
    if (points.length < 2)
        return;
    var p1 = points[0];
    var p2 = points[1];
    context.strokeStyle = this.color;
    context.lineWidth = correctWidth(this.width);
    // console.log(context.lineWidth)
    context.beginPath();
    moveTo(context, p1.x, p1.y, ox, oy, margin_x,margin_y, scale);
    for (var i = 1, len = points.length; i < len; i++) {
        var midPoint = midPointBtw(p1, p2);
        quadraticCurveTo(context, p1.x, p1.y, midPoint.x, midPoint.y, ox, oy, margin_x,margin_y, scale);
        p1 = points[i];
        p2 = points[i + 1];
    }
    lineTo(context, p1.x, p1.y, ox, oy, margin_x,margin_y, scale);
    context.stroke();
};



/*Line strokes */

function LineStroke(startPosition, startTime = Date.now(), width = boardAttributes.width, color = boardAttributes.color) {
    Stroke.call(this, startTime, width, color);

	this.startPoint=startPosition;
	this.endPoint=startPosition;

}
LineStroke.prototype = Object.create(Stroke.prototype);
LineStroke.prototype.constructor = LineStroke;
LineStroke.prototype.update = function(position) {
	this.endPoint=position;
};
LineStroke.prototype.mouseLeave = function(position) {
    sessionObject.pages[boardArea.currentPageIndex + boardArea.focus_page].strokeList.push(this);
    boardArea.currentStroke = undefined;
    boardArea.context.globalCompositeOperation = 'source-over';
    boardArea.copyTemp();
};
LineStroke.prototype.stop = LineStroke.prototype.mouseLeave;
LineStroke.prototype.render = function(context, ox, oy , margin_x = boardArea.margin_x, margin_y = boardArea.margin_y,scale = boardArea.scale){
    context.globalCompositeOperation = 'source-over';
    context.lineJoin = boardArea.temp_context.lineCap = context.lineCap = boardArea.temp_context.lineJoin = 'round';
    context.lineJoin = context.lineCap = 'round';
    context.strokeStyle = this.color;
    context.lineWidth = correctWidth(this.width);
    context.beginPath();
    moveTo(context,this.startPoint.x,this.startPoint.y,ox,oy, margin_x,margin_y, scale);
    lineTo(context,this.endPoint.x,this.endPoint.y,ox,oy, margin_x,margin_y, scale);
    context.stroke();
};






/** Circle Strokes **/

function CircleStroke(startPosition, startTime = Date.now(), width = boardAttributes.width, color = boardAttributes.color) {
    Stroke.call(this, startTime, width, color);
    this.startPoint = startPosition;
    this.endPoint = startPosition;
}
CircleStroke.prototype = Object.create(Stroke.prototype);
CircleStroke.prototype.constructor = CircleStroke;
CircleStroke.prototype.update = function(position) {

    this.endPoint = position;
}
CircleStroke.prototype.mouseLeave = function(position) {
    sessionObject.pages[boardArea.currentPageIndex + boardArea.focus_page].strokeList.push(this);
    boardArea.currentStroke = undefined;
    boardArea.context.globalCompositeOperation = 'source-over';
    boardArea.copyTemp();
}
CircleStroke.prototype.stop = CircleStroke.prototype.mouseLeave;
CircleStroke.prototype.render = function(context, ox, oy , margin_x = boardArea.margin_x, margin_y = boardArea.margin_y,scale = boardArea.scale){
    context.lineJoin = boardArea.temp_context.lineCap = context.lineCap = boardArea.temp_context.lineJoin = 'round';
    context.lineJoin = context.lineCap = 'round';
    context.globalCompositeOperation = 'source-over';
    context.strokeStyle = this.color;
    context.lineWidth = correctWidth(this.width);
    context.beginPath();
    arc(context,this.startPoint.x,this.startPoint.y,this.endPoint.x,this.endPoint.y,ox,oy,initialAngle=0,finalAngle=(2*Math.PI), margin_x,margin_y, scale);
    context.stroke();
}






/* Quadilateral Stroke */

function QuadStroke(startPosition, startTime = Date.now(), width = boardAttributes.width, color = boardAttributes.color) {
    Stroke.call(this, startTime, width, color);
    this.startPoint = startPosition;
    this.endPoint = startPosition;
}
QuadStroke.prototype = Object.create(Stroke.prototype);
QuadStroke.prototype.constructor = QuadStroke;
QuadStroke.prototype.update = function(position) {
    this.endPoint = position;
}
QuadStroke.prototype.mouseLeave = function(position) {
    sessionObject.pages[boardArea.currentPageIndex + boardArea.focus_page].strokeList.push(this);
    boardArea.currentStroke = undefined;
    boardArea.context.globalCompositeOperation = 'source-over';
    boardArea.copyTemp();
}
QuadStroke.prototype.stop = QuadStroke.prototype.mouseLeave;
QuadStroke.prototype.render = function(context, ox, oy , margin_x = boardArea.margin_x, margin_y = boardArea.margin_y,scale = boardArea.scale){
    context.lineJoin = boardArea.temp_context.lineCap = context.lineCap = boardArea.temp_context.lineJoin = 'round';
    context.globalCompositeOperation = 'source-over';
    context.lineJoin = context.lineCap = 'round';
    context.strokeStyle = this.color;
    context.lineWidth = correctWidth(this.width);
    context.beginPath();
    moveTo(context,this.startPoint.x,this.startPoint.y,ox,oy, margin_x,margin_y, scale);
    lineTo(context,this.startPoint.x,this.endPoint.y,ox,oy, margin_x,margin_y, scale);
    lineTo(context,this.endPoint.x,this.endPoint.y,ox,oy, margin_x,margin_y, scale);
    lineTo(context,this.endPoint.x,this.startPoint.y,ox,oy, margin_x,margin_y, scale);
    lineTo(context,this.startPoint.x,this.startPoint.y,ox,oy, margin_x,margin_y, scale);
    context.stroke();
}



function Eraser(startPosition, startTime = Date.now(), width = boardAttributes.width + 25, color = 'white') {
    Stroke.call(this, startTime, width, color);
    this.points = [startPosition];
}

Eraser.prototype = Object.create(Stroke.prototype);
Eraser.prototype.constructor = Eraser;

Eraser.prototype.update = function(position) {
    this.points.push(position);
}
Eraser.prototype.mouseLeave = function(position) {
    sessionObject.pages[boardArea.currentPageIndex + boardArea.focus_page].strokeList.push(this);
    boardArea.currentStroke = undefined;
    // boardArea.context.globalCompositeOperation = 'destination-out';
    boardArea.copyTemp();
}
Eraser.prototype.stop = Eraser.prototype.mouseLeave;

//method for free hand drawing
Eraser.prototype.render = function(context, ox, oy , margin_x = boardArea.margin_x, margin_y = boardArea.margin_y,scale = boardArea.scale) {
    // context.globalCompositeOperation = 'source-atop';
    boardArea.context.globalCompositeOperation = 'destination-out';

    context.lineJoin = boardArea.temp_context.lineCap = context.lineCap = boardArea.temp_context.lineJoin = 'round';
    context.lineJoin = context.lineCap = 'round';
    // context.globalCompositeOperation = "copy";
    // context.strokeStyle = "rgba(255,255,255,0.5)";
    function midPointBtw(p1, p2) {
        return {
            x: p1.x + (p2.x - p1.x) / 2,
            y: p1.y + (p2.y - p1.y) / 2
        };
    }
    var points = this.points;
    if (points.length < 2)
        return;
    var p1 = points[0];
    var p2 = points[1];
    context.strokeStyle = this.color;
    context.lineWidth = correctWidth(this.width);
    // console.log(context.lineWidth)
    context.beginPath();
    moveTo(context, p1.x, p1.y, ox, oy, margin_x,margin_y, scale);
    for (var i = 1, len = points.length; i < len; i++) {
        var midPoint = midPointBtw(p1, p2);
        quadraticCurveTo(context, p1.x, p1.y, midPoint.x, midPoint.y, ox, oy, margin_x,margin_y, scale);
        p1 = points[i];
        p2 = points[i + 1];
    }
    lineTo(context, p1.x, p1.y, ox, oy, margin_x,margin_y, scale);
    context.stroke();
}