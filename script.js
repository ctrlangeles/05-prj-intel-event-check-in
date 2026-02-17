const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const celebration = document.getElementById("celebration");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const attendeeList = document.getElementById("attendeeList");
const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");
const waterCard = document.querySelector(".team-card.water");
const zeroCard = document.querySelector(".team-card.zero");
const powerCard = document.querySelector(".team-card.power");

let count = 0;
const maxCount = 50;
let teamCounts = {
  water: 0,
  zero: 0,
  power: 0,
};
let attendees = [];

const storageKeys = {
  count: "intelCount",
  teamCounts: "intelTeamCounts",
  attendees: "intelAttendees",
};

const teamLabels = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

function loadFromStorage() {
  const storedCount = localStorage.getItem(storageKeys.count);
  const storedTeams = localStorage.getItem(storageKeys.teamCounts);
  const storedAttendees = localStorage.getItem(storageKeys.attendees);

  if (storedCount) {
    const parsedCount = parseInt(storedCount, 10);
    if (!isNaN(parsedCount)) {
      count = parsedCount;
    }
  }

  if (storedTeams) {
    teamCounts = JSON.parse(storedTeams);
  }

  if (storedAttendees) {
    attendees = JSON.parse(storedAttendees);
  }

  if (typeof teamCounts.water !== "number") {
    teamCounts.water = 0;
  }
  if (typeof teamCounts.zero !== "number") {
    teamCounts.zero = 0;
  }
  if (typeof teamCounts.power !== "number") {
    teamCounts.power = 0;
  }

  if (!Array.isArray(attendees)) {
    attendees = [];
  }
}

function saveToStorage() {
  localStorage.setItem(storageKeys.count, count);
  localStorage.setItem(storageKeys.teamCounts, JSON.stringify(teamCounts));
  localStorage.setItem(storageKeys.attendees, JSON.stringify(attendees));
}

function updateCountDisplay() {
  attendeeCount.textContent = count;
  const percentage = Math.min(Math.round((count / maxCount) * 100), 100);
  progressBar.style.width = `${percentage}%`;
}

function updateTeamDisplays() {
  waterCount.textContent = teamCounts.water;
  zeroCount.textContent = teamCounts.zero;
  powerCount.textContent = teamCounts.power;
}

function showGreeting(name, teamName) {
  greeting.textContent = `Welcome, ${name} from ${teamName}!`;
  greeting.classList.add("success-message");
  greeting.style.display = "block";
}

function renderAttendeeList() {
  attendeeList.innerHTML = "";

  for (let i = 0; i < attendees.length; i++) {
    const attendee = attendees[i];
    const listItem = document.createElement("li");
    listItem.textContent = `${attendee.name} - ${attendee.team}`;
    attendeeList.appendChild(listItem);
  }
}

function getWinningTeamKey() {
  const keys = Object.keys(teamCounts);
  let winningKey = "";
  let highestCount = -1;
  let tie = false;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = teamCounts[key];

    if (value > highestCount) {
      highestCount = value;
      winningKey = key;
      tie = false;
    } else if (value === highestCount) {
      tie = true;
    }
  }

  if (tie) {
    return "";
  }

  return winningKey;
}

function updateTeamHighlight(winningKey) {
  waterCard.classList.remove("winner");
  zeroCard.classList.remove("winner");
  powerCard.classList.remove("winner");

  if (winningKey === "water") {
    waterCard.classList.add("winner");
  }

  if (winningKey === "zero") {
    zeroCard.classList.add("winner");
  }

  if (winningKey === "power") {
    powerCard.classList.add("winner");
  }
}

function updateCelebration() {
  if (count >= maxCount) {
    const winningKey = getWinningTeamKey();
    const winningLabel = winningKey ? teamLabels[winningKey] : "a tie";
    celebration.textContent = `Goal reached! ${count} attendees checked in. Winning team: ${winningLabel}.`;
    celebration.style.display = "block";
    updateTeamHighlight(winningKey);
    return;
  }

  celebration.textContent = "";
  celebration.style.display = "none";
  updateTeamHighlight("");
}

function initializePage() {
  loadFromStorage();
  updateCountDisplay();
  updateTeamDisplays();
  renderAttendeeList();
  updateCelebration();
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;

  if (!name || !team) {
    return;
  }

  const teamName = teamSelect.selectedOptions[0].text;

  count = count + 1;
  teamCounts[team] = teamCounts[team] + 1;
  attendees.push({
    name: name,
    team: teamName,
  });

  updateCountDisplay();
  updateTeamDisplays();
  renderAttendeeList();
  showGreeting(name, teamName);
  updateCelebration();
  saveToStorage();

  form.reset();
});

initializePage();
