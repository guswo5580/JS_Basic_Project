const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d"); //canvas 속성 접근

const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false }) //사용자의 mediaDevice에 접근
    .then((localMediaStream) => {
      console.log(localMediaStream);

      //스트리밍 비디오 주소를 URL로 변환하여 저장
      //video.src = window.URL.createObjectURL(localMediaStream) 이외의 브라우저에서는 URL 형태로 만들어 전송해주어야 함
      video.srcObject = localMediaStream; //크롬, 파이어폭스의 브라우저에서 srcObject로 저장 가능

      video.play(); //video 스트리밍 시작
    })
    .catch((err) => {
      console.error(`OH NO!!!`, err);
    });
}

//video 정보를 가져와 canvas 내에 그리기
function paintToCanvas() {
  //video의 크기
  const width = video.videoWidth;
  const height = video.videoHeight;

  //video의 크기에 맞게 캔버스의 크기 설정
  canvas.width = width;
  canvas.height = height;

  //16ms를 반복하며 스트리밍 -> 캔버스 작업 수행
  return setInterval(() => {
    //참조 element = video, (0,0) = 왼쪽 최상단 시작점, (width, height) = 오른 쪽 최하단 끝점
    ctx.drawImage(video, 0, 0, width, height);

    let pixels = ctx.getImageData(0, 0, width, height); //(0,0)~(width, height)의 정보 ex) rgba

    pixels = redEffect(pixels);

    pixels = rgbSplit(pixels);

    ctx.globalAlpha = 0.8; //canvas 속성 내 opacity를 조절하는 속성

    pixels = greenScreen(pixels);

    //변환한 값을 context2D에 다시 push
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  //사진 찍는 소리 재생
  snap.currentTime = 0; //초기화
  snap.play();

  //이미지 Data를 추출
  const data = canvas.toDataURL("image/jpeg"); //image's name/jpeg; ~~ 추가 데이터

  const link = document.createElement("a"); //link 태그 생성
  link.href = data; //주소 연결
  link.setAttribute("download", "DownLoad"); //Element 요소 속성, a의 download 속성

  link.innerHTML = `<img src="${data}" alt="SnapShot Image" />`; //HTML Element로 변환

  strip.insertBefore(link, strip.firstChild); //div.strip에 link Element를 삽입, firstChild = prepend
}

//Canvas 픽셀 효과
function redEffect(pixels) {
  //pixels 하위 data = 0~n r g b a 가 반복되며 색을 지정
  for (let i = 0; i < pixels.data.length; i += 4) {
    //rgb의 색상값을 바꾸기
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    //각 색상의 시작 위치를 변경, 3가지 색이 각각 중심이 되어 이미지 완성
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};
  document.querySelectorAll(".rgb input").forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    //pixels.data 내 각 색상값 찾기
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    //input에 설정된 name 값
    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      //alpha 값을 0으로 바꿈
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

//비디오 스트리밍 시작
getVideo();
//비디오가 정상적으로 play 되면 paintToCanvas를 수행
video.addEventListener("canplay", paintToCanvas);
