(function () {
  "use strict";

  // =========================
  // STORAGE
  // =========================
  const Storage = {
    load(key) {
      try {
        return JSON.parse(localStorage.getItem(key)) || [];
      } catch {
        return [];
      }
    },

    save(key, data) {
      localStorage.setItem(key, JSON.stringify(data));
    },
  };

  // =========================
  // GREETING
  // =========================
  function getGreeting(hour) {
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 18) return "Good Afternoon";
    if (hour >= 18 && hour < 22) return "Good Evening";
    return "Good Night";
  }

  function updateGreeting() {
    const now = new Date();

    const greeting = document.getElementById("greeting-message");
    const time = document.getElementById("greeting-time");
    const date = document.getElementById("greeting-date");

    greeting.textContent = getGreeting(now.getHours());

    time.textContent =
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0");

    date.textContent = now.toDateString();
  }

  // =========================
  // TIMER
  // =========================
  let timer = 1500;
  let interval = null;

  const timerDisplay = document.getElementById("timer-display");

  function updateTimerDisplay() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    timerDisplay.textContent =
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0");
  }

  document.getElementById("timer-start").addEventListener("click", () => {
    if (interval) return;

    interval = setInterval(() => {
      if (timer > 0) {
        timer--;
        updateTimerDisplay();
      } else {
        clearInterval(interval);
      }
    }, 1000);
  });

  document.getElementById("timer-stop").addEventListener("click", () => {
    clearInterval(interval);
    interval = null;
  });

  document.getElementById("timer-reset").addEventListener("click", () => {
    clearInterval(interval);
    interval = null;
    timer = 1500;
    updateTimerDisplay();
  });

  // =========================
  // TODO LIST
  // =========================
  let tasks = Storage.load("tasks");

  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const todoList = document.getElementById("todo-list");
  const todoError = document.getElementById("todo-error");

  function renderTasks() {
    todoList.innerHTML = "";

    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = "todo-item";

      li.innerHTML = `
        <div class="todo-left">
          <input type="checkbox" ${task.completed ? "checked" : ""}>
          <span class="${task.completed ? "completed" : ""}">
            ${task.text}
          </span>
        </div>

        <button class="delete-btn">Delete</button>
      `;

      const checkbox = li.querySelector("input");
      checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        Storage.save("tasks", tasks);
        renderTasks();
      });

      const deleteBtn = li.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", () => {
        tasks.splice(index, 1);
        Storage.save("tasks", tasks);
        renderTasks();
      });

      todoList.appendChild(li);
    });
  }

  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const value = todoInput.value.trim();

    if (!value) {
      todoError.textContent = "Task cannot be empty!";
      return;
    }

    todoError.textContent = "";

    tasks.push({
      text: value,
      completed: false,
    });

    Storage.save("tasks", tasks);

    renderTasks();

    todoInput.value = "";
  });

  // =========================
  // QUICK LINKS
  // =========================
  let links = Storage.load("links");

  const linksForm = document.getElementById("links-form");
  const linksLabel = document.getElementById("links-label");
  const linksUrl = document.getElementById("links-url");
  const linksList = document.getElementById("links-list");
  const linksError = document.getElementById("links-error");

  function renderLinks() {
    linksList.innerHTML = "";

    links.forEach((link) => {
      const div = document.createElement("div");

      div.className = "link-item";

      div.innerHTML = `
        <a href="${link.url}" target="_blank">
          ${link.label}
        </a>
      `;

      linksList.appendChild(div);
    });
  }

  linksForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const label = linksLabel.value.trim();
    const url = linksUrl.value.trim();

    if (!label || !url) {
      linksError.textContent = "All fields are required!";
      return;
    }

    linksError.textContent = "";

    links.push({
      label,
      url,
    });

    Storage.save("links", links);

    renderLinks();

    linksLabel.value = "";
    linksUrl.value = "";
  });

  // =========================
  // INIT
  // =========================

    // =========================
  // SETTINGS
  // =========================

  const customNameInput = document.getElementById("custom-name");
  const pomodoroInput = document.getElementById("pomodoro-time");
  const themeToggle = document.getElementById("theme-toggle");

  // Load settings
  let userName = localStorage.getItem("userName") || "";
  let pomodoroMinutes =
    Number(localStorage.getItem("pomodoroMinutes")) || 25;

  let darkMode =
    localStorage.getItem("darkMode") === "true";

  // Apply dark mode
  if (darkMode) {
    document.body.classList.add("dark");
  }

  // Set input values
  customNameInput.value = userName;
  pomodoroInput.value = pomodoroMinutes;

  // Apply timer value
  timer = pomodoroMinutes * 60;
  updateTimerDisplay();

  // Save custom name
  customNameInput.addEventListener("input", () => {
    userName = customNameInput.value;

    localStorage.setItem("userName", userName);

    updateGreeting();
  });

  // Change pomodoro time
  pomodoroInput.addEventListener("change", () => {

    pomodoroMinutes =
      Number(pomodoroInput.value);

    if (pomodoroMinutes < 1) {
      pomodoroMinutes = 1;
    }

    timer = pomodoroMinutes * 60;

    updateTimerDisplay();

    localStorage.setItem(
      "pomodoroMinutes",
      pomodoroMinutes
    );
  });

  // Toggle dark mode
  themeToggle.addEventListener("click", () => {

    darkMode = !darkMode;

    document.body.classList.toggle("dark");

    localStorage.setItem(
      "darkMode",
      darkMode
    );
  });
  updateGreeting();
  setInterval(updateGreeting, 1000);

  updateTimerDisplay();

  renderTasks();
  renderLinks();

})();