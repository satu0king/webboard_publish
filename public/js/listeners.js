/*** This file contains all the js event listeners and functions for getting the coordinates of the events ***/



/////////////////////////    For Non-Touch Devices     //////////////////////////////

//stores the location of mouseclick in the start location variable
function dragStartMouse(event) {
    // console.time("drag mouse");
    // console.log("mouse drag start!!");
    boardArea.mouseDown = true;
    var position = getpositionmouse(event);
    boardArea.mouseDownX = position.x;
    boardArea.mouseDownY = position.y;
    boardArea.mouseX = position.x;
    boardArea.mouseY = position.y;
    boardArea.focus_page = getFocusPage(position);
    boardArea.currentStroke = new strokeList[boardArea.strokeType](resolvePosition(position));
}


//draws the line as the mouse gets dragged
function dragMouse(event) {
    // console.log("mouse drag !!");
    var position = getpositionmouse(event);
    boardArea.mouseX = position.x;
    boardArea.mouseY = position.y;
    if (boardArea.currentStroke) {
        if (getFocusPage(position) != boardArea.focus_page) {
            // This may need to be refactored, should the current stroke decide what to do ?
            boardArea.currentStroke.stop(resolvePosition(position));
            dragStartMouse(event);
            return;
        }
        boardArea.currentStroke.update(resolvePosition(position));
        boardArea.clearTemp();
        boardArea.currentStroke.render(boardArea.temp_context, 0, yOffset());
    }
}

//stops the drawing when the mouse is lifted
function dragStopMouse(event) {
    // console.log("mouse drag stop!!");
    boardArea.mouseDown = false;
    var position = getpositionmouse(event);
    boardArea.mouseX = position.x;
    boardArea.mouseY = position.y;

    if (boardArea.currentStroke) {
        boardArea.currentStroke.update(resolvePosition(position));
        boardArea.clearTemp();
        // if(boardArea.strokeType == "PenStroke" || boardArea.strokeType == "Eraser"){
            // boardArea.currentStroke.optimize();
        // }
        boardArea.currentStroke.render(boardArea.temp_context, 0, yOffset());
        boardArea.currentStroke.mouseLeave(resolvePosition(position));
    }
    // console.timeEnd("drag mouse");
}


/////////////////////////    For Touch Devices     //////////////////////////////

//stores the location of mouseclick in the start location variable
function dragStartTouch(event) {
    // console.log("touch start !!");
    // console.time("touch drag");
    boardArea.mouseDown = true;
    var position = getpositiontouch(event);
    boardArea.mouseDownX = position.x;
    boardArea.mouseDownY = position.y;
    boardArea.mouseX = position.x;
    boardArea.mouseY = position.y;
    boardArea.focus_page = getFocusPage(position);
    boardArea.currentStroke = new strokeList[boardArea.strokeType](resolvePosition(position));
    console.log("wazzap");
    event.preventDefault();
}
//draws the line as the mouse gets dragged
function dragTouch(event) {
    // console.log("touch drag!!");
    var position = getpositiontouch(event);
    boardArea.mouseX = position.x;
    boardArea.mouseY = position.y;
    if (boardArea.currentStroke) {
        if (getFocusPage(position) != boardArea.focus_page) {
            // This may need to be refactored, should the current stroke decide what to do ?
            boardArea.currentStroke.stop(resolvePosition(position));
            dragStartMouse(event);
            return;
        }
        boardArea.currentStroke.update(resolvePosition(position));
        boardArea.clearTemp();
        boardArea.currentStroke.render(boardArea.temp_context, 0, yOffset());
    }
    // console.timeEnd("touch drag");
    event.preventDefault();
}
//stops the drawing when the mouse is lifted
function dragStopTouch(event) {
    // console.log("touch drag stop!!");
    boardArea.mouseDown = false;
    // var position = getpositiontouch(event);
    // boardArea.mouseX = position.x;
    // boardArea.mouseY = position.y;
    var position={x:boardArea.mouseX,y:boardArea.mouseY};

    if (boardArea.currentStroke) {
        boardArea.currentStroke.update(resolvePosition(position));
        boardArea.clearTemp();
        if(boardArea.strokeType == "PenStroke" || boardArea.strokeType == "Eraser"){
            boardArea.currentStroke.optimize();
        }
        boardArea.currentStroke.render(boardArea.temp_context, 0, yOffset());
        boardArea.currentStroke.mouseLeave(resolvePosition(position));
    }
    event.preventDefault();
}


//////////////////////////////////////////////////////////////////////////////////



//adding all of them to the html on load
window.addEventListener('load', init);

window.addEventListener('resize', boardArea.resize.bind(boardArea));

