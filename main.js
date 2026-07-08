//사이드바 열고 닫기
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


//스크롤 동기화
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

//과제 추가 버튼
let add_sh_btn = document.getElementById("add-btn-sh");
let add_hi_btn = document.getElementById("add-btn-hi");
let add_hg_btn = document.getElementById("add-btn-hg");

