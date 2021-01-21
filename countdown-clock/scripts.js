let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
  // clear any existing timers
  clearInterval(countdown);

  const now = Date.now();
  const then = now + (seconds * 1000);
  // because the interval starts after a seconds has passed, display it right away when countdown starts also
  displayTimeLeft(seconds);
  displayEndTime(then);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000); // divide to get seconds from milliseconds
    // check if you should stop
    if (secondsLeft < 0) {
      clearInterval(countdown);
      return
    }

    // display it
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${mins}:${secs >= 10 ? secs : '0' + secs}`;
  timerDisplay.textContent = display;
  document.title = display;
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp); // takes the number generated from Date.now etc and converts it to readable time
  const hour = end.getHours();
  const minutes = end.getMinutes();
  endTime.textContent = `PLEASE BE BACK BY ${hour > 12 ? hour - 12 : hour}:${minutes >= 10 ? minutes : '0' + minutes}`
}

function startTimer() {
  timer(parseInt(this.dataset.time));
}



buttons.forEach(button => button.addEventListener('click', startTimer));
// if the element has a name attribute you can simply put the name
// if the input also has a name you can just nest it to get the input
// document.customForm.minutes
document.customForm.addEventListener('submit', function(e) {
  // prevent page refresh and url update
  e.preventDefault();
  const mins = this.minutes.value;
  timer(mins * 60);
  this.reset();
})
