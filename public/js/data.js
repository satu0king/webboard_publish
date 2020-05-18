// As of now, the data is just being stringified.
// Maybe it .optimize should be called on all strokes?
// JS string compression has to be added, otherwise file size is very big

// Further, function has to check offline data date and online data date, and see which one is newer.
// If online data is newer, load that. Otherwise prompt the user if they want to recover their offline data. Or maybe just load without asking?


// Prototype function to generate save data.
// There has to be 2 fns, one for offline, one for online
function sessionSave() {
    if (localStorage.getItem("recoverLogin") && sessionObject === localStorage.getItem("recoverLogin")) {
        data = JSON.parse(localStorage.getItem("recoverLogin"));
    } else {
        data = sessionObject;
    }
    console.log("save invoke");
    data.lastSavedOnline = Date.now();
    data.lastSavedOffline = Date.now();
    return JSON.stringify(data);
}
var count = 0;
function pageSave() {
    var path = window.location.pathname;
    var id = path.substring(path.lastIndexOf('/') + 1);
    if (id !== 'board') {
        var data = JSON.parse(JSON.stringify(sessionObject));
        var page = sessionObject.pages[boardArea.currentPageIndex];
        data.pages = [];
        data.pages.push(page);
        var page_id = boardArea.currentPageIndex;
        data.lastSavedOnline = Date.now();
        data.lastSavedOffline = Date.now();
        var card = null;
        if (page_id === 0) {
            card = generateCardImage(JSON.stringify(data));
        }
        data = JSON.stringify(data);
        $.ajax({
            type: 'POST',
            url: '/board/' + id + '/' + page_id,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
            },
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            data: {
                "id": id,
                "data": data,
                "image": card,
            },
        }).fail(function () {
            count++;
            console.log("failed, retrying");
            if (count <= 2) {
                console.log("failed, retry");
                save(2);
            }
            else {
                console.log('failed to save page');
                localStorage.setItem("failedSave", sessionSave());
                count = 0;
            }
        })
            .done(function () {
                if (localStorage.getItem("failedSave")) {
                    localStorage.removeItem("failedSave");
                }
            });
    }
    console.log("page invoked");
}
//function to get the image of first page of session
function generateCardImage(object) {
    var jsonData = JSON.parse(object);
    var firstPage = jsonData.pages[0];
    var virtualCanvas = document.createElement("canvas");
    var virtualContext = virtualCanvas.getContext('2d');
    virtualCanvas.height = 800;
    virtualCanvas.width = 1130;
    for (var i = 0; i < firstPage.strokeList.length; i++) {
        firstPage.strokeList[i].__proto__ = strokeList[firstPage.strokeList[i].type].prototype;
        firstPage.strokeList[i].render(virtualContext, 0, 0, 0, 0);
    }
    var imageURL = virtualCanvas.toDataURL("img/jpeg", 1);
    return imageURL;
}

function pdfSave() {
    var data = new FormData();
    if ($(this).prop('files').length > 0) {
        file = $(this).prop('files')[0];
        data.append("pdf", file);
    }
    var path = window.location.pathname;
    var id = path.substring(path.lastIndexOf('/') + 1);
    if (userSignedIn && id !== 'board') {
        $.ajax({
            type: 'POST',
            url: '/board/' + id + '/' + 'pdf',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
            },
            data: {
                "data": data
            },
            contentType: false,
            processData: false
        }).done(function (res) {
            console.log(res);
        }).fail(function (err) {
            console.log(err);
        });
    }
}

//function for saving the sessionObject to the server
function save(ida = 1) {
    var data = sessionSave();
    var card = generateCardImage(data);
    // console.log(data.length);
    var path = window.location.pathname;
    var id = path.substring(path.lastIndexOf('/') + 1);
    document.getElementById("save").style.visibility = "visible";
    if (!userSignedIn) {
        localStorage.setItem("recoverLogin", data);
        swal("You need to Log in", {
            button: {
                text: "Login"
            }
        }).then((value) => {
            if (value) {
                window.location.href = '/users/sign_in';
            }
        });
    }
    else if (id === 'board' && userSignedIn) {
        console.log("invoked");
        var form = $("<form/>", {
            action: '/save',
            method: "post"
        });
        form.append(
            $("<input>", {
                type: 'hidden',
                name: 'authenticity_token',
                value: $('meta[name="csrf-token"]').attr('content')
            })
        );
        form.append(
            $("<input>", {
                type: 'text',
                name: 'data',
                value: data
            })
        );
        form.append(
            $("<input>", {
                type: 'text',
                name: 'image',
                value: card
            })
        );

        $('body').append(form);
        // console.log(localStorage.getItem("recoverLogin"));
        localStorage.removeItem("recoverLogin");
        if (localStorage.getItem("failedSave")) {
            localStorage.removeItem("failedSave");
        }
        form.submit();
    }
    else {
        $.ajax({
            type: 'POST',
            url: '/board/' + id,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
            },
            scriptCharset: 'utf-8',
            data: {
                "id": id,
                "data": data,
            },
            success: function () {
                $.ajax({
                    type: 'POST',
                    url: '/board/' + id + '/card',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
                    },
                    scriptCharset: 'base64',
                    data: {
                        "id": id,
                        "image": card,
                    },
                });
            }
        }).done(function () {
            console.log('saved');
            if (ida == 1) {
                swal({
                    icon: "success",
                    text: "Your Project has been Saved Online",
                    timer: 1500,
                    button: false,
                });
            }
            if (localStorage.getItem("failedSave")) {
                localStorage.removeItem("failedSave");
            }
            document.getElementById("save").style.visibility = "hidden";
        })
            .fail(function () {
                console.log('failed to save');
                if (ida == 1) {
                    swal({
                        icon: "error",
                        text: "There were some errors with Saving the Project",
                        timer: 1500,
                        button: false,
                    });
                    localStorage.setItem("failedSave", [id, data]);
                    // status = false;
                }
            });
    }
}


// Prototype function to load saved data.
// data is in should be in string format
function sessionLoad(data, url) {
    if (url !== "") {
        boardArea.pdf = true;
        pdfManager.initURL(url);
        console.log("pdf there");
    }
    data = JSON.parse(data);
    if (localStorage.getItem("recoverLogin")) {
        var path = window.location.pathname;
        if (path.substring(path.lastIndexOf('/') + 1) === 'board') {
            data = JSON.parse(localStorage.getItem("recoverLogin"));
        }
    }
    if (localStorage.getItem("failedSave")) {
        id = localStorage.getItem("failedSave").substring(0, localStorage.getItem("failedSave").indexOf(","));
        var path = window.location.pathname;
        if (id === path.substring(path.lastIndexOf('/') + 1) || path.substring(path.lastIndexOf('/') + 1) === 'board') {
            data = localStorage.getItem("failedSave").substring(localStorage.getItem("failedSave").indexOf(",") + 1);
            data = JSON.parse(data);
        }
    }

    data.__proto__ = sessionObject.prototype;
    for (var i = 0; i < data.pages.length; i++) {
        data.pages[i].__proto__ = Page.prototype;
        for (var j = 0; j < data.pages[i].strokeList.length; j++)
            data.pages[i].strokeList[j].__proto__ = strokeList[data.pages[i].strokeList[j].type].prototype;
    }

    boardArea.currentPageIndex = 0;
    boardArea.focus_page = 0;
    sessionObject = data;
    render();
    console.log(animationObject);
}