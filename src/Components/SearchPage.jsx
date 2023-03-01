import React, { useEffect } from "react";
import "../styles/Body.scss";
import { useDataLayerValue } from "../DataLayer";
import SongRow from "./SongRow.jsx";
import useContextMenu from "./useContextMenu.jsx";
import "../styles/SearchPage.scss";
import uniqueId from "lodash/uniqueId";

function SearchPage({ spotify }) {
  //⌄ Data values extracted from data layer
  const [{ search, page, device_id }, dispatch] = useDataLayerValue();
  const { clicked, setClicked, points, setPoints } = useContextMenu();

  useEffect(() => {
    setTimeout(() => {
      if (page === "Home") {
        dispatch({
          type: "SET_PAGE",
          page: "Home",
        });
      }
    }, 1500);
  }, []);

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
    <div className="searchPage">
      {search.length !== 0 &&
        search.map((track) => (
          <div
            key={uniqueId("search-")}
            onClick={() => {
              addFrontQueue({
                item: track,
                platform: !track.platform ? "Spotify" : track.platform,
              });
            }}
            onContextMenu={(e) => updateContextMenu(e, track)}
          >
            <SongRow key={uniqueId("songRow-")} track={track} />
          </div>
        ))}
    </div>
  );
}

export default SearchPage;