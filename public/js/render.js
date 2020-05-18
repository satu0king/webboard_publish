//Function for setting the page number bar at the bottom right corner of the page
function setPageNumber(){
    var totalPages = sessionObject.pages.length;
    var currentPage = boardArea.currentPageIndex + 1;
    var stringResult =  `Page ${currentPage} of ${totalPages}`;
    document.querySelector('.page').innerHTML = stringResult;
}

//function for rendering a page from the sessionObject
function render() {
    boardArea.clear();

    var context = boardArea.context;
    context.globalCompositeOperation = 'source-over';
    if (boardArea.margin_x) {

        context.lineWidth = correctWidth(1);
        context.strokeStyle = 'rgba(0,0,0,0.2)';
        context.lineWidth = '5';
        context.beginPath();
        moveTo(context, 0, 0);
        lineTo(context, 0, resY);
        context.stroke();

        context.beginPath();
        moveTo(context, resX, 0);
        lineTo(context, resX, resY);
        context.stroke();
    } else {
        context.lineWidth = correctWidth(1);
        context.strokeStyle = "black";

        context.beginPath();
        moveTo(context, 0, 0);
        lineTo(context, resX, 0);
        context.stroke();

        context.beginPath();
        moveTo(context, 0, resY);
        lineTo(context, resX, resY);
        context.stroke();
    }
    var currentPage = sessionObject.pages[boardArea.currentPageIndex]
    for (var i = 0; i < currentPage.strokeList.length; i++)
        currentPage.strokeList[i].render(context, 0, -boardArea.page_extension * boardArea.height );
    if (boardArea.page_extension) {

        context.lineWidth = correctWidth(1);
        context.strokeStyle = "black";

        context.beginPath();
        moveTo(context, 0, 0, 0, (1 - boardArea.page_extension) * boardArea.height );
        lineTo(context, resX, 0, 0, (1 - boardArea.page_extension) * boardArea.height );
        context.stroke();



        var currentPage = sessionObject.pages[boardArea.currentPageIndex + 1]
        for (var i = 0; i < currentPage.strokeList.length; i++)
            currentPage.strokeList[i].render(context, 0, (1 - boardArea.page_extension) * boardArea.height );
    }
    setPageNumber();
}



