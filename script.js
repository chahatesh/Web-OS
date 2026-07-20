const minimizedApps = {};

const apps = [
  { id: "welcome", name: "Robo-OS" },
  { id: "projectsapp", name: "Projects" },
  { id: "calculatorapp", name: "Calc" },
  { id: "browserapp", name: "Browser" },
];

function dragElement(el) {
  let startX = 0;
  let startY = 0;

  const header = document.getElementById(el.id + "header");
  const handle = header || el;
  handle.onmousedown = startDrag;

  function startDrag(e) {
    if (e.target.closest(".window-controls")) return;
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    document.onmousemove = drag;
    document.onmouseup = stopDrag;
  }

  function drag(e) {
    e.preventDefault();
    const dx = startX - e.clientX;
    const dy = startY - e.clientY;
    startX = e.clientX;
    startY = e.clientY;
    el.style.top = el.offsetTop - dy + "px";
    el.style.left = el.offsetLeft - dx + "px";
  }

  function stopDrag() {
    document.onmousemove = null;
    document.onmouseup = null;
  }
}

function closeWindow(appId) {
  document.getElementById(appId).style.display = "none";
  delete minimizedApps[appId];
  updateTaskbar();
}

function minimizeWindow(appId) {
  document.getElementById(appId).classList.add("minimized");
  minimizedApps[appId] = true;
  updateTaskbar();
}

function maximizeWindow(appId) {
  const win = document.getElementById(appId);
  win.classList.remove("minimized");
  win.style.display = "flex";
  delete minimizedApps[appId];
  updateTaskbar();
}

function openApp(appId) {
  if (minimizedApps[appId]) {
    maximizeWindow(appId);
  } else {
    document.getElementById(appId).style.display = "flex";
  }
  updateTaskbar();
}

function updateTaskbar() {
  const taskbar = document.getElementById("taskbarItems");
  taskbar.innerHTML = "";

  apps.forEach(app => {
    const win = document.getElementById(app.id);
    if (!win || win.style.display === "none") return;

    const item = document.createElement("div");
    item.className = "taskbar-item";
    item.textContent = app.name;
    item.onclick = () => openApp(app.id);
    if (minimizedApps[app.id]) item.style.opacity = "0.5";

    taskbar.appendChild(item);
  });
}

function updateTime() {
  document.getElementById("timeElement").innerHTML = new Date().toLocaleString();
}

const projects = [
  {
    id: 1,
    title: "4DOF Robot Arm",
    summary: "4-degree-of-freedom robotic arm with servo control.",
    icon: "🦾",
    color: "#FF6B6B",
    description: `
      <h4>4DOF Robot Arm</h4>
      <p>A 4-degree-of-freedom robotic arm designed for precision control and automation tasks.</p>
      <h5>Specifications</h5>
      <ul>
        <li><strong>Base rotation:</strong> 180°</li>
        <li><strong>Link 1 (J1–J2):</strong> 18cm, shoulder joint 5cm above base</li>
        <li><strong>Link 2 (J2–J3):</strong> 13cm</li>
        <li><strong>End effector:</strong> 11cm reach from final joint</li>
      </ul>
      <h5>Control system</h5>
      <ul>
        <li><strong>Microcontroller:</strong> Arduino Mega</li>
        <li><strong>Servo controller:</strong> PCA9685 PWM driver</li>
        <li><strong>Actuators:</strong> 5x MG995 servos, channels 0–4</li>
      </ul>
    `,
  },
  {
    id: 2,
    title: "Auto Locking Turret",
    summary: "Intelligent turret with automatic target tracking.",
    icon: "🎯",
    color: "#4ECDC4",
    description: `
      <h4>Auto Locking Turret</h4>
      <p>An autonomous turret system with target detection and automatic aiming.</p>
      <h5>Key features</h5>
      <ul>
        <li><strong>Auto-targeting:</strong> tracks and locks onto targets</li>
        <li><strong>Precision aiming:</strong> real-time servo adjustment</li>
        <li><strong>Rapid response:</strong> fast servo coordination</li>
        <li><strong>360° coverage:</strong> full rotational range</li>
      </ul>
      <h5>System architecture</h5>
      <ul>
        <li><strong>Sensing:</strong> vision or sensor-based detection</li>
        <li><strong>Processing:</strong> real-time tracking algorithm</li>
        <li><strong>Actuation:</strong> coordinated servo motors</li>
      </ul>
    `,
  },
];

function initProjects() {
  const grid = document.getElementById("projectsGrid");
  grid.innerHTML = "";

  projects.forEach(project => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.draggable = true;
    card.style.borderLeft = `5px solid ${project.color}`;
    card.innerHTML = `
      <div class="project-icon">${project.icon}</div>
      <div class="project-info">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-summary">${project.summary}</p>
        <button class="project-btn" onclick="showProjectDetail(${project.id})">Learn More</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function showProjectDetail(id) {
  const project = projects.find(p => p.id === id);

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const box = document.createElement("div");
  box.className = "modal-box";
  box.innerHTML = project.description + `<button class="modal-close">Close</button>`;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  box.querySelector(".modal-close").onclick = () => overlay.remove();
  overlay.onclick = e => {
    if (e.target === overlay) overlay.remove();
  };
}

let calcInput = "";

function appendCalc(value) {
  calcInput += value;
  document.getElementById("calcDisplay").value = calcInput;
}

function calculateResult() {
  try {
    calcInput = eval(calcInput).toString();
  } catch {
    calcInput = "";
    document.getElementById("calcDisplay").value = "Error";
    return;
  }
  document.getElementById("calcDisplay").value = calcInput;
}

function clearCalc() {
  calcInput = "";
  document.getElementById("calcDisplay").value = "";
}

function loadBrowser() {
  const input = document.getElementById("urlInput");
  let url = input.value.trim();
  if (!url) return;
  if (!url.includes("://")) url = "https://" + url;
  document.getElementById("browserFrame").src = url;
}

document.getElementById("urlInput").addEventListener("keypress", e => {
  if (e.key === "Enter") loadBrowser();
});

document.getElementById("welcomeopen").addEventListener("click", () => openApp("welcome"));
document.getElementById("projectsicon").addEventListener("click", () => openApp("projectsapp"));
document.getElementById("calculatoricon").addEventListener("click", () => openApp("calculatorapp"));
document.getElementById("browsericon").addEventListener("click", () => openApp("browserapp"));

apps.forEach(app => dragElement(document.getElementById(app.id)));

updateTime();
setInterval(updateTime, 1000);
initProjects();
updateTaskbar();