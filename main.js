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


let what_modal = "add";

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

add_new_sh.addEventListener("click", (e)=> {
    e.stopPropagation();
    
    add_list = "sh";
    what_modal = "add";
    modal_content.classList.add("open");
    modal_overlay.classList.add("open");
    requestAnimationFrame(() => {
            modal_content.scrollTop = 0;
    });
});

add_new_hi.addEventListener("click", (e)=> {
    e.stopPropagation();
    
    add_list = "hi";
    what_modal = "add";
    modal_content.classList.add("open");
    modal_overlay.classList.add("open");
    requestAnimationFrame(() => {
            modal_content.scrollTop = 0;
    });
});

add_new_hg.addEventListener("click", (e)=> {
    e.stopPropagation();
    
    add_list = "hg";
    what_modal = "add";
    modal_content.classList.add("open");
    modal_overlay.classList.add("open");
    requestAnimationFrame(() => {
            modal_content.scrollTop = 0;
    });
});

modal_content.addEventListener("click", (e)=> {
    e.stopPropagation();
});

modal_overlay.addEventListener("click", ()=> {
    modal_content.classList.remove("open");
    modal_overlay.classList.remove("open");
    document.getElementById("modal-header").style.display = "none";
    if (what_modal === "edit") {
        resetModal();
        currentEditRow = null;
    }
    what_modal = "add";
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
    
    // 수정 모드
    if (what_modal === "edit" && currentEditRow) {
        currentEditRow.querySelector(".task-title").textContent = title;
        currentEditRow.querySelector(".task-sub").textContent = sub;
        
        let cols = currentEditRow.querySelectorAll(".col");
        cols[0].textContent = dueDate;
        cols[1].innerHTML = `<span class="tagg ${priorityClass[priority]}">${priorityText[priority]}</span>`;
        cols[2].textContent = doDate;
        cols[3].innerHTML = `<span class="tagg ${dtimeclass[doTime]}">${doTimeText}</span>`;
        document.getElementById("modal-header").style.display = "block";
    } 
    // 추가 모드
    else {
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

        let newScrollArea = newRow.querySelector(".scroll-area");
        if (newScrollArea) {
            newScrollArea.addEventListener("scroll", () => {
                if (syncing) return;
                syncing = true;
                document.querySelectorAll(".scroll-area").forEach(other => {
                    if (other !== newScrollArea) {
                        other.scrollLeft = newScrollArea.scrollLeft;
                    }
                });
                syncing = false;
            });
        }
    }

    modal_overlay.classList.remove("open");
    modal_content.classList.remove("open");
    resetModal();
    currentEditRow = null;
    what_modal = "add";

    let addBtn = document.getElementById("add-btn-" + add_list);
    addBtn.parentNode.insertBefore(newRow, addBtn);
    syncScrollAreas();

    modal_overlay.classList.remove("open");
    modal_content.classList.remove("open");
    resetModal();
    currentEditRow = null;
    what_modal = "add";
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

let statusPopup = document.getElementById("status-popup");
let currentStatusBtn = null;

// status-btn 클릭
document.addEventListener("click", (e)=> {
    let btn = e.target.closest(".status-btn");
    if (btn) {
        currentStatusBtn = btn;
        let rect = btn.getBoundingClientRect();
        statusPopup.style.top = (rect.bottom + 8) + "px";
        statusPopup.style.left = rect.left + "px";
        statusPopup.classList.add("open");
        e.stopPropagation();
        return;
    }
    statusPopup.classList.remove("open");
});

// 상태 선택
document.querySelectorAll(".status-option").forEach(option => {
    option.addEventListener("click", ()=> {
        let status = option.dataset.status;
        if (currentStatusBtn) {
            currentStatusBtn.querySelector(".status-icon").src = `./Asset/status/sta${status}.png`;
        }
        statusPopup.classList.remove("open");
    });
});

let currentEditRow = null;  // 수정 중인 행 저장

// 수정
document.addEventListener("click", (e)=> {
    let taskInfo = e.target.closest(".task-info");
    if (taskInfo) {
        what_modal = "edit";
        let row = taskInfo.closest(".table-row");
        currentEditRow = row;

        // 기존 값 불러오기
        let title = row.querySelector(".task-title").textContent;
        let sub = row.querySelector(".task-sub")?.textContent || "";
        let cols = row.querySelectorAll(".col");
        let dueDate = cols[0].textContent;
        let priority = cols[1].querySelector(".tagg").className.match(/T_p(\d)/)?.[1] || "1";
        let doDate = cols[2].textContent;
        let doTimeText = cols[3].querySelector(".tagg").textContent;

        // 모달에 값 채우기
        document.getElementById("add-task-name").value = title;
        document.getElementById("add-task-sub").value = sub;
        document.getElementById("add-due-date").value = dueDate;
        document.getElementById("add-priority").value = priority;
        document.getElementById("add-do-date").value = doDate;

        // doTime 텍스트로 value 찾기
        let doTimeEl = document.getElementById("add-do-time");
        for (let opt of doTimeEl.options) {
            if (opt.text === doTimeText) {
                doTimeEl.value = opt.value;
                break;
            }
        }

        // 모달 열기
        modal_overlay.classList.add("open");
        modal_content.classList.add("open");
        e.stopPropagation();
        requestAnimationFrame(() => {
            modal_content.scrollTop = 0;
        });
    }
});