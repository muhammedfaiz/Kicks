function updateTimer() {
  let remainingTime = sessionStorage.getItem("remainingTime") || 60;
  let minutes = Math.floor(remainingTime / 60);
  let seconds = remainingTime % 60;
  let verifyBtn = document.getElementById('verify');
  let resend = document.getElementById('resend');
  const timer = document.getElementById("timer");
  timer.innerHTML =
    (minutes < 10 ? "0" : "") +
    minutes +
    ":" +
    (seconds < 10 ? "0" : "") +
    seconds;

  remainingTime--;
  sessionStorage.setItem("remainingTime", remainingTime);
  if (remainingTime < 0) {
    timer.innerHTML = "00:00";
    sessionStorage.removeItem("remainingTime");
    verifyBtn.style.display="none";
    resend.style.display="block";
  } else {
    resend.style.display="none";
    setTimeout(updateTimer, 1000);
  }
}

updateTimer();


