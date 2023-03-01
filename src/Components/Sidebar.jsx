import React, { useEffect } from "react";
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

function Sidebar({ spotify }) {
  // function that updates the playlist being displayed in the body component
  const [{}, dispatch] = useDataLayerValue();
  const playlists = useSpotify((state) => state.playlists);
  const [className, setClassName] = useState("side");
  const setAddToPlaylistClicked = useActions(
    (state) => state.setAddToPlaylistClicked
  );
  const getAddToPlaylistClicked = useActions(
    (state) => state.getAddToPlaylistClicked
  );
  const selectedSong = useActions((state) => state.selectedSong);
  const getSelectedSong = useActions((state) => state.getSelectedSong);

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
    dispatch({
      type: "SET_DISCOVER_WEEKLY",
      discover_weekly: playlist,
    });
    dispatch({
      type: "SET_PAGE",
      page: "Discover Weekly",
    });
  };

  const createPlaylist = () => {};

  // function that modifies the page to either "Search" or "Home"
  const modifyPage = (page) => {
    if (page === "Search") {
      console.log("Search");
      dispatch({
        type: "SET_DISCOVER_WEEKLY",
        discover_weekly: null,
      });
      dispatch({
        type: "SET_PAGE",
        page: "Search",
      });
    } else if (page === "Home") {
      console.log("Home");
      console.log(playlists);
      dispatch({
        type: "SET_DISCOVER_WEEKLY",
        discover_weekly: null,
      });
      dispatch({
        type: "SET_PAGE",
        page: "Home",
      });
    }
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
      <div className={getAddToPlaylistClicked() ? "blurred" : ""}>
        <div onClick={() => modifyPage("Home")}>
          <SidebarOption Icon={HomeIcon} title="Home" />
        </div>
        <div onClick={() => modifyPage("Search")}>
          <SidebarOption Icon={SearchIcon} title="Search" />
        </div>
        <SidebarOption Icon={LibraryMusicIcon} title="Your Library" />
        <br></br>
        <div onClick={() => createPlaylist()}>
          <SidebarOption Icon={AddBox} title="Create Playlist" />
        </div>
        <strong className="sidebar_title"> PLAYLISTS</strong>
        <hr />
      </div>
      <div id="playlistSection">
        {playlists?.map((playlist) => (
          <div
            key={playlist.id}
            id="playlistSection"
            onClick={
              getAddToPlaylistClicked()
                ? () => onSelectedPlaylist(playlist)
                : () => setBody(playlist)
            }
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
    </div>
  );
}

export default Sidebar;
