let sidebar = document.getElementById("sidebar");
let overlay = document.getElementById("overlay");
let hamburger = document.getElementById("hamburger");

hamburger.addEventListener("click", function(){
    sidebar.classList.toggle("open");
    overlay.classList.toggle("open");
});