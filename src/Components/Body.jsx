import {React, useEffect} from 'react';
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
import SearchPage from './SearchPage';
import HomePage from './HomePage';

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

function Body({spotify}) {
  //⌄ Data values extracted from data layer
  const [{discover_weekly, search, search_term, page, playlists, device_id, playing, platform, item}, dispatch] = useDataLayerValue()
  let loading = true
  const { clicked, setClicked, points, setPoints } = useContextMenu();

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

  return (
    <div className="body" id='body'>
      <Header spotify = {spotify}/>
      <MenuContext data={data} click={clicked} pointX={points.x} pointY={points.y} />
      {
        page === "Home" ? <HomePage spotify={spotify} /> :
        page === "Search" ? <SearchPage spotify={spotify} /> :
        page === "Discover Weekly" ? <PlaylistPage spotify={spotify} />
        : <div></div>
      }
    </div>
  )
}

export default Body;