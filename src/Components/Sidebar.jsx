import React, { useEffect, useState } from "react";
import "../styles/Sidebar.scss";
import logo from "./logo.png";
import SidebarOption from "./SidebarOption.jsx";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import { useDataLayerValue } from "../DataLayer";
import { AddBox } from "@material-ui/icons";
import uniqueId from "lodash/uniqueId";
import { useSpotify } from "../store";
import { useActions } from "../store";
import axios from "axios";
import playlistImg from "./pics/mImg.jpeg";

function Sidebar({ spotify, popup, togglePopup, setPopupType }) {
  // function that updates the playlist being displayed in the body component
  const [{}, dispatch] = useDataLayerValue();
  const user = useSpotify((state) => state.user);
  const playlists = useSpotify((state) => state.playlists);
  const setPlaylists = useSpotify((state) => state.setPlaylists);
  const setAddToPlaylistClicked = useActions(
    (state) => state.setAddToPlaylistClicked
  );
  const getAddToPlaylistClicked = useActions(
    (state) => state.getAddToPlaylistClicked
  );
  const getSelectedSong = useActions((state) => state.getSelectedSong);
  const setPage = useActions((state) => state.setPage);
  const setDiscoverWeekly = useActions((state) => state.setDiscoverWeekly);

  // useEffect(() => {
  //   setPlaylists(playlists);
  //   console.log(playlists);
  // }, [playlists]);

  const onSelectedPlaylist = (playlist) => {
    console.log("PlaylistID: ", playlist.id);
    console.log("Song To Add: ", getSelectedSong());
    setAddToPlaylistClicked(false);
    console.log(getAddToPlaylistClicked());
  };

  document.addEventListener("click", (e) => {
    if (getAddToPlaylistClicked()) {
      if (e.target.id !== "playlistSection") {
        setAddToPlaylistClicked(false);
      }
    }
  });

  const setBody = (playlist) => {
    console.log("Playlist:");
    console.log(playlist.id);
    setDiscoverWeekly(playlist);
    setPage("Playlist");
  };

  const createPlaylist = () => {
    togglePopup(true);
    setPopupType("Create");
  };

  return (
    <div className="sidebar">
      <img className="sidebar_logo" alt="" src={logo} />
      <p
        style={{
          marginTop: 30,
          marginBottom: 40,
          display: "flex",
          alignItems: "center",
        }}
      >
        <font size="+2" face="verdana"></font>
      </p>
      <br></br>
      <div>
        <div onClick={() => setPage("Home")}>
          <SidebarOption Icon={HomeIcon} title="Home" />
        </div>
        <div onClick={() => setPage("Search")}>
          <SidebarOption Icon={SearchIcon} title="Search" />
        </div>
        <div onClick={() => setPage("Your Library")}>
          <SidebarOption Icon={LibraryMusicIcon} title="Your Library" />
        </div>
        <div onClick={() => createPlaylist()}>
          <SidebarOption Icon={AddBox} title="Create Playlist" />
        </div>
        <strong className="sidebar_title"> PLAYLISTS</strong>
        <hr />
      </div>
      <div id="playlistSection">
        {playlists?.map((playlist) => (
          <div
            key={uniqueId("playlist-")}
            id="playlistSection"
            onClick={() => setBody(playlist)}
          >
            <SidebarOption
              id="playlist"
              playlist={playlist}
              title={playlist.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
