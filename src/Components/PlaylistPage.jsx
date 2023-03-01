import React from "react";
import "../styles/Body.scss";
import { useDataLayerValue } from "../DataLayer";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import FavoriteIcon from "@material-ui/icons/Favorite";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import SongRow from "./SongRow.jsx";
import useContextMenu from "./useContextMenu.jsx";
import "../styles/PlaylistPage.scss";
import uniqueId from "lodash/uniqueId";
import useQueue from "../store";
import { useActions } from "../store";
import shuffle from "./pics/shuffle.png";
import { useEffect } from "react";
import axios from "axios";
import { useSpotify } from "../store";

function PlaylistPage({ spotify }) {
  //⌄ Data values extracted from data layer
  const [{ discover_weekly, device_id, playing, item }, dispatch] =
    useDataLayerValue();
  const { clicked, setClicked, points, setPoints } = useContextMenu();
  const queue = useQueue((state) => state.queue);
  const addQueue = useQueue((state) => state.addQueue);
  const addFrontQueue = useQueue((state) => state.addFrontQueue);
  const skip = useActions((state) => state.skip);
  const reverse = useActions((state) => state.reverse);
  const back = useQueue((state) => state.back);
  const getAddToPlaylistClicked = useActions(
    (state) => state.getAddToPlaylistClicked
  );

  const handlePlaylist = (playlist) => {
    for (let i = 0; i < playlist.tracks.items.length; i++) {
      if (playlist.tracks.items[i].track.track !== undefined) {
        const newItem = { item: playlist.tracks.items[i], platform: "Spotify" };
        addQueue(newItem);
        console.log("added to queue", newItem);
      }
    }
    console.log(queue);
  };

  const updateContextMenu = (e, item) => {
    const song = document.getElementById(item.id);
    setClicked(true);
    setPoints({
      x: e.clientX - song.scrollTop,
      y: e.clientY,
    });
    console.log("Right Click", e.pageX - song.scrollTop, e.pageY);
  };

  // function that updates the playlist being displayed in the body component
  const setBody = (playlist) => {
    console.log("Playlist:");
    console.log(playlist);
    dispatch({
      type: "SET_DISCOVER_WEEKLY",
      discover_weekly: playlist,
    });
    dispatch({
      type: "SET_PAGE",
      page: "Discover Weekly",
    });
  };

  // sets the spotify player to play a new song
  var setPlayer = (link) => {
    console.log(link);
    console.log("device_id: " + device_id);
    dispatch({
      type: "SET_ITEM",
      item: link,
    });
    dispatch({
      type: "SET_PLATFORM",
      platform: "Spotify",
    });
  };

  // sets the soundcloud and youtube player to the correct link
  var setReactPlayer = (track) => {
    if (track.platform === "Soundcloud") {
      dispatch({
        type: "SET_PLATFORM",
        platform: "Soundcloud",
      });
      dispatch({
        type: "SET_SOUNDCLOUD",
        soundcloud: track,
      });
    } else {
      dispatch({
        type: "SET_PLATFORM",
        platform: "Youtube",
      });
      dispatch({
        type: "SET_YOUTUBE",
        youtube: track,
      });
    }
  };

  return (
    <div className="playlistPage">
      <div
        className={
          getAddToPlaylistClicked()
            ? "blurTitle playlistPage_info"
            : "playlistPage_info"
        }
      >
        <img src={discover_weekly?.images[0].url} alt="" />
        <div className="playlistPage_infoText">
          <strong>PLAYLIST</strong>
          <h2>{discover_weekly?.name}</h2>
          <p>{discover_weekly?.description}</p>
        </div>
      </div>
      <div className="playlistPage_songs">
        <div
          className={
            getAddToPlaylistClicked()
              ? "blurTitle playlistPage_icons"
              : "playlistPage_icons"
          }
        >
          {playing && discover_weekly.id === item.id ? (
            <PauseCircleFilledIcon
              className="playlistPage_play"
              onClick={() => setPlayer(discover_weekly)}
            />
          ) : (
            <PlayCircleFilledIcon
              className="playlistPage_play"
              onClick={() => handlePlaylist(discover_weekly)}
            />
          )}
          <img
            src={shuffle}
            className="playlistPage_shuffle"
            onClick={() => {}}
          />
          <FavoriteIcon fontSize="large" />
          <MoreHorizIcon />
        </div>
        {/*List of songs */}
        {discover_weekly?.tracks.items.map((item) => {
          return typeof item.track.track !== "undefined" ? (
            <div
              id={item.track.id}
              key={item.track.id}
              // onClick={() => {
              //   addFrontQueue({ item: item, platform: "Spotify" });
              //   skip();
              // }}
              onContextMenu={(e) => updateContextMenu(e, item.track)}
            >
              <SongRow
                key={uniqueId("songRow-")}
                track={item.track}
                search={false}
              />
            </div>
          ) : (
            // These are songs that are downloaded on the users local computer,
            // and therefore cannot be embedded into the spotify embedded player iframe.
            <SongRow track={item.track} />
          );
        })}
      </div>
    </div>
  );
}

export default PlaylistPage;
