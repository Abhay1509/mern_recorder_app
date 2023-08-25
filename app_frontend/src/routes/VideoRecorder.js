import { useState, useRef } from "react";

const mimeType = 'video/webm; codecs="opus,vp8"';

const VideoRecorder = () => {
  const [permission, setPermission] = useState(false);
  const [askingForPermission, setAskingForPermission] = useState(false);

  const mediaRecorder = useRef(null);
  const liveVideoFeed = useRef(null);

  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState(null);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [videoChunks, setVideoChunks] = useState([]);

  const getCameraPermission = async () => {
    setRecordedVideo(null);
    if ("MediaRecorder" in window) {
      try {
        const videoConstraints = {
          audio: false,
          video: true,
        };
        const videoStream = await navigator.mediaDevices.getUserMedia(
          videoConstraints
        );

        setStream(videoStream);
        liveVideoFeed.current.srcObject = videoStream;
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }

    // Start asking for microphone permission
    setAskingForPermission(true);
  };

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const audioConstraints = { audio: true };
        const audioStream = await navigator.mediaDevices.getUserMedia(
          audioConstraints
        );

        // Combine audio stream with existing video stream
        const combinedStream = new MediaStream([
          ...stream.getVideoTracks(),
          ...audioStream.getAudioTracks(),
        ]);

        setStream(combinedStream);
        liveVideoFeed.current.srcObject = combinedStream;
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }

    setPermission(true);
    setAskingForPermission(false);
  };

  const startRecording = () => {
    setRecordingStatus("recording");

    const media = new MediaRecorder(stream, { mimeType });

    mediaRecorder.current = media;

    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;

      setVideoChunks((prevChunks) => [...prevChunks, event.data]);
    };

    mediaRecorder.current.start();
  };

  const stopRecording = () => {
    setRecordingStatus("inactive");

    mediaRecorder.current.stop();

    mediaRecorder.current.onstop = () => {
      const videoBlob = new Blob(videoChunks, { type: mimeType });
      const videoUrl = URL.createObjectURL(videoBlob);

      setRecordedVideo(videoUrl);
      setVideoChunks([]);
    };
  };

  return (
    <div>
      <h2 className="flex justify-center items-center pt-5">Video Recorder</h2>
      <main className="flex justify-center items-center pt-5">
        <div className="video-controls">
          {!permission && !askingForPermission ? (
            <button
              onClick={getCameraPermission}
              type="button"
              className="btn_color "
            >
              Get Camera
            </button>
          ) : null}
          {askingForPermission ? (
            <button
              onClick={getMicrophonePermission}
              type="button"
              className="btn_color "
            >
              Get Microphone
            </button>
          ) : null}
          {permission && recordingStatus === "inactive" ? (
            <button
              onClick={startRecording}
              type="button"
              className="btn_color"
            >
              Start Recording
            </button>
          ) : null}
          {recordingStatus === "recording" ? (
            <button onClick={stopRecording} type="button" className="btn_color">
              Stop Recording
            </button>
          ) : null}
        </div>
      </main>

      <div className="video-player">
        {!recordedVideo ? (
          <video ref={liveVideoFeed} autoPlay className="live-player"></video>
        ) : null}
        {recordedVideo ? (
          <div className="recorded-player">
            <video className="recorded" src={recordedVideo} controls></video>
            <a download href={recordedVideo}>
              Download Recording
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default VideoRecorder;
