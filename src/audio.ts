class Audio {
  private stream?: MediaStream;

  startAudio() {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        this.stream = stream;
      });
  }
}

export const audioController = new Audio();
