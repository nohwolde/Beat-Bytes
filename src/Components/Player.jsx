import React from "react";
import "../styles/Player.scss";
import Sidebar from "./Sidebar.jsx";
import Body from "./Body.jsx";
import Footer from "./Footer.jsx";

function Player({ spotify }) {
  return (
    <div
      className="player"
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <div className="player_body">
        <Sidebar spotify={spotify} />
        <Body spotify={spotify} />
        <Footer spotify={spotify} />
      </div>
    </div>
  );
}

export default Player;
