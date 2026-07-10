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

function resetModal() {
    document.getElementById("add-task-name").value = "";
    document.getElementById("add-task-sub").value = "";
    document.getElementById("add-due-date").value = "";
    document.getElementById("add-priority").value = "1";
    document.getElementById("add-do-date").value = "";
    document.getElementById("add-do-time").value = "1";
}

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

const priorityText = { "1":"긴급", "2":"높음", "3":"중간", "4":"보통" };
const priorityClass = { "1":"T_p1", "2":"T_p2", "3":"T_p3", "4":"T_p4" };

const dtimeclass = { "1":"tt1", "2":"tt2", "3":"tt3", "4":"tt4", "5":"tt5", "6":"tt6", "7":"tt7", "8":"tt8", "9":"tt9", "10":"tt10" };

document.getElementById("modal-ok-btn").addEventListener("click", ()=> {    //완료 버튼
    let title = document.getElementById("add-task-name").value;
    let sub = document.getElementById("add-task-sub").value;
    let dueDate = document.getElementById("add-due-date").value;
    let priority = document.getElementById("add-priority").value;
    let doDate = document.getElementById("add-do-date").value;
    let doTimeEl = document.getElementById("add-do-time");
    let doTime = doTimeEl.value;
    let doTimeText = doTimeEl.options[doTimeEl.selectedIndex].text;
    

    // 새 행 만들기
    let newRow = document.createElement("div");
    newRow.className = "table-row";
    newRow.innerHTML = `
        <div class="col-fixed">
            <div class="status-btn">
                <img src="./Asset/status/sta0.png" class="status-icon">
            </div>
            <div class="task-info">
                <span class="task-title">${title}</span>
                <span class="task-sub">${sub}</span>
            </div>
        </div>
        <div class="scroll-area">
            <span class="col">${dueDate}</span>
            <span class="col"><span class="tagg ${priorityClass[priority]}">${priorityText[priority]}</span></span>
            <span class="col">${doDate}</span>
            <span class="col"><span class="tagg ${dtimeclass[doTime]}">${doTimeText}</span></span>
        </div>
    `;

    let addBtn = document.getElementById("add-btn-" + add_list);
    addBtn.parentNode.insertBefore(newRow, addBtn);

    addBtn.parentNode.insertBefore(newRow, addBtn);
    syncScrollAreas();

    modal_overlay.classList.remove("open");
    modal_content.classList.remove("open");
    resetModal()
});


//스크롤 동기화
const scrollAreas = document.querySelectorAll(".scroll-area");
let syncing = false;

// 스크롤 동기화 함수
function syncScrollAreas() {
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
}

syncScrollAreas();

//과제 추가 버튼
let add_sh_btn = document.getElementById("add-btn-sh");
let add_hi_btn = document.getElementById("add-btn-hi");
let add_hg_btn = document.getElementById("add-btn-hg");

