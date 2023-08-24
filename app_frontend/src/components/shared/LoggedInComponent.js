import { useState } from "react";
import React from "react";
import VideoRecorder from "../../routes/VideoRecorder";
import AudioRecorder from "../../routes/AudioRecorder";
import { useCookies } from "react-cookie";

const LoggedInComponent = () => {
  let [recordOption, setRecordOption] = useState("video");
  const [cookie, , removeCookie] = useCookies(["token"]);

  const toggleRecordOption = (type) => {
    return () => {
      setRecordOption(type);
    };
  };
  const handleLogout = () => {
    removeCookie("token");
    window.location.href = "/login";
  };

  return (
    <div>
      <h1>React Media Recorder</h1>
      <div className="button-flex">
        <button onClick={toggleRecordOption("video")}>Record Video</button>
        <button onClick={toggleRecordOption("audio")}>Record Audio</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div>
        {recordOption === "video" ? <VideoRecorder /> : <AudioRecorder />}
      </div>
    </div>
  );
};

export default LoggedInComponent;
