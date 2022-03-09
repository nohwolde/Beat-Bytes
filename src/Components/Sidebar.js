import react from 'react';
import './Sidebar.css';
import logo from './favicon.ico'
import SidebarOption from './SidebarOption';
import HomeIcon from "@material-ui/icons/Home"
import SearchIcon from "@material-ui/icons/Search"
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic"
import { useDataLayerValue } from '../DataLayer';

function Sidebar({spotify}) {
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
  return (
    <div className="sidebar">
      <img className = "sidebar_logo" src={logo}/>
      <p style = {{marginTop: 30, marginBottom: 40, display: "flex", alignItems: "center"}}><font size = "+2" face = 'verdana'>BeatBytes</font></p>
      <br></br>
      <SidebarOption Icon = {HomeIcon} title = "Home" />
      <SidebarOption Icon = {SearchIcon}title = "Search" />
      <SidebarOption Icon = {LibraryMusicIcon}title = "Your Library" />
      <br></br>
      <strong className = "sidebar_title"> PLAYLISTS</strong>
      <hr />

      {playlists?.items?.map(playlist => (
        <div onClick ={() => setBody({playlist})}>
          <SidebarOption spotify={spotify} playlist={playlist} title = {playlist.name} click = {() => setBody({playlist})} />
        </div>
      ))}
    </div>
  )
}


export default Sidebar;