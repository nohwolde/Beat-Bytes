import React from "react";
import logo from "./logo.png";
import "../styles/Loading.scss";
import { accessUrl } from "./spotify";
import { useSpotify } from "../store";
const Loading = () => {
  const setToken = useSpotify((state) => state.setToken);
  const loginTest = () => {
    console.log("test");
    setToken("");
  };
  return (
    <div className="loading">
      <div className="loginTitle" onClick={() => loginTest()}>
        {" "}
        User Options{" "}
      </div>
      <img className="loginLogo" src={logo} />
      <div className="loginInfo"> Try Beatbytes without Account</div>
      <div className="loginTest" onClick={() => loginTest()}>
        {" "}
        Try with Test User{" "}
      </div>
      <br></br>
      <div className="loginInfo"> Or Login/Sign Up with Account </div>
      <div className="loginBeatbytesDisabled" onClick={() => loginTest()}>
        {" "}
        Login/Sign Up with Beatbytes{" "}
      </div>
      <a href={accessUrl} className="loginSpotify">
        {" "}
        Login with Spotify{" "}
      </a>
    </div>
  );
};

export default Loading;
