import {React, useEffect, useState} from 'react';
import '../styles/Body.scss';
import Header from './Header';
import { useDataLayerValue } from '../DataLayer'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled'
import FavoriteIcon from '@material-ui/icons/Favorite'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import SongRow from './SongRow'
import Sc from './pics/sc.png'
import Spot  from './pics/spot.png'
import Yt from './pics/yt.png'
import {load} from 'cheerio'
import { SoundCloudScraper } from './SoundcloudScraper';
import Loading from './loading';
import axios from "axios";
import MenuContext from './MenuContext';
import useContextMenu from './useContextMenu';
import PlaylistPage from './PlaylistPage';
import '../styles/SearchPage.scss';

const data = [
  {
    id: 1,
    title: "Play Now",
  },
  {
    id: 2,
    title: "Add to Queue",
  },
];

var opts = {
  maxResults: 20,
  key: 'AIzaSyA1AZNcvUFb9Cz8eF075CeLJAW4mIq_G7s',
  type: "video"
};

function SearchPage({spotify}) {
  //⌄ Data values extracted from data layer
  const [{discover_weekly, search, search_term, page, playlists, device_id, playing, platform, item}, dispatch] = useDataLayerValue()
  let loading = true
  const { clicked, setClicked, points, setPoints } = useContextMenu();

  const [searchPlatform, setSearchPlatform] = useState("Spotify");

  useEffect(() => {
    setTimeout(() => {
      if(page === "Home") {
        dispatch({
          type: "SET_PAGE",
          page: "Home"
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
  }

  // function that updates the playlist being displayed in the body component
  const setBody = (playlist)  => {
    console.log("Playlist:")
    console.log(playlist)
    dispatch({
      type: "SET_DISCOVER_WEEKLY",
      discover_weekly: playlist
    })
    dispatch({
      type: "SET_PAGE",
      page: "Discover Weekly"
    })
  }

  // sets the spotify player to play a new song
  var setPlayer = (link)  => {
    console.log(link);
    console.log("device_id: " + device_id);
    dispatch({
      type: "SET_ITEM",
      item: link
    })
    dispatch({
      type: "SET_PLATFORM",
      platform: "Spotify"
    })
  }

  // sets the soundcloud and youtube player to the correct link
  var setReactPlayer = (track) => {
    if(track.platform === "Soundcloud") {
      dispatch({
        type: "SET_PLATFORM",
        platform: "Soundcloud"
      })
      dispatch({
        type: "SET_SOUNDCLOUD",
        soundcloud: track
      })
    }
    else {
      dispatch({
        type: "SET_PLATFORM",
        platform: "Youtube"
      })
      dispatch({
        type: "SET_YOUTUBE",
        youtube: track
      })
    }
  }

  return (
    <div className="searchPage">
      {(search.length !== 0) &&
        search.map(track => 
          <div id={track.id} onClick={() => (searchPlatform === "Spotify")? setPlayer(track) : setReactPlayer(track)} onContextMenu={(e) => updateContextMenu(e, track)}>
            <SongRow track={track}/>
          </div>
      )}
    </div>
  )
}

export default SearchPage;