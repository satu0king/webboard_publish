

function generateStrokeList() {
    let strokeList = [];
    let pages = sessionObject.pages;
    for (let page_id = 0; page_id < pages.length; page_id++) {
        let page = pages[page_id];
        for (let stroke_id = 0; stroke_id < page.strokeList.length; stroke_id++) {
            let stroke = {
                page_id: page_id,
                stroke_id: stroke_id,
                time: page.strokeList[stroke_id].startTime
            }
            strokeList.push(stroke);
        }
    }
    strokeList.sort(function (a, b) {
        return a.time < b.time;
    })

    return strokeList;

}

function renderHandler(index) {
    let strokeObject = animationObject.strokeList[index];
    renderStateObject(strokeObject);
    animationObject.renderHandler = undefined;
    if (index + 1 < animationObject.strokeList.length) {
        let handler = renderHandler.bind(null, index + 1);
        let nextStrokeObject = animationObject.strokeList[index + 1];
        let speed = parseInt(document.getElementById("Speed").value);
        animationObject.renderHandler =
            setTimeout(handler,
                Math.max(1, Math.min(1000, (nextStrokeObject.time - strokeObject.time) / speed)));
    }
    document.getElementById("animationSlider").value = index;
}

var animationObject = {
    strokeList: [],
    setup: () => {
        console.log("Setup() ");
        animationObject.strokeList = generateStrokeList();
        document.getElementById("animationSlider").max = animationObject.strokeList.length - 1;
    },
    renderHandler: undefined,
    animationReset: false,
    start: () => {
        let index = parseInt(document.getElementById("animationSlider").value);
        let handler = renderHandler.bind(null, index);
        animationObject.animationReset = true;
        clearInterval( animationObject.renderHandler);
        animationObject.renderHandler = setTimeout(handler, 0);
    },
    pause: () => {
        clearInterval( animationObject.renderHandler);
    },
    reset: () => {
        clearInterval( animationObject.renderHandler);
        render();
    },
    slide: (position) => {
        clearInterval(animationObject.renderHandler);
        animationObject.animationReset = true;
        let index = parseInt(document.getElementById("animationSlider").value);
        let strokeObject = animationObject.strokeList[index];
        renderStateObject(strokeObject);
    }
}



function renderStateObject(strokeObject) {

    let page_id = strokeObject.page_id;
    let stroke_id = strokeObject.stroke_id;
    let page = sessionObject.pages[page_id];
 


    var context = boardArea.context;
    context.globalCompositeOperation = 'source-over';




    if (boardArea.currentPageIndex != page_id || animationObject.animationReset) {
        animationObject.animationReset = false;
        boardArea.currentPageIndex = page_id;
        boardArea.clear();


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
        
        

        for (var i = 0; i < stroke_id; i++)
            page.strokeList[i].render(context, 0, -boardArea.page_extension * boardArea.height);

        setPageNumber();
    }


    page.strokeList[stroke_id].render(context, 0, -boardArea.page_extension * boardArea.height);
    setCurrentTime(strokeObject.time);

}




//Function for setting the page number bar at the bottom right corner of the page
function setCurrentTime(time) {
    var stringResult = formatDate(new Date(time), "d MMM yyyy - h:mm:sstt");
    document.querySelector('.currentTime').innerHTML = stringResult;
}

function sessionLoad(data, url) {
    // data = LZString.decompressFromUTF16(data);
    if (url !== "") {
        console.log("loolo");
        boardArea.pdf = true;
        pdfManager.initURL(url);
        console.log("pdf there");
    }
    data = JSON.parse(data);
    data.__proto__ = sessionObject.prototype;
    for (var i = 0; i < data.pages.length; i++) {
        data.pages[i].__proto__ = Page.prototype;
        for (var j = 0; j < data.pages[i].strokeList.length; j++)
            data.pages[i].strokeList[j].__proto__ = strokeList[data.pages[i].strokeList[j].type].prototype;
    }

    boardArea.currentPageIndex = 0;
    boardArea.focus_page = 0;
    sessionObject = data;
    animationObject.setup();
    render();

}


function formatDate(date, format, utc) {
    var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    function ii(i, len) {
        var s = i + "";
        len = len || 2;
        while (s.length < len) s = "0" + s;
        return s;
    }

    var y = utc ? date.getUTCFullYear() : date.getFullYear();
    format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
    format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
    format = format.replace(/(^|[^\\])y/g, "$1" + y);

    var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
    format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
    format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
    format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
    format = format.replace(/(^|[^\\])M/g, "$1" + M);

    var d = utc ? date.getUTCDate() : date.getDate();
    format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
    format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
    format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
    format = format.replace(/(^|[^\\])d/g, "$1" + d);

    var H = utc ? date.getUTCHours() : date.getHours();
    format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
    format = format.replace(/(^|[^\\])H/g, "$1" + H);

    var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
    format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
    format = format.replace(/(^|[^\\])h/g, "$1" + h);

    var m = utc ? date.getUTCMinutes() : date.getMinutes();
    format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
    format = format.replace(/(^|[^\\])m/g, "$1" + m);

    var s = utc ? date.getUTCSeconds() : date.getSeconds();
    format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
    format = format.replace(/(^|[^\\])s/g, "$1" + s);

    var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
    format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])f/g, "$1" + f);

    var T = H < 12 ? "AM" : "PM";
    format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
    format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

    var t = T.toLowerCase();
    format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
    format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

    var tz = -date.getTimezoneOffset();
    var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
    if (!utc) {
        tz = Math.abs(tz);
        var tzHrs = Math.floor(tz / 60);
        var tzMin = tz % 60;
        K += ii(tzHrs) + ":" + ii(tzMin);
    }
    format = format.replace(/(^|[^\\])K/g, "$1" + K);

    var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
    format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
    format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

    format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
    format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

    format = format.replace(/\\(.)/g, "$1");

    return format;
};