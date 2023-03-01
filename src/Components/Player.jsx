import React, { useState } from "react";
import "../styles/Player.scss";
import Sidebar from "./Sidebar.jsx";
import Body from "./Body.jsx";
import Footer from "./Footer.jsx";
import { useActions } from "../store";

function Player({ spotify }) {
  const selectedSong = useActions((state) => state.selectedSong);
  const setSelectedSong = useActions((state) => state.setSelectedSong);
  const setAddToPlaylistClicked = useActions(
    (state) => state.setAddToPlaylistClicked
  );
  const getAddToPlaylistClicked = useActions(
    (state) => state.getAddToPlaylistClicked
  );
  const onSelectedPlaylist = (playlist) => {
    console.log("PlaylistID: ", playlist.id);
    console.log("Song To Add: ", selectedSong);
    setAddToPlaylistClicked(false);
    console.log(getAddToPlaylistClicked());
  };
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
