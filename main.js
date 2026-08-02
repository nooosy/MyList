// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8hyrOqYdoEAEur_0x6jRoi-vLn5zx2ds",
  authDomain: "galaxy-todo-60c61.firebaseapp.com",
  projectId: "galaxy-todo-60c61",
  storageBucket: "galaxy-todo-60c61.firebasestorage.app",
  messagingSenderId: "349161238390",
  appId: "1:349161238390:web:ac263ccbf5fe5a800ed457"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const db = getFirestore(app);

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

// 모달 관련 변수
let what_modal = "add";
let add_list = "sh";
let currentEditRow = null;
let syncing = false;
let scrollAreasSynced = false; // 스크롤 리스너 중복 등록 방지 플래그

const priorityText = { "1":"긴급", "2":"높음", "3":"중간", "4":"보통" };
const priorityClass = { "1":"T_p1", "2":"T_p2", "3":"T_p3", "4":"T_p4" };
const dtimeclass = { "1":"tt1", "2":"tt2", "3":"tt3", "4":"tt4", "5":"tt5", "6":"tt6", "7":"tt7", "8":"tt8", "9":"tt9", "10":"tt10" };

// 모달 초기화
function resetModal() {
    document.getElementById("add-task-name").value = "";
    document.getElementById("add-task-sub").value = "";
    document.getElementById("add-due-date").value = "";
    document.getElementById("add-priority").value = "1";
    document.getElementById("add-do-date").value = "";
    document.getElementById("add-do-time").value = "1";
}

let modal_content = document.getElementById("modal-content");
let modal_overlay = document.getElementById("add-task-modal");

// 모달 열기
function openModal() {
    let deleteBtn = document.getElementById("modal-d-btn");
    if (what_modal === "edit") {
        deleteBtn.style.visibility = "visible";
    } else {
        deleteBtn.style.visibility = "hidden";
    }

    modal_content.classList.add("open");
    modal_overlay.classList.add("open");
    requestAnimationFrame(() => {
        modal_content.scrollTop = 0;
    });
}

// 모달 닫기
function closeModal() {
    modal_content.classList.remove("open");
    modal_overlay.classList.remove("open");
}

// 추가 버튼들
document.getElementById("add-btn-sh").addEventListener("click", (e)=> {
    e.stopPropagation();
    add_list = "sh";
    what_modal = "add";
    openModal();
});

document.getElementById("add-btn-hi").addEventListener("click", (e)=> {
    e.stopPropagation();
    add_list = "hi";
    what_modal = "add";
    openModal();
});

document.getElementById("add-btn-hg").addEventListener("click", (e)=> {
    e.stopPropagation();
    add_list = "hg";
    what_modal = "add";
    openModal();
});

// 모달 내부 클릭 전파 막기
modal_content.addEventListener("click", (e)=> {
    e.stopPropagation();
});

// 오버레이 클릭으로 닫기
modal_overlay.addEventListener("click", ()=> {
    if (what_modal === "edit") {
        resetModal();
        currentEditRow = null;
    }
    what_modal = "add";
    closeModal();
});

// 삭제 버튼
document.getElementById("modal-d-btn").addEventListener("click", async (e)=> {
    e.stopPropagation();
    if (currentEditRow) {
        // Firestore에서 삭제
        let docId = currentEditRow.dataset.id;
        if (docId) {
            try {
                await deleteDoc(doc(db, "tasks", docId));
                console.log("삭제됨!");
            } catch (e) {
                console.error("삭제 실패:", e);
            }
        }
        currentEditRow.remove();
        currentEditRow = null;
    }
    resetModal();
    what_modal = "add";
    closeModal();
});

// 완료 버튼
document.getElementById("modal-ok-btn").addEventListener("click", async()=> {
    let title = document.getElementById("add-task-name").value;
    if (!title) return;

    let sub = document.getElementById("add-task-sub").value;
    let dueDate = document.getElementById("add-due-date").value;
    let priority = document.getElementById("add-priority").value;
    let doDate = document.getElementById("add-do-date").value;
    let doTimeEl = document.getElementById("add-do-time");
    let doTime = doTimeEl.value;
    let doTimeText = doTimeEl.options[doTimeEl.selectedIndex].text;

    const taskData = {
        title: title,
        sub: sub,
        dueDate: dueDate,
        priority: priority,
        doDate: doDate,
        doTime: doTime,
        list: add_list
    };

    if (what_modal === "edit" && currentEditRow) {
        // 편집 모드일 땐 기존 상태 아이콘에서 현재 status를 읽어와서 유지
        let statusIcon = currentEditRow.querySelector(".status-icon");
        let currentStatus = statusIcon.src.match(/sta(\d)\.png/)?.[1] || "0";
        taskData.status = currentStatus;
    } else {
        // 새로 추가할 때만 0으로 시작
        taskData.status = "0";
    }

    let innerHTML = `
        <div class="col-fixed">
            <div class="status-btn">
                <img src="./Asset/status/sta${taskData.status}.png" class="status-icon">            </div>
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

    if (what_modal === "edit" && currentEditRow) {
        currentEditRow.innerHTML = innerHTML;

        // Firestore 업데이트
        let docId = currentEditRow.dataset.id;
        if (docId) {
            try {
                await updateDoc(doc(db, "tasks", docId), taskData);
                console.log("수정됨!");
            } catch (e) {
                console.error("수정 실패:", e);
            }
        }
    } else {
        let newRow = document.createElement("div");
        newRow.className = "table-row";
        newRow.innerHTML = innerHTML;
        newRow.dataset.list = add_list;
        let addBtn = document.getElementById("add-btn-" + add_list);
        addBtn.parentNode.insertBefore(newRow, addBtn);

        // Firestore 추가
        try {
            const docRef = await addDoc(collection(db, "tasks"), taskData);
            newRow.dataset.id = docRef.id;
            console.log("저장됨:", docRef.id);
        } catch (e) {
            console.error("저장 실패:", e);
        }
    }

    syncScrollAreas();
    resetModal();
    currentEditRow = null;
    what_modal = "add";
    document.getElementById("modal-d-btn").style.display = "block";
    closeModal();
});

// 스크롤 동기화
function syncScrollAreas() {
    if (scrollAreasSynced) return;
    scrollAreasSynced = true;

    document.querySelectorAll(".scroll-area").forEach(area => {
        area.addEventListener("scroll", () => {
            if (syncing) return;
            syncing = true;
            document.querySelectorAll(".scroll-area").forEach(other => {
                if (other !== area) other.scrollLeft = area.scrollLeft;
            });
            syncing = false;
        });
    });
}

syncScrollAreas();

// 상태 팝업
let statusPopup = document.getElementById("status-popup");
let currentStatusBtn = null;

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

document.querySelectorAll(".status-option").forEach(option => {
    option.addEventListener("click", async ()=> {
        let status = option.dataset.status;
        if (currentStatusBtn) {
            currentStatusBtn.querySelector(".status-icon").src = `./Asset/status/sta${status}.png`;
            
            // 해당 행의 doc ID 가져오기
            let row = currentStatusBtn.closest(".table-row");
            let docId = row?.dataset.id;
            
            // Firestore 업데이트
            if (docId) {
                try {
                    await updateDoc(doc(db, "tasks", docId), {
                        status: status
                    });
                    console.log("상태 업데이트됨!");
                } catch (e) {
                    console.error("업데이트 실패:", e);
                }
            }
        }
        statusPopup.classList.remove("open");
    });
});

document.addEventListener("click", (e)=> {
    let taskInfo = e.target.closest(".task-info");
    if (!taskInfo) return;

    let row = taskInfo.closest(".table-row");
    if (!row || row.classList.contains("add-newrow")) return;

    what_modal = "edit";
    currentEditRow = row;
    add_list = row.dataset.list;

    document.getElementById("modal-d-btn").style.display = "block";

    let title = row.querySelector(".task-title").textContent;
    let sub = row.querySelector(".task-sub")?.textContent || "";
    let cols = row.querySelectorAll(".col");
    let dueDate = cols[0].textContent;
    let priority = cols[1].querySelector(".tagg").className.match(/T_p(\d)/)?.[1] || "1";
    let doDate = cols[2].textContent;
    let doTimeText = cols[3].querySelector(".tagg").textContent;

    document.getElementById("add-task-name").value = title;
    document.getElementById("add-task-sub").value = sub;
    document.getElementById("add-due-date").value = dueDate;
    document.getElementById("add-priority").value = priority;
    document.getElementById("add-do-date").value = doDate;

    let doTimeEl = document.getElementById("add-do-time");
    for (let opt of doTimeEl.options) {
        if (opt.text === doTimeText) {
            doTimeEl.value = opt.value;
            break;
        }
    }

    openModal();
    e.stopPropagation();
});

// 데이터 불러오기
async function loadTasks() {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    querySnapshot.forEach((doc) => {
        let data = doc.data();
        let doTimeEl = document.getElementById("add-do-time");
        let doTimeText = "";
        for (let opt of doTimeEl.options) {
            if (opt.value === data.doTime) {
                doTimeText = opt.text;
                break;
            }
        }

        let innerHTML = `
            <div class="col-fixed">
                <div class="status-btn">
                    <img src="./Asset/status/sta${data.status}.png" class="status-icon">
                </div>
                <div class="task-info">
                    <span class="task-title">${data.title}</span>
                    <span class="task-sub">${data.sub || ""}</span>
                </div>
            </div>
            <div class="scroll-area">
                <span class="col">${data.dueDate || ""}</span>
                <span class="col"><span class="tagg ${priorityClass[data.priority]}">${priorityText[data.priority]}</span></span>
                <span class="col">${data.doDate || ""}</span>
                <span class="col"><span class="tagg ${dtimeclass[data.doTime]}">${doTimeText}</span></span>
            </div>
        `;

        let newRow = document.createElement("div");
        newRow.className = "table-row";
        newRow.dataset.id = doc.id;
        newRow.dataset.list = data.list;
        newRow.innerHTML = innerHTML;

        let addBtn = document.getElementById("add-btn-" + data.list);
        if (addBtn) {
            addBtn.parentNode.insertBefore(newRow, addBtn);
        }
    });

    syncScrollAreas();
}

loadTasks();