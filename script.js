const minimizedApps = {};

const apps = [
  { id: "welcome", name: "Robo-OS" },
  { id: "projectsapp", name: "Projects" },
  { id: "calculatorapp", name: "Calc" },
  { id: "browserapp", name: "Browser" },
  { id: "notesapp", name: "Notes" },
  { id: "musicapp", name: "Music" },
  { id: "weatherapp", name: "Weather" },
  { id: "settingsapp", name: "Settings" },
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
    icon: "",
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
    summary: "A turret with automatic target tracking.",
    icon: "",
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

const notesArea = document.getElementById("notesArea");
const notesStatus = document.getElementById("notesStatus");
let notesTimer = null;

notesArea.value = localStorage.getItem("robo-os-notes") || "";

notesArea.addEventListener("input", () => {
  notesStatus.textContent = "Saving";
  clearTimeout(notesTimer);
  notesTimer = setTimeout(() => {
    localStorage.setItem("robo-os-notes", notesArea.value);
    notesStatus.textContent = "Saved";
  }, 500);
});

function clearNotes() {
  notesArea.value = "";
  localStorage.removeItem("robo-os-notes");
  notesStatus.textContent = "saved";
}

const audio = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playBtn");
const progressBar = document.getElementById("progressBar");
const volumeBar = document.getElementById("volumeBar");
const currentTimeEl = document.getElementById("currentTime");
const durationTimeEl = document.getElementById("durationTime");

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function togglePlay() {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸";
  } else {
    audio.pause();
    playBtn.textContent = "▶";
  }
}

function skipForward() {
  audio.currentTime = Math.min(audio.currentTime + 10, audio.duration || 0);
}

function skipBack() {
  audio.currentTime = Math.max(audio.currentTime - 10, 0);
}

audio.addEventListener("loadedmetadata", () => {
  durationTimeEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  currentTimeEl.textContent = formatTime(audio.currentTime);
  if (audio.duration) progressBar.value = (audio.currentTime / audio.duration) * 100;
});

audio.addEventListener("ended", () => {
  playBtn.textContent = "";
});

progressBar.addEventListener("input", () => {
  if (audio.duration) audio.currentTime = (progressBar.value / 100) * audio.duration;
});

volumeBar.addEventListener("input", () => {
  audio.volume = volumeBar.value / 100;
});

audio.volume = 0.8;

async function loadWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const resultBox = document.getElementById("weatherResult");
  if (!city) return;

  resultBox.innerHTML = `<p class="weather-placeholder">Loading...</p>`;

  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      resultBox.innerHTML = `<p class="weather-placeholder">City not found.</p>`;
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`);
    const weatherData = await weatherRes.json();
    const current = weatherData.current;

    const codeMap = {
      0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
      45: "Fog", 48: "Fog", 51: "Light drizzle", 61: "Light rain", 63: "Rain",
      65: "Heavy rain", 71: "Snow", 73: "Snow", 75: "Heavy snow",
      80: "Rain showers", 95: "Thunderstorm",
    };
    const desc = codeMap[current.weather_code] || "Unknown";

    resultBox.innerHTML = `
      <div class="weather-city">${name}, ${country}</div>
      <div class="weather-temp">${Math.round(current.temperature_2m)}°C</div>
      <div class="weather-desc">${desc}</div>
      <div class="weather-details">
        <span> ${current.relative_humidity_2m}%</span>
        <span> ${Math.round(current.wind_speed_10m)} km/h</span>
      </div>
    `;
  } catch (err) {
    resultBox.innerHTML = `<p class="weather-placeholder">Could not load weather.</p>`;
  }
}

document.getElementById("cityInput").addEventListener("keypress", e => {
  if (e.key === "Enter") loadWeather();
});

function setAccent(main, dark) {
  document.documentElement.style.setProperty("--accent", main);
  document.querySelectorAll(".topbar, .windowheader").forEach(el => {
    el.style.background = `linear-gradient(90deg, ${dark}, ${main})`;
  });
  document.querySelectorAll(".cta-button, .project-btn, .calc-equals, .browser-btn, .modal-close, .taskbar-item").forEach(el => {
    el.style.background = `linear-gradient(135deg, ${main}, ${dark})`;
  });
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

document.getElementById("welcomeopen").addEventListener("click", () => openApp("welcome"));
document.getElementById("projectsicon").addEventListener("click", () => openApp("projectsapp"));
document.getElementById("calculatoricon").addEventListener("click", () => openApp("calculatorapp"));
document.getElementById("browsericon").addEventListener("click", () => openApp("browserapp"));
document.getElementById("notesicon").addEventListener("click", () => openApp("notesapp"));
document.getElementById("musicicon").addEventListener("click", () => openApp("musicapp"));
document.getElementById("weathericon").addEventListener("click", () => openApp("weatherapp"));
document.getElementById("settingsicon").addEventListener("click", () => openApp("settingsapp"));

apps.forEach(app => dragElement(document.getElementById(app.id)));

updateTime();
setInterval(updateTime, 1000);
initProjects();
updateTaskbar();
