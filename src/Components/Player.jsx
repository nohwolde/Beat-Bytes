import React, { useState, label } from "react";
import "../styles/Player.scss";
import Sidebar from "./Sidebar.jsx";
import Body from "./Body.jsx";
import Footer from "./Footer.jsx";
import { useSpotify } from "../store";
import { useActions } from "../store";
import { useQueue } from "../store";
import SidebarOption from "./SidebarOption.jsx";
import uniqueId from "lodash/uniqueId";
import axios from "axios";
import CancelIcon from "@material-ui/icons/Cancel";
import addIcon from "./pics/addPlaylist.png";
import trash from "./pics/trash.svg";
import { useEffect } from "react";

function Player({ spotify }) {
  const playlists = useSpotify((state) => state.playlists);
  const getNumberOfBeatbytes = useSpotify(
    (state) => state.getNumberOfBeatbytes
  );
  const getSelectedSong = useActions((state) => state.getSelectedSong);
  const addToPlaylist = useSpotify((state) => state.addToPlaylist);
  const user = useSpotify((state) => state.user);
  const selectedSong = useActions((state) => state.selectedSong);
  const [removeTrack, setRemoveTrack] = useState(null);
  const discover_weekly = useActions((state) => state.discover_weekly);
  const setDiscoverWeekly = useActions((state) => state.setDiscoverWeekly);
  const getDiscoverWeekly = useActions((state) => state.getDiscoverWeekly);
  const playlist = useQueue((state) => state.playlist);
  const setPlaylist = useQueue((state) => state.setPlaylist);
  const getPlaylist = useQueue((state) => state.getPlaylist);
  const addToBeatbytes = useSpotify((state) => state.addToBeatbytes);
  const addPlaylist = useSpotify((state) => state.addPlaylist);
  const removeFromStorePlaylist = useSpotify(
    (state) => state.removeFromStorePlaylist
  );

  const [playlistName, setPlaylistName] = useState("");
  const [popup, togglePopup] = useState(false);
  const [popupType, setPopupType] = useState("Add");

  useEffect(() => {
    setRemoveTrack(removeTrack);
  }, [removeTrack]);

  useEffect(() => {
    setTimeout(() => {
      setPlaylistName(
        "Beatbytes Playlist #" + getNumberOfBeatbytes()
          ? getNumberOfBeatbytes() + 1
          : 1
      );
    }, 3000);
  }, [getNumberOfBeatbytes()]);

  const addToDB = async (playlist) => {
    console.log("Playlist: ", playlist);
    if (playlist.beatbytes) {
      console.log("Beatbytes Playlist: ", playlist);
    }
    const song = getSelectedSong();
    console.log("Song To Add: ", song);
    togglePopup(false);
    // if song's platform is spotify use spotify api endpoint to add song to playlist
    console.log("Adding to DB", song, playlist);
    addToBeatbytes(playlist.id, song);
    await axios
      .post("/db/user/addToPlaylist", {
        id: user.id,
        playlistID: playlist.id,
        song: song,
      })
      .then((res) => console.log(res));
  };

  const createPlaylist = async (playlistName) => {
    console.log("Creating Playlist: ", playlistName);
    console.log("User: ", user);

    const playlistToAdd = {
      owner: { link: user.id },
      name: playlistName,
      platform: "Beatbytes",
      images: [],
      description: "",
      playlist: [],
    };
    addPlaylist(playlistToAdd); // add playlist to store
    await axios.post("/db/user/createPlaylist", {
      //add playlist to db
      id: user.id,
      playlist: playlistToAdd,
    });
  };

  const removeFromPlaylist = (playlist) => {
    console.log("Removing song: ", removeTrack);
    const songID = removeTrack.item.id;
    // console.log("Removing song from playlist: ", id);
    // const newPlaylist = playlist;
    // const newItems = playlist.playlist.filter((song) => song.id !== id);
    // console.log("Playlist: ", playlist);
    // setPlaylist({ ...playlist, playlist: newItems});
    // console.log(getPlaylist());
    // newPlaylist.playlist = newItems;
    // console.log("New Playlist: ", newPlaylist);

    // update playlist in db
    axios.post("/db/user/removeFromPlaylist", {
      userID: user.id,
      playlistID: playlist.id,
      songID: songID,
    });
    removeFromStorePlaylist(playlist.id, songID);
  };

  return (
    <div
      className="player"
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      {popup && (
        <div className="playerPopupBg">
          <div className="playerPopup">
            <div className="popupHeader">
              <h1>
                {popupType === "Add"
                  ? "Add to playlist "
                  : popupType === "Create"
                  ? "Create a playlist"
                  : `Delete from ${
                      popupType === "DeletePlaylist" ? "playlist" : "queue"
                    }`}
              </h1>
            </div>
            <img
              src={
                popupType === "Add"
                  ? addIcon
                  : popupType === "Create"
                  ? addIcon
                  : trash
              }
              className={
                popupType === "Add" || popupType === "Create"
                  ? "popupIcon"
                  : "deleteLogo"
              }
            ></img>
            <CancelIcon
              onClick={() => togglePopup(false)}
              fontSize="large"
              className="cancelIcon"
            />
            {popupType === "Add" && (
              <div className="popupBody">
                <div className="song">
                  <img
                    className="song_pic"
                    src={selectedSong.item.album?.images[0] || selectedSong.pic}
                    alt=""
                  ></img>
                  <div className="song_info">
                    <h4>
                      {selectedSong.item.name
                        ? selectedSong.item.name
                        : selectedSong.title}
                    </h4>
                    <p>
                      {selectedSong.item.artists
                        ? selectedSong.item.artists
                            .map((artist) => artist.name)
                            .join(", ")
                        : selectedSong.artist}{" "}
                      -{" "}
                      {selectedSong.item.album?.name ||
                        selectedSong.album?.publisher_metadata
                          ?.album_title}{" "}
                    </p>
                  </div>
                </div>
                <h3>Select the playlist to add to</h3>
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    id="playlistSection"
                    onClick={() => addToDB(playlist)}
                  >
                    <SidebarOption
                      key={uniqueId("playlist-")}
                      id="playlistSection"
                      playlist={playlist}
                      title={playlist.name}
                    />
                  </div>
                ))}
              </div>
            )}
            {popupType === "Create" && (
              <div className="popupBody">
                <div>
                  <label>
                    Playlist Name
                    <input
                      type="text"
                      value={playlistName}
                      onChange={(e) => setPlaylistName(e.target.value)}
                    />
                  </label>
                </div>
                <SidebarOption id="playlist" title={playlistName} />
                <div
                  onClick={() => {
                    createPlaylist(playlistName);
                    togglePopup(false);
                  }}
                  className="createPlaylist"
                >
                  Create
                </div>
              </div>
            )}
            {popupType.startsWith("Delete") && (
              <div className="popupBody">
                <div className="song">
                  <img
                    className="song_pic"
                    src={removeTrack.item.album?.images[0] || removeTrack.pic}
                    alt=""
                  ></img>
                  <div className="song_info">
                    <h4>
                      {removeTrack.item.name
                        ? removeTrack.item.name
                        : removeTrack.title}
                    </h4>
                    <p>
                      {removeTrack.item.artists
                        ? removeTrack.item.artists
                            .map((artist) => artist.name)
                            .join(", ")
                        : removeTrack.artist}{" "}
                      -{" "}
                      {removeTrack.item.album?.name ||
                        removeTrack.album?.publisher_metadata?.album_title}{" "}
                    </p>
                  </div>
                </div>
                <h3>Are you sure you want to remove this song?</h3>
                <div
                  onClick={() => {
                    togglePopup(false);
                    removeFromPlaylist(getDiscoverWeekly());
                  }}
                >
                  <img
                    className="deleteIcon"
                    src={trash}
                    alt=""
                    aria-label="Remove from Queue"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className={popup ? "player_body player_inactive" : "player_body"}>
        <Sidebar
          spotify={spotify}
          popup={popup}
          togglePopup={togglePopup}
          setPopupType={setPopupType}
        />
        <Body
          spotify={spotify}
          popup={popup}
          togglePopup={togglePopup}
          setPopupType={setPopupType}
          setRemoveTrack={setRemoveTrack}
          removeTrack={removeTrack}
          removeFromPlaylist={removeFromPlaylist}
        />
        <Footer spotify={spotify} />
      </div>
    </div>
  );
}

export default Player;
