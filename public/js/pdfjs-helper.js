//   function takeInput(){
//     pdfManager.init();
//     pdfManager.createBlob();
// }
var path = window.location.pathname;
var path_last = path.substring(path.lastIndexOf('/') + 1);
if(path_last !== "view"){
document.getElementById("fileInput").onchange = function () {
  if (pdfManager.init()) {
    pdfManager.createBlob();
    boardArea.pdf = true;
  } else {
    var form = new FormData();
    var file = document.getElementById("fileInput").files[0];
    form.append("file", file);
    form.append("filename", file.name);

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://webboard.iiitb.ac.in/pdf_convert",
      "method": "POST",
      "headers": {
        "cache-control": "no-cache",
        "Postman-Token": "9ece9315-d970-4a2b-9271-6d44e3632884"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }


    $.ajax(settings).done(function (response) {

      console.log(response);

      function base64ToArrayBuffer(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
      }
      pdfManager.initURL(base64ToArrayBuffer(response));
      var a = new Blob([pdfManager.file],{type:'application/pdf'});
      var pdf = new File([a], "dummy");
      // var pdf_url=window.URL.createObjectURL(a);
      console.log("invoked3000");
      var path = window.location.pathname;
      var id = path.substring(path.lastIndexOf('/')+1);
      var data = new FormData();
      data.append("pdf", pdf);
      if(userSignedIn && id !== 'board')
      $.ajax({
        type: 'POST',
        url: '/board/'+id+'/'+'pdf',
        beforeSend: function(xhr) {
            xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
        },
        data : data,
        contentType : false,
        processData : false,
        success : function() {
            console.log("pdf success");
        }
    }).fail(function(err) {
        console.log(err);
    });
    });
  }
}
}

var pdfManager = {
  inputElement: null,
  ratio: Math.sqrt(2),
  marginLeft:null,
  file: null,
  pdfObj: null,
  fileReader: null,
  pageNumber: 1,
  totalPages: null,
  scale: 1,
  canvas: document.getElementById('pdf_canvas'),
  context: document.getElementById('pdf_canvas').getContext('2d'),
  centered: false,

  init: function () {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/js/pdf.worker.min.js';
    // if(!userSignedIn)
    this.inputElement = document.getElementById("fileInput");
    this.file = this.inputElement.files[0];
    pdfManager.marginLeft = parseInt(this.canvas.style.marginLeft.slice(0, -2));
    // console.log(this.file.type);
    if (this.file.type == "application/pdf") {
      return true;
    } else {
      return false;
    }
    // console.log("Initialized");
  },
  initURL: function (url) {
    // console.log("pdf invoke");
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/js/pdf.worker.min.js';
    this.file = url;
    pdfManager.marginLeft = parseInt(this.canvas.style.marginLeft.slice(0, -2));
    var loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(function (pdf) {
      // console.log("yoyo",pdf);
      pdfManager.pdfObj = pdf;
      pdfManager.totalPages = pdf.numPages;
      pdf.getPage(1).then(function (page) {
        page.render({
          canvasContext: pdfManager.context,
          viewport: pdfManager.setScale(page)
        });
      });
    });
  },
  setScale: function (page) {
    var scale = null;
    // if (boardArea.width / boardArea.height >= ratio) {
    //   this.scale = boardArea.height / resY;
    //   this.margin_x = (boardArea.width - boardArea.height * ratio) / 2;
    //   this.margin_y = 0;

    //   } else {
    //       this.scale = boardArea.width / resX;
    //       this.margin_y = (boardArea.height - boardArea.width / ratio) / 2;
    //       this.margin_x = 0;
    //   }
    //     //adjusting the pdf canvas
    //     this.pdf_canvas.width = boardArea.width - 2* this.margin_x;
    //     this.pdf_canvas.height = boardArea.height;
    //     this.pdf_canvas.style.width = boardArea.width - 2* this.margin_x/ this.DPR;
    //     this.pdf_canvas.style.marginLeft = this.margin_x;
    //     this.pdf_canvas.style.height = boardArea.height / this.DPR;
    if (page) {
      var viewscale = page.getViewport(1);
      // console.log(page.getViewport(1),page.getViewport(0.5))
      if (viewscale.height > viewscale.width) {
        scale = boardArea.canvas.height / viewscale.height;
        if (!this.centered) {
          var margin =  (this.canvas.width - viewscale.width * scale) / 2;
          this.canvas.style.marginLeft = pdfManager.marginLeft + margin;
          this.centered = true;
        }
      } else {
        this.canvas.style.marginLeft = pdfManager.marginLeft;
        scale = pdfManager.canvas.width / viewscale.width;
      }
      return page.getViewport(scale);
    }
  },
  createBlob: function () {
    // var arr;
    this.fileReader = new FileReader();
    this.fileReader.readAsArrayBuffer(this.file);
    this.fileReader.onload = function () {
      var fileName = new Uint8Array(this.result);
      var loadingTask = pdfjsLib.getDocument(fileName);
      loadingTask.promise.then(function (pdf) {
        pdfManager.pdfObj = pdf;
        pdfManager.totalPages = pdf.numPages;
        pdf.getPage(1).then(function (page) {
          page.render({
            canvasContext: pdfManager.context,
            viewport: pdfManager.setScale(page)
          });
        });
      });
    }
  },
  renderPdf: function (pageNum) {
    this.pdfObj.getPage(pageNum).then(function (page) {
      // var scale = 1;
      // console.log("heyooo",page.getViewport(1));
      // var viewport = page.getViewport(scale);
      // console.log("viewport",viewport,page);
      page.render({
        canvasContext: pdfManager.context,
        viewport: pdfManager.setScale(page)
      });
    });
  },
  mountPdf: function () {
    if (this.pageNumber > this.totalPages) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    } else {
      this.renderPdf(this.pageNumber);
    }
  },
  nextPage: function () {
    this.pageNumber++;
    this.mountPdf()
  },
  prevPage: function () {
    this.pageNumber--;
    this.mountPdf()
  }
}