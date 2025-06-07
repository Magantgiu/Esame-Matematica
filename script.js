// Timer
let timerInterval;
let totalTime = 3 * 60 * 60;
let timeLeft = totalTime;
let isRunning = false;

function updateTimerDisplay() {
  const h = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
  const m = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
  const s = String(timeLeft % 60).padStart(2, '0');
  document.getElementById("timer").textContent = `${h}:${m}:${s}`;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  document.getElementById("progressFill").style.width = `${progress}%`;

  if (timeLeft <= 5 * 60) {
    document.getElementById("timer").classList.add("warning");
  } else {
    document.getElementById("timer").classList.remove("warning");
  }
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        alert("Tempo scaduto!");
      }
    }, 1000);
  }
}

function pauseTimer() {
  isRunning = false;
  clearInterval(timerInterval);
}

function resetTimer() {
  pauseTimer();
  timeLeft = totalTime;
  updateTimerDisplay();
}

// Inserimento simboli
function insertMath(id, symbol) {
  const t = document.getElementById(id);
  const start = t.selectionStart;
  const end = t.selectionEnd;
  t.value = t.value.substring(0, start) + symbol + t.value.substring(end);
  t.focus();
  t.selectionStart = t.selectionEnd = start + symbol.length;
}

// Canvas
let currentColor = 'black';

function setColor(color) {
  currentColor = color;
}

function clearCanvas(id) {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawGrid(id) {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext('2d');
  clearCanvas(id);
  ctx.strokeStyle = '#ccc';
  for (let x = 0; x < canvas.width; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

window.addEventListener('load', () => {
  document.querySelectorAll('canvas').forEach(canvas => {
    const ctx = canvas.getContext('2d');
    let drawing = false;

    canvas.addEventListener('mousedown', e => {
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    });
    canvas.addEventListener('mousemove', e => {
      if (drawing) {
        ctx.strokeStyle = currentColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
      }
    });
    canvas.addEventListener('mouseup', () => drawing = false);
    canvas.addEventListener('mouseout', () => drawing = false);
  });
});

// PDF
function generatePDF() {
  const examContent = document.getElementById("examContent");
  const loading = document.getElementById("loading");
  loading.style.display = "block";

  html2canvas(examContent).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = canvas.height * imgWidth / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save("prova_matematica.pdf");
    loading.style.display = "none";
  });
}

updateTimerDisplay();
