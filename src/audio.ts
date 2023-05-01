class Audio {
  startAudio() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  }
}

export const audioController = new Audio();
