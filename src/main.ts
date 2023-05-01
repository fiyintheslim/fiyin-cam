import "./style.css";
import { videoController } from "./video";

window.addEventListener("DOMContentLoaded", () => {
  const video = document.querySelector("video")!;
  const videoControls = document.querySelector(".video_controller")!;
  const audioControls = document.querySelector(".audio_controller")!;
  const startVid = document.querySelector("#start_video")!;
  const stopVid = document.querySelector("#stop_video")!;
  const startAudio = document.querySelector("#start_audio")!;
  const stopAudio = document.querySelector("#stop_audio");

  startVid.addEventListener("click", () => {
    videoController.registerVideoElement(video).startVideo().displayVideo();
    video.setAttribute("style", "display: block");
    startVid.setAttribute("style", "display: none");
    videoControls.setAttribute("style", "display: block");
    audioControls.setAttribute("style", "display: none");
  });

  stopVid.addEventListener("click", () => {
    videoController.stopVideo();
    startVid.setAttribute("style", "display: inline-block");
    audioControls.setAttribute("style", "display: flex");
    video.setAttribute("style", "display: none");
  });

  startAudio.addEventListener("click", () => {
    videoControls.setAttribute("style", "display: none");
  });

  stopAudio?.addEventListener("click", () => {
    videoControls.setAttribute("style", "display: flex");
  });
});
