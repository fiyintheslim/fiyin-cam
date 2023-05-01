class Video {
  private videoElement?: HTMLVideoElement;
  private stream?: MediaStream;
  private recording: boolean;
  private recorder?: MediaRecorder;
  private chunk: Blob[];

  constructor() {
    this.recording = false;
    this.chunk = [];
  }

  registerVideoElement(ele: HTMLVideoElement) {
    this.videoElement = ele;
    return this;
  }

  startVideo() {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        this.stream = stream;
        if (this.videoElement) {
          this.videoElement.srcObject = this.stream;
          this.recording = true;
          //start recording video
          this.recorder = new MediaRecorder(stream);
          this.recorder.start();
          this.recorder.ondataavailable = (e) =>
            handleRecorderData(e, this.chunk);
          this.recorder.onstop = () =>
            handleRecorderStop(this.chunk, this.recorder);
        }
      });
    return this;
  }

  displayVideo() {
    if (this.stream && this.videoElement) {
      this.videoElement.srcObject = this.stream;
    }
    return this;
  }

  stopVideo() {
    if (this.stream && this.recording) {
      this.stream.getTracks().forEach((track) => {
        track.stop();
      });
      this.recording = false;
      this.recorder?.stop();
    }
  }
}

export const videoController = new Video();

function handleRecorderData(e: BlobEvent, chunk: Blob[]) {
  let data = e.data;
  console.log("Data available", data);
  chunk.push(data);
  return;
}

function handleRecorderStop(chunk: Blob[], recorder?: MediaRecorder) {
  const blob = new Blob(chunk, { type: "video/mp4" });

  const downloadBTN = document.createElement("a");
  const recordedURL = URL.createObjectURL(blob);

  const videoEle = document.createElement("video");
  videoEle.src = recordedURL;
  videoEle.autoplay = true;
  videoEle.controls = true;

  document.querySelector("body")!.appendChild(videoEle);

  console.log(recordedURL, blob);
  downloadBTN.href = recordedURL;
  downloadBTN.download = "video-recording.mp4";
  downloadBTN.classList.add("download");
  downloadBTN.innerText = "Download";

  document.querySelector("body")!.appendChild(downloadBTN);
  downloadBTN.addEventListener("click", function () {
    URL.revokeObjectURL(recordedURL);
    this.parentElement?.removeChild(this);
  });
}