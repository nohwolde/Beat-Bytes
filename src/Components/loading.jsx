import React from "react";
import logo from "./logo.png";
import "../styles/loading.scss";
import { accessUrl } from "./spotify";
const Loading = () => {
  return (
    <div className="loading">
      <img src={logo} />
      <a
        href={accessUrl}
        style={{
          padding: 20,
          borderRadius: 99,
          backgroundColor: "#1db954",
          fontWeight: 800,
          color: "white",
          textDecoration: "none",
        }}
      >
        {" "}
        Login to Spotify{" "}
      </a>
    </div>
  );
};

export default Loading;
