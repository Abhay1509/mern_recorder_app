import { useState } from "react";
import React from "react";
import VideoRecorder from "../../routes/VideoRecorder";
import AudioRecorder from "../../routes/AudioRecorder";
import { useCookies } from "react-cookie";

const LoggedInComponent = () => {
  let [recordOption, setRecordOption] = useState("video");
  const [cookie, setCookie, removeCookie] = useCookies(["token"]);

  const toggleRecordOption = (type) => {
    return () => {
      setRecordOption(type);
    };
  };
  const handleLogout = () => {
    removeCookie("token", { path: "/" });
    window.location.href = "/login";
  };

  return (
    <div>
      <h1 className="flex justify-center">React Media Recorder</h1>
      <div className="button-flex mt-8">
        <button onClick={toggleRecordOption("video")}>Record Video</button>
        <button onClick={toggleRecordOption("audio")}>Record Audio</button>
      </div>
      <div>
        {recordOption === "video" ? <VideoRecorder /> : <AudioRecorder />}
      </div>
      <div className="flex justify-center my-8">
        <button
          className="bg-green-400 font-semibold p-3 px-10 rounded-full"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default LoggedInComponent;
