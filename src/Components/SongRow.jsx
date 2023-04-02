import React, { useRef, useState } from "react";
import "../styles/SongRow.scss";
import { CloudDownloadOutlined } from "@material-ui/icons";
import queueFront from "./pics/queueTop.svg";
import addPlaylist from "./pics/addPlaylist.png";
import trash from "./pics/trash.svg";
import { useQueue } from "../store";
import { useActions } from "../store";
import { useSpotify } from "../store";
import { useEffect } from "react";
import soundcloudDark from "./pics/soundcloudDark.svg";
import ytDark from "./pics/ytDark.svg";
import spotDark from "./pics/spotDark.svg";
import playlistImg from "./pics/mImg.jpeg";
import removePlaylist from "./pics/removePlaylist.svg";

function SongRow({
  track,
  search = true,
  popup,
  togglePopup,
  setPopupType,
  queuePage = false,
  platform,
  setRemoveTrack,
  playlist = null,
}) {
  const [deletePopup, toggleDeletePopup] = useState(false);

  const currentPlaylist = useQueue((state) => state.playlist);
  const pop = useQueue((state) => state.pop);
  const addFrontQueue = useQueue((state) => state.addFrontQueue);
  const addQueue = useQueue((state) => state.addQueue);
  const getFullQueue = useQueue((state) => state.getFullQueue);
  const playlists = useSpotify((state) => state.playlists);
  const sidebarRef = useRef(null);
  const setAddToPlaylistClicked = useActions(
    (state) => state.setAddToPlaylistClicked
  );
  const setSelectedSong = useActions((state) => state.setSelectedSong);
  const getSelectedSong = useActions((state) => state.getSelectedSong);
  let iconsClass = popup ? "songRow_controlsBlur" : "songRow_controls";

  useEffect(() => {
    iconsClass = popup ? "songRow_controlsBlur" : "songRow_controls";
  }, [popup]);

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

  if (track.platform === "Spotify") {
    return (
      <div className="songRow">
        {(
          !queuePage || track.item.is_local
            ? track.item.is_local === true
            : false
        ) ? (
          <CloudDownloadOutlined
            fontSize="large"
            className="songRow_download"
          />
        ) : (
          <img
            className="songRow_search"
            src={
              track.item.album.images[0]
                ? track.item.album.images[0]
                : playlistImg
            }
            alt=""
          />
        )}
        <div className="songRow_info">
          <h1>{track.item.name}</h1>
          {(track.item.is_local ? track.item.is_local === false : true) && (
            <p>
              {track.item.artists.map((artist) => artist.name).join(", ")} -{" "}
              {track.item.album.name}{" "}
            </p>
          )}
        </div>
        {(queuePage || track.item.is_local
          ? track.item.is_local === false
          : true && !popup) && (
          <div className="songRow_controls">
            <img src={spotDark} className="songRow_platform"></img>
            <div
              onClick={(e) => {
                e.stopPropagation();
                console.log("Queue Front");
                console.log(getFullQueue());
                addFrontQueue(track);
              }}
              aria-label="Play Next"
            >
              <img className="songRow_controlsIcons" src={queueFront} alt="" />
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                console.log("Queue Last");
                console.log(track);
                addQueue(track);
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
              onClick={(e) => {
                e.stopPropagation();
                setPopupType("Add");
                console.log("Add to Playlist");
                console.log("Selected Song: ", track);
                setSelectedSong(track);
                togglePopup(true);
              }}
            >
              <img
                className="songRow_controlsAdd"
                src={addPlaylist}
                alt=""
                aria-label="Add to Playlist"
              />
            </div>
            {(queuePage || playlist !== null) && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setRemoveTrack(track);
                  console.log("Remove track: ", track);
                  if (!queuePage) {
                    setPopupType("DeletePlaylist");
                    togglePopup(true);
                  }
                }}
              >
                <img
                  className="songRow_controlsDelete"
                  src={trash}
                  alt=""
                  aria-label="Delete"
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="songRow">
        {search ? ( // if searching make the image a bit larger
          <img
            className="songRow_search"
            src={track.pic ? track.pic : playlistImg}
            alt=""
          />
        ) : (
          <img
            className="songRow_album"
            src={track.pic ? track.pic : playlistImg}
            alt=""
          />
        )}
        <div className="songRow_info">
          <h1>{track.title}</h1>
          <p>{track.artist}</p>
        </div>
        {!popup && (
          <div className={iconsClass}>
            <img
              src={platform === "Soundcloud" ? soundcloudDark : ytDark}
              className="songRow_platform"
            ></img>
            <div
              onClick={(e) => {
                e.stopPropagation();
                addFrontQueue(track);
                console.log(track);
              }}
              aria-label="Play Next"
            >
              <img className="songRow_controlsIcons" src={queueFront} alt="" />
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                addQueue(track);
                console.log(track);
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
              onClick={(e) => {
                e.stopPropagation();
                console.log("Add to Playlist");
                console.log("Selected Song: ", track);
                setPopupType("Add");
                setSelectedSong(track);
                togglePopup(true);
              }}
            >
              <img
                className="songRow_controlsAdd"
                src={addPlaylist}
                alt=""
                aria-label="Add to Playlist"
              />
            </div>
            {(queuePage || playlist !== null) && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setRemoveTrack(track);
                  console.log("Remove track: ", track);
                  if (!queuePage) {
                    setPopupType("DeletePlaylist");
                    togglePopup(true);
                  }
                }}
              >
                <img
                  className="songRow_controlsDelete"
                  src={trash}
                  alt=""
                  aria-label="Remove from Queue"
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default SongRow;
