import React from "react";
import "../styles/HomePage.scss";
import uniqueId from "lodash/uniqueId";
import { useActions, useSpotify } from "../store";
import playlistImg from "./pics/mImg.jpeg";

function HomePage({ spotify }) {
  //⌄ Data values extracted from data layer
  const playlists = useSpotify((state) => state.playlists);
  const setDiscoverWeekly = useActions((state) => state.setDiscoverWeekly);
  const setPage = useActions((state) => state.setPage);

  // function that updates the playlist being displayed in the body component
  const setBody = (playlist) => {
    console.log("Playlist:");
    console.log(playlist.id);
    setDiscoverWeekly(playlist);
    setPage("Playlist");
  };

  return (
    <div className="homePage">
      <h1>Playlists</h1>
      <hr />
      <div className="homePage_playlists">
        {playlists?.map((playlist) => (
          <div
            key={uniqueId("playlist-")}
            className="homePage_playlist_box"
            onClick={() => setBody(playlist)}
          >
            <img
              key={uniqueId("playlistImg-")}
              alt=""
              src={
                playlist.images[0] && playlist.images[0] !== ""
                  ? playlist.images[0]
                  : playlistImg
              }
            ></img>
            <h4 key={uniqueId("playlistName-")}>{playlist.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
