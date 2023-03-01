import React, { useRef } from "react";
import "../styles/SongRow.scss";
import { CloudDownloadOutlined } from "@material-ui/icons";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import QueueMusicIcon from "@material-ui/icons/QueueMusic";
import queueFront from "./pics/queueTop.svg";
import AddBoxIcon from "@material-ui/icons/AddBox";
import addPlaylist from "./pics/addPlaylist.png";
import useQueue from "../store";
import { useActions } from "../store";
import { useSpotify } from "../store";

function SongRow({ track, search = true }) {
  const addFrontQueue = useQueue((state) => state.addFrontQueue);
  const addQueue = useQueue((state) => state.addQueue);
  const playlists = useSpotify((state) => state.playlists);
  const sidebarRef = useRef(null);
  const setAddToPlaylistClicked = useActions(
    (state) => state.setAddToPlaylistClicked
  );
  const setSelectedSong = useActions((state) => state.setSelectedSong);
  const getSelectedSong = useActions((state) => state.getSelectedSong);

  const handleAddToPlaylistClick = (playlistID, track) => {
    console.log("Adding to playlist: ", playlistID);
    console.log("Track: ", track);

    // Call the onAddToPlaylist function passed down as a prop
    // to trigger the setCurrentTab function in the PlaylistPage component
    addToPlaylist();

    // Call the addToPlaylist function to add the track to the selected playlist
    addToPlaylist(playlistID, track);
  };

  const addToPlaylist = async (playlistID, track) => {
    await axios.post("/db/user/addToPlaylist", { playlistID, track });
  };

  const handleAddToPlaylist = async (playlistID, track) => {
    console.log("Adding to playlist: ", playlistID);
    console.log("Track: ", track);
    await axios.post("/db/user/addToPlaylist", { playlistID, track });
  };

  if (typeof track.track !== "undefined" || track.type === "track") {
    return (
      <div
        className={
          !(track.is_local ? track.is_local === false : true) ||
          !(getSelectedSong()?.id === track.id)
            ? "songRow  blurSong"
            : "songRow"
        }
      >
        {(track.is_local ? track.is_local === true : false) ? (
          <CloudDownloadOutlined
            fontSize="large"
            className="songRow_download"
          />
        ) : (
          <img
            className="songRow_search"
            src={track.album.images[0].url}
            alt=""
          />
        )}
        <div className="songRow_info">
          <h1>{track.name}</h1>
          {(track.is_local ? track.is_local === false : true) && (
            <p>
              {track.artists.map((artist) => artist.name).join(", ")} -{" "}
              {track.album.name}{" "}
            </p>
          )}
        </div>
        {(track.is_local ? track.is_local === false : true) && (
          <div className="songRow_controls">
            <div
              onClick={() => {
                console.log("Queue Front");
                addFrontQueue({ item: track, platform: "Spotify" });
              }}
              aria-label="Play Next"
            >
              <img className="songRow_controlsIcons" src={queueFront} alt="" />
            </div>
            <div
              onClick={() => {
                console.log("Queue Last");
                addQueue({ item: track, platform: "Spotify" });
              }}
              aria-label="Play Last"
            >
              <img
                className="songRow_controlsIcons upsideDown"
                src={queueFront}
                alt=""
              />
            </div>
            <div
              onClick={() => {
                console.log("Add to Playlist");
                setAddToPlaylistClicked(true);
                console.log("Selected Song: ", track);
                setSelectedSong(track);
                document.body.style.opacity = 1;
              }}
            >
              <img
                className="songRow_controlsAdd"
                src={addPlaylist}
                alt=""
                aria-label="Add to Playlist"
              />
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="songRow">
        {search ? ( // if searching make the image a bit larger
          <img className="songRow_search" src={track.pic} alt="" />
        ) : (
          <img className="songRow_album" src={track.pic} alt="" />
        )}
        <div className="songRow_info">
          <h1>{track.title}</h1>
          <p>{track.artist}</p>
        </div>
        <div className="songRow_controls">
          <div onClick={() => addFrontQueue(track)} aria-label="Play Next">
            <img className="songRow_controlsIcons" src={queueFront} alt="" />
          </div>
          <div onClick={() => addQueue(track)} aria-label="Play Last">
            <img
              className="songRow_controlsIcons upsideDown"
              src={queueFront}
              alt=""
            />
          </div>
          <img
            className="songRow_controlsIcons"
            src={addPlaylist}
            alt=""
            aria-label="Add to Playlist"
          />
        </div>
      </div>
    );
  }
}

export default SongRow;
