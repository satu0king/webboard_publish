var myVar;

function loader() {
    myVar = setTimeout(showPage, 0);
}
function showPage() {
  document.getElementById("loader").style.display = "none";
  document.querySelector(".page").style.display = "block";
  // document.getElementById("minibar").style.display = "flex";
}
