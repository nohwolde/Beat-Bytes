import React, { useEffect, useState } from "react";
import "../styles/Body.scss";
import Header from "./Header.jsx";
import PlaylistPage from "./PlaylistPage.jsx";
import SearchPage from "./SearchPage.jsx";
import HomePage from "./HomePage.jsx";
import { useActions } from "../store";
import QueuePage from "./QueuePage.jsx";

function Body({
  spotify,
  popup,
  togglePopup,
  setPopupType,
  setRemoveTrack,
  removeFromPlaylist,
}) {
  const [loading, setLoading] = useState(false);
  const page = useActions((state) => state.page);

  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  return (
    <div className="body" id="body">
      <Header spotify={spotify} setLoading={setLoading} />
      {page === "Home" ? (
        <HomePage spotify={spotify} />
      ) : page === "Search" ? (
        <SearchPage
          spotify={spotify}
          popup={popup}
          togglePopup={togglePopup}
          loading={loading}
          setPopupType={setPopupType}
          SearchPage
        />
      ) : page === "Playlist" ? (
        <PlaylistPage
          spotify={spotify}
          popup={popup}
          togglePopup={togglePopup}
          setPopupType={setPopupType}
          setRemoveTrack={setRemoveTrack}
        />
      ) : (
        <QueuePage
          spotify={spotify}
          popup={popup}
          togglePopup={togglePopup}
          setPopupType={setPopupType}
          setRemoveTrack={setRemoveTrack}
          removeFromPlaylist={removeFromPlaylist}
        />
      )}
    </div>
  );
}

export default Body;
