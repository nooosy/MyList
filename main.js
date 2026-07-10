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

//모달
let add_list = "sh";

let add_new_sh = document.getElementById("add-btn-sh");
let add_new_hi = document.getElementById("add-btn-hi");
let add_new_hg = document.getElementById("add-btn-hg");

let modal_content = document.getElementById("modal-content");
let modal_overlay = document.getElementById("add-task-modal");

add_new_sh.addEventListener("click", ()=> {
    add_list = "sh";
    modal_content.classList.toggle("open");
    modal_overlay.classList.toggle("open");
});

add_new_hi.addEventListener("click", ()=> {
    add_list = "hi";
    modal_content.classList.toggle("open");
    modal_overlay.classList.toggle("open");
});

add_new_hg.addEventListener("click", ()=> {
    add_list = "hg";
    modal_content.classList.toggle("open");
    modal_overlay.classList.toggle("open");
});

modal_content.addEventListener("click", (e)=> {
    e.stopPropagation();
});

modal_overlay.addEventListener("click", ()=> {
    modal_content.classList.remove("open");
    modal_overlay.classList.remove("open");
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