function setupListeners() {
    //touch events
    boardArea.temp_canvas.addEventListener('touchstart', dragStartTouch);
    boardArea.temp_canvas.addEventListener('touchend', dragStopTouch);
    boardArea.temp_canvas.addEventListener('touchmove', dragTouch);
    //mouse events
    boardArea.temp_canvas.addEventListener('mousedown', dragStartMouse);
    boardArea.temp_canvas.addEventListener('mouseup', dragStopMouse);
    boardArea.temp_canvas.addEventListener('mouseleave', dragStopMouse);
    boardArea.temp_canvas.addEventListener('mousemove', dragMouse);
//    PaperScope.setup('tmp_canvas');
}

//function for getting the location of mouse pointer
function getpositionmouse(event) {
    var x = Number((((event.clientX - boardArea.canvas.getBoundingClientRect().left) * boardArea.DPR - boardArea.margin_x) / boardArea.scale).toFixed(2));
    var y = Number((((event.clientY - boardArea.canvas.getBoundingClientRect().top) * boardArea.DPR - boardArea.margin_y) / boardArea.scale).toFixed(2));
    // console.log((event.clientX - boardArea.canvas.getBoundingClientRect().left - boardArea.margin_x)*boardArea.DPR)
    // console.log(x + ' : ' + y);
    return {
        x: x,
        y: y
    };
}

//function for getting the location of touch
function getpositiontouch(event) {
    if (event.touches) {
        if (event.touches.length == 1) { // Only deal with one finger
            var touch = event.touches[0]; // Get the information for finger #1
//            touchX = touch.pageX - touch.target.offsetLeft;
            var x = Number((((touch.pageX - boardArea.canvas.getBoundingClientRect().left) * boardArea.DPR - boardArea.margin_x) / boardArea.scale).toFixed(2));
            var y = Number((((touch.pageY - boardArea.canvas.getBoundingClientRect().top) * boardArea.DPR - boardArea.margin_y) / boardArea.scale).toFixed(2));
//            touchY = touch.pageY - touch.target.offsetTop;
        }
    }
    return {
        x: x,
        y: y
    };
}
function getFocusPage(pos) {
    if (pos.y > (1 - boardArea.page_extension) * resY)
        return 1;
    return 0;
}

function yOffset() {
    if (boardArea.focus_page) {
        return (1 - boardArea.page_extension) * boardArea.height;
    } else {
        return -boardArea.page_extension * boardArea.height;
    }
}

function resolvePosition(pos) {
    if (boardArea.focus_page)
        return {
            x: pos.x,
            y: pos.y - (1 - boardArea.page_extension) * resY
        };
    return {
        x: pos.x,
        y: pos.y + boardArea.page_extension * resY
    };
}


//listeners for the events related to toolbar

$(document).ready(function() {

    //setting the stroke type
    $('.stroke').click(function() {

        $('.stroke').removeClass('is-active');
        $('#tmp_canvas').css('cursor', 'url(../css/dot.cur), auto');
        $(this).addClass('is-active');
            if(boardArea.strokeType == 'Eraser' && this.id == "PenStroke"){
                boardAttributes.width = boardAttributes.tempWidth;
                $('.size-selector').removeClass('is-active');
                var list = document.querySelectorAll('.size-selector')
                list.forEach(function(elem){
                    if(elem.getAttribute('data-size') == (boardAttributes.width).toString()){
                        elem.classList.toggle('is-active');
                    }
                });
            }
            else if(this.id =='Eraser'){
                boardAttributes.tempWidth = boardAttributes.width;
            }
        boardArea.strokeType = this.id;

    });

    //setting the stroke color
    $('.color-selector').click(function() {
        var color = $(this).css('background-color');
        $('.color-selector').removeClass('is-active');
        $(this).addClass('is-active');
        boardAttributes.color = color;
    });

    //setting the stroke width
    $('.size-selector').click(function() {
        width = $(this).data().size;
        $('.size-selector').removeClass('is-active');
        $(this).addClass('is-active');
        if( boardArea.strokeType == "Eraser"){
            boardAttributes.tempWidth = boardAttributes.width;
            if($(this).data("size") == 1)
                $('#tmp_canvas').css('cursor', `url("../css/cursor-size1.png") 13 13, auto`);
            if($(this).data("size") == "5")
                $('#tmp_canvas').css('cursor', `url("../css/cursor-size2.png") 15 15, auto`);
            if($(this).data("size") == "16")
                $('#tmp_canvas').css('cursor', `url("../css/cursor-size3.png") 20.5 20.5, auto`);
            if($(this).data("size") == "25")
                $('#tmp_canvas').css('cursor', `url("../css/cursor.png") 23 23, auto`);
        }
        boardAttributes.width = width;
    });


    $('#Eraser').click(function(){
        $('#tmp_canvas').css('cursor', `url("../css/cursor-size1.png") 13 13, auto`);
    });
   
});

$(document).on("load", function(){
    if(localStorage.getItem("recoverLogin")!== null) {
        $('#saveOnline').trigger('click');
        console.log("work1");
    }
});