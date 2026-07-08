let sidebar = document.getElementById("sidebar");
let overlay = document.getElementById("overlay");
let hamburger = document.getElementById("hamburger");

hamburger.addEventListener("click", ()=> {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("open");
});

overlay.addEventListener("click", ()=> {
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
});


// 스크롤 동기화
const scrollAreas = document.querySelectorAll(".scroll-area");
let syncing = false;

scrollAreas.forEach(area => {
    area.addEventListener("scroll", () => {
        if (syncing) return;
        syncing = true;
        scrollAreas.forEach(other => {
            if (other !== area) {
                other.scrollLeft = area.scrollLeft;
            }
        });
        syncing = false;
    });
});