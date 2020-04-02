/* Elements */
const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
const toggle = player.querySelector(".toggle"); //button
const skipButtons = player.querySelectorAll("[data-skip]"); //dataSet
const ranges = player.querySelectorAll(".player__slider"); //input

const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");

/* functions */
function togglePlay() {
  // if (video.paused) {
  //   video.play();
  // } else {
  //   video.pause();
  // }

  const method = video.paused ? "play" : "pause";
  video[method](); //video[] === video.
}

function updateButton() {
  const icon = this.paused ? "►" : "❚ ❚";
  // console.log(icon);
  toggle.textContent = icon;
}

function skip() {
  //Video 진행 시간 변경
  video.currentTime += parseFloat(this.dataset.skip); //dataset.skip = data-skip의 값 : 25 or -10
}

function handleRangeUpdate() {
  video[this.name] = this.value;
  //video.volume = this.value --- range value
  //video.playbackRate = this.value
}

// video.duration = float 타입

function handleProgress() {
  //동영상의 진행 시간 -> progressBar의 basis 삽입
  const percent = (video.currentTime / video.duration) * 100; // (현재 비디오 시간/전체 재생시간) * 100 백분율
  progressBar.style.flexBasis = `${percent}%`; //-가 들어간 css 접근 시, camel기법 적용, flex-basis = 영역 넓히기
}

function scrub(e) {
  console.log(e.offsetX);
  console.log(progress.offsetWidth);
  console.log(video.duration);

  //progress div Tag 접근
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  //e.offset = progress div 내에서 mouse의 위치
  //progress.offsetWidth = progress div 전체 가로 길이
  video.currentTime = scrubTime;
}

/* event listeners */

//재생 or 일시정지
video.addEventListener("click", togglePlay); //video 태그 클릭
toggle.addEventListener("click", togglePlay); //toggle button 클릭

//toggle button update
video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);

//Update linear progress bar
video.addEventListener("timeupdate", handleProgress);

//skipButton controll
skipButtons.forEach(button => button.addEventListener("click", skip));

//range input controll
ranges.forEach(range => range.addEventListener("change", handleRangeUpdate)); //range의 변화는 click X
ranges.forEach(range => range.addEventListener("mousemove", handleRangeUpdate));

let mousedown = false;
//mousedown 여부를 확인
progress.addEventListener("mousedown", () => (mousedown = true));
progress.addEventListener("mouseup", () => (mousedown = false));

//progress의 클릭, 변화 여부 확인
progress.addEventListener("click", scrub);
progress.addEventListener("mousemove", e => mousedown && scrub(e));
/*
progress.addEventListener("mousemove", (e) => {
  if(mousedown){
    scrub(e);
  }
});
*/
