const timerDisplay = document.querySelector(".display__time-left");
const endTime = document.querySelector(".display__end-time");

const buttons = document.querySelectorAll("[data-time]");

//set, Clear Interval 조정 변수
let countdown;

function timer(seconds) {
  // clear existing timers
  clearInterval(countdown);

  const now = Date.now();
  const then = now + seconds * 1000; //now + 설정 seconds = 예상 종료 시간

  displayTimeLeft(seconds);
  displayEndTime(then);

  //countdown 변수에서 setInterval 실행
  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);

    if (secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }

    // display
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60); //입력받은 '초 -> 분' 으로 변경
  const remainderSeconds = seconds % 60; //분으로 변경 후, 나머지 초 계산

  //삼항 연산자의 활용 - 각각의 백틱 내, 어디서든지 적용가능
  const display = `${minutes}:${
    remainderSeconds < 10 ? "0" : ""
  }${remainderSeconds}`;

  //Element 내용 변경
  document.title = display;
  timerDisplay.textContent = display;
}

//예상 종료 시간
function displayEndTime(timestamp) {
  const end = new Date(timestamp);

  const hour = end.getHours();
  const minutes = end.getMinutes();

  const adjustedHour = hour > 12 ? hour - 12 : hour;

  endTime.textContent = `Be Back At ${adjustedHour}:${
    minutes < 10 ? "0" : ""
  }${minutes}`;
}

function startTimer() {
  //data-time 변수 설정
  const seconds = parseInt(this.dataset.time);
  timer(seconds);
}

buttons.forEach((button) => button.addEventListener("click", startTimer));

document.customForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const mins = this.minutes.value; //customForm > input[name=minutes]
  // console.log(mins);
  timer(mins * 60);

  this.reset(); //form reset
});
