class Audio {
  private audioCTX?: AudioContext;
  private stream?: MediaStream;
  private analyser?: AnalyserNode;
  private bufferLength?: number;
  private dataArray?: Uint8Array;
  private canvas?: HTMLCanvasElement;
  private animation?: number;
  private recorderDataArray: Blob[];
  private mediaRecorder?: MediaRecorder;

  constructor() {
    this.recorderDataArray = [];
  }

  startAudio() {
    const ctx = new window.AudioContext();
    this.audioCTX = ctx;
    let analyser = ctx.createAnalyser();
    this.analyser = analyser;

    analyser.fftSize = 128;
    this.bufferLength = analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        this.stream = stream;
        let source = this.audioCTX?.createMediaStreamSource(stream);

        if (this.analyser) {
          source?.connect(this.analyser);
        }

        const mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder = mediaRecorder;

        mediaRecorder.ondataavailable = (e) =>
          dataAvailableHandler(e, this.recorderDataArray);
        mediaRecorder.onstop = () => handleRecorderStop(this.recorderDataArray);

        mediaRecorder.start();
      });
    return this;
  }

  stopAudio() {
    if (this.stream && this.animation) {
      this.stream.getAudioTracks().forEach((track) => track.stop());
      cancelAnimationFrame(this.animation);
      this.mediaRecorder?.stop();
    }
  }

  registerCanvas(ele: HTMLCanvasElement) {
    this.canvas = ele;
    return this;
  }

  animate() {
    if (this.canvas && this.bufferLength && this.dataArray) {
      let x = 0;
      const barWidth = this.canvas.width / this.bufferLength;
      const ctx = this.canvas.getContext("2d");
      this.analyser?.getByteFrequencyData(this.dataArray);
      ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = 0; i < this.bufferLength; i++) {
        let barHeight = this.dataArray[i];
        ctx ? (ctx.fillStyle = "#000") : null;
        ctx?.fillRect(
          x,
          (this.canvas.height - barHeight) / 2,
          barWidth,
          barHeight
        );
        x += barWidth;
      }

      this.animation = requestAnimationFrame(() => this.animate());
    }
  }
}

export const audioController = new Audio();

function dataAvailableHandler(e: BlobEvent, dataArr: Blob[]) {
  dataArr.push(e.data);
}

function handleRecorderStop(dataArr: Blob[]) {
  const blob = new Blob(dataArr, { type: "audio/mp3" });
  const url = URL.createObjectURL(blob);

  const downloadBTN = document.createElement("a");
  downloadBTN.href = url;
  downloadBTN.download = "video-recording.mp3";
  downloadBTN.classList.add("download");
  downloadBTN.innerText = "Download";

  document.querySelector("body")!.appendChild(downloadBTN);
}
