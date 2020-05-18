/****This file contains all essential objects and classes related to webboard *****/
/****This file contains all functions related to the tools(pencil,eraser) in webboard *****/


//Page object stores all information about a page(i.e start time, end time and the list of strokes)
function Page() {
    this.strokeList = [];
    this.startTime = Date.now();
    this.endTime = Date.now();
}

//method for clearing the strokes in a page
Page.prototype.clear = function() {
    this.strokeList = [];
};

//Session object stores session details(i.e page objects created during a session and the start,end time of session)
var sessionObject = {
    "sessionStartTime": Date.now(),
    "sessionEndTime": Date.now(),
    "pages": [new Page()],
    "lastSavedOnline": null,
    "lastSavedOffline": null,
};


//Ratio for A4 size paper
// Math.sqrt(2) = 1130 / 800
var ratio = Math.sqrt(2);
var resY = 800;
var resX = 1130;


//boardArea object stres all info about the boardarea :p
var boardArea = {
    canvas: document.getElementById("mycanvas"),
    temp_canvas: document.getElementById("tmp_canvas"),
    pdf_canvas: document.getElementById("pdf_canvas"),
    pdf:false,
    page_extension: 0,
    focus_page: 0,
    prev_mouse_event: undefined,
    currentStroke: undefined,
    strokeType: "PenStroke", //[ PenStroke, LineStroke , CircleStroke, QuadStroke]
    currentPageIndex: 0,
    mouseX: 0,
    mouseY: 0,
    width: 0,
    height: 0,
    mouseDown: false,
    mouseDownX: 0,
    mouseDownY: 0,
    shiftDown: false,
    scale: 0,
    margin_x: 0,
    margin_y: 0,
    DPR: 1,

    //adjusting the size of boardArea according to the device
    size: function() {

        this.DPR = window.devicePixelRatio || 1;
        boardArea.width = document.getElementById("sketch").clientWidth * this.DPR;
        boardArea.height = window.innerHeight * this.DPR;

        //adjusting the main canvas
        this.canvas.width = boardArea.width;
        this.canvas.height = boardArea.height;
        this.canvas.style.width = boardArea.width / this.DPR;
        this.canvas.style.height = boardArea.height / this.DPR;

        //adjusting the temp canvas
        this.temp_canvas.width = boardArea.width;
        this.temp_canvas.height = boardArea.height;
        this.temp_canvas.style.width = boardArea.width / this.DPR;
        this.temp_canvas.style.height = boardArea.height / this.DPR;

        
        // Currently Forcing height to fit screen - necessary for extending page
        // if (boardArea.width / boardArea.height >= ratio) {
            this.scale = boardArea.height / resY;
            this.margin_x = (boardArea.width - boardArea.height * ratio) / 2;
            this.margin_y = 0;
            
            /* } else {
                this.scale = boardArea.width / resX;
                this.margin_y = (boardArea.height - boardArea.width / ratio) / 2;
                this.margin_x = 0;
            }
            console.log("MARGIN" ,this.margin_x , this.margin_y)*/


            //adjusting the pdf canvas
            this.pdf_canvas.width = boardArea.width - 2* this.margin_x;
            this.pdf_canvas.height = boardArea.height;
            this.pdf_canvas.style.width = boardArea.width - 2* this.margin_x/ this.DPR;
            this.pdf_canvas.style.marginLeft = this.margin_x;
            pdfManager.marginLeft = this.margin_x;
            this.pdf_canvas.style.height = boardArea.height / this.DPR;
            // this.pdf_canvas.getContext("2d").fillRect(0, 0, boardArea.width, boardArea.height,"red");

    
    },

    //a function to set up the canvas for use
    setup: function() {
        this.size();
        this.temp_context = this.temp_canvas.getContext("2d");
        this.pdf_context = this.pdf_canvas.getContext("2d");
        this.context = this.canvas.getContext("2d");

        this.mouseDown = false;
        this.shiftDown = false;
        render();
    },

    //rendering the content on resizing the browser
    resize: function() {
        this.size();
        render();
        pdfManager.mountPdf();
    },

    //function for clearing the boardArea
    clear: function() {
        this.context.clearRect(0, 0, boardArea.width, boardArea.height);
        this.temp_context.clearRect(0, 0, boardArea.width, boardArea.height);
    },

    //clearing the main canvas
    clearContext: function(context) {
        context.clearRect(0, 0, boardArea.width, boardArea.height);
    },

    //clearing the temp canvas
    clearTemp: function() {
        this.temp_context.clearRect(0, 0, boardArea.width, boardArea.height);
    },

    //drawing the image on tempcanvas onto main canvas and clearing the tempcanvas
    copyTemp: function() {
        this.context.drawImage(this.temp_canvas, 0, 0);
        this.clearTemp();
    },
};

//the attributes related to the borad off the canvas stored in an object
boardAttributes = {
    width: 1,
    eraseWidth: 30, //width of ink
    color: '#000', //color of ink
    prev_color: '#000',
};


//initializing the board
function init() {
    boardArea.setup();
    setupListeners();
}






//////////////////////    Miscellaneous Functions    ///////////////////////////


//function for erasing the whole canvas
function clearScreen() {

    if (boardArea.page_extension != 0)
        prevPage();

    // setTimeout required because prevPage is not rendered otherwise
    setTimeout(function() {

        swal("This Page will be cleared. The action cannot be undone",{
        dangerMode: true,
        buttons : {
            cancel : true,
            confirm : {
                text: 'Delete'
            }
        }               
        }).then( function(value){
            if(value){
                sessionObject.pages[boardArea.currentPageIndex].clear();
                render(); 
            }
        });
        /*
        if (confirm("This Page will be cleared. The action cannot be undone.")) {
            sessionObject.pages[boardArea.currentPageIndex].clear();
            render();
        }*/
    }, 20);

}


/*
function snackbar() {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    console.log("working");
    // Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
} */



///////////////////////////Functions for changing pages/////////////////////////////////


//going to the next page
function nextPage() {
    // console.log(boardArea.currentPageIndex);

    if (boardArea.page_extension) {
        boardArea.page_extension = 0;
    }
    boardArea.currentPageIndex++;
    if(boardArea.pdf){
        pdfManager.nextPage();
    }
    if (sessionObject.pages.length == boardArea.currentPageIndex) {
        sessionObject.pages.push(new Page());
    }
    render();

}

function PageNo(){
    return boardArea.currentPageIndex;
}

function SessionLenght(){
    return sessionObject.pages.length;
}

//going to the previous page
function prevPage() {

    if (boardArea.page_extension) {
        boardArea.page_extension = 0;
        render();
        return;
    }
    if (boardArea.currentPageIndex) {
        boardArea.currentPageIndex--;
        if(boardArea.pdf){
            pdfManager.prevPage();
        }
        render();
    }
}

function extendPage() {
    if (boardArea.page_extension < 0.85) {
        boardArea.page_extension += 0.1;
        if (boardArea.currentPageIndex + 1 == sessionObject.pages.length) {
            sessionObject.pages.push(new Page());
        }
        render();
    } else {
        // pageSave();
        nextPage();
    }

}
function shrinkPage() {
    if (boardArea.currentPageIndex != 0) {

        if(boardArea.page_extension > 0.15){
            boardArea.page_extension -= 0.1;
            render();
            pageSave();
        }
        
        else if(boardArea.page_extension == 0){
            prevPage();
            boardArea.page_extension = 0.9;
            render();
        }
        else{
            prevPage();            
        }
    }

    if(boardArea.currentPageIndex == 0){
        if(boardArea.page_extension > 0.15){
            boardArea.page_extension -= 0.1;
            render();
            }
            else {
                // pageSave();
                boardArea.page_extension = 0;
                render();
            }   
    }
}

function savePDF(object){

    length = object.pages.length
    var doc = new jsPDF({

        orientation: 'landscape',
        unit: 'pt',
        format: 'a4',
    });
    for(var i=0;i<length;i++){
        var page = object.pages[i];
        var virtualCanvas = document.createElement("canvas");
        var virtualContext = virtualCanvas.getContext('2d');
        virtualCanvas.height = 800;
        virtualCanvas.width = 1130;
        virtualContext.fillStyle = 'white';
        virtualContext.fillRect(0,0,virtualCanvas.width,virtualCanvas.height);
        scale = (resY/virtualCanvas.height);
        margin_x = 0;
        margin_y = 0;
        for (var j = 0; j < page.strokeList.length; j++){
            page.strokeList[j].__proto__ = strokeList[page.strokeList[j].type].prototype;
            page.strokeList[j].render(virtualContext, 0, 0, margin_x, margin_y , scale);
        }
        dataURL = virtualCanvas.toDataURL('image/jpeg', 1);
        doc.addImage(dataURL, 'JPEG', 0, 0);
        if(i != length-1){
            doc.addPage();
        }
    }
    doc.save("download.pdf");
}


function GoInFullscreen(element) {
	if(element.requestFullscreen)
		element.requestFullscreen();
	else if(element.mozRequestFullScreen)
		element.mozRequestFullScreen();
	else if(element.webkitRequestFullscreen)
		element.webkitRequestFullscreen();
	else if(element.msRequestFullscreen)
		element.msRequestFullscreen();
}

function GoOutFullscreen() {
	if(document.exitFullscreen)
		document.exitFullscreen();
	else if(document.mozCancelFullScreen)
		document.mozCancelFullScreen();
	else if(document.webkitExitFullscreen)
		document.webkitExitFullscreen();
	else if(document.msExitFullscreen)
		document.msExitFullscreen();
}

document.addEventListener('keyup', function(event) {
    if(event.keyCode === 70){
        console.log('F');
        GoInFullscreen(document.documentElement);
    }
    if(event.keyCode === 27){
        console.log('esc');
        GoOutFullscreen();
    }
});

