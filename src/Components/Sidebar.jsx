import React from 'react';
import './Sidebar.css';
import logo from './favicon.ico'
import SidebarOption from './SidebarOption';
import HomeIcon from "@material-ui/icons/Home"
import SearchIcon from "@material-ui/icons/Search"
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic"
import { useDataLayerValue } from '../DataLayer';

function Sidebar({spotify}) {
  // function that updates the playlist being displayed in the body component
  const [{playlists}, dispatch] = useDataLayerValue();
  const setBody = ({playlist})  => {
    console.log("Playlist:")
    console.log(playlist.id)
    spotify.getPlaylist(playlist.id).then((response) => {
      dispatch({
        type: "SET_DISCOVER_WEEKLY",
        discover_weekly: response,
      })
    });
  }

  // function that modifies the page to either "Search" or "Home"
  const modifyPage  = (page) => {
    if(page === "Search"){
      console.log("Search")
      dispatch({
        type: "SET_DISCOVER_WEEKLY",
        discover_weekly: null
      })
      dispatch({
        type: "SET_PAGE",
        page: "Search"
      })
    }
    else if(page === "Home"){
      console.log("Home")
      console.log(playlists)
      dispatch({
        type: "SET_DISCOVER_WEEKLY",
        discover_weekly: null
      })
      dispatch({
        type: "SET_PAGE",
        page: "Home"
      })
    }
  }

  return (
    <div className="sidebar">
      <img className = "sidebar_logo" src={logo}/>
      <p style = {{marginTop: 30, marginBottom: 40, display: "flex", alignItems: "center"}}><font size = "+2" face = 'verdana'>    </font></p>
      <br></br>
      <br></br>
      <div onClick = {() => modifyPage("Home")}>
        <SidebarOption Icon = {HomeIcon} title = "Home" />
      </div>
      <div onClick = {() => modifyPage("Search")}>
        <SidebarOption Icon = {SearchIcon} title = "Search"/>
      </div>
      <SidebarOption Icon = {LibraryMusicIcon}title = "Your Library" />
      <br></br>
      <strong className = "sidebar_title"> PLAYLISTS</strong>
      <hr />

      {playlists?.items?.map(playlist => (
        <div onClick ={() => setBody({playlist})}>
          <SidebarOption spotify={spotify} playlist={playlist} title = {playlist.name}/>
        </div>
      ))}
    </div>
  )
}


export default Sidebar;