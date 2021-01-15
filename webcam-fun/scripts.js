const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false }) // returns a promise from webcam
  .then(localMediaStream => {
    console.log(localMediaStream) // localMediaStream is an object
    video.srcObject = localMediaStream;
    video.play();
  })
  .catch(error => {
    console.error('oh no 🥺', error);
  }); // in case someone does not allow you to handle their webcam
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  // set canvas size equal to video
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height); // start at top left hand corner of canvas, then pant width and height

    // take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height); // for every pixel on the canvas screen, there are 4 numbers (red, green, blue, alpha) and they are stored in an array in pixels variable

    // mess with them

    // pixels = redEffect(pixels);

    // pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.1; // write the actual current frame but keep the underneath ones for 10 more frames (putting transparency on the image & stacking)

    pixels =greenScreen(pixels);

    // put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  // play the sound
  snap.currentTime = 0;
  snap.play()
  // take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg'); // a text based representation of the picture
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome'); // 'handsome' = the name it saves in
  link.innerHTML = `<img src="${data}" alt="girl" />`
  strip.insertBefore(link, strip.firstChild);
}


function redEffect(pixels) {
  // pixels is a special kind of array that does not have map function
  // pixels is not an array but pixels.data is
  for(let i = 0; i < pixels.data.length; i+=4) {  // increments it by 4
    // how they are manipulated, can be played around with depending on the effect wanted
    pixels.data[i] = pixels.data[i] + 100; // red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.7 // blue
  }
  return pixels;
}

function rgbSplit(pixels) {
    for(let i = 0; i < pixels.data.length; i+=4) {
      // pulling apart the different red, green, blue pixels to different places
      pixels.data[i - 150] = pixels.data[i]; // change the pixel that is 150 back to be red
      pixels.data[i + 100] = pixels.data[i + 1]; // change the pixel that is 100 forward to be green
      pixels.data[i - 150] = pixels.data[i + 2]; // change the pixel that is 150 back to be blue
  }
  return pixels
}


// give me all the colors between these rgb values and take them out
function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    // to find out the value of rgba of each pixel
    red = pixels.data[i];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    // if the values are anywhere in between their min & maxes, make the opacity = 0 (totally transparent = take the color out!)
    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas) // once video plays, it emits an event called canplay
