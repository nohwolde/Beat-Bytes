import './Body.css';
import Header from './Header.js';
import { useDataLayerValue } from '../DataLayer'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
import FavoriteIcon from '@material-ui/icons/Favorite'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import SongRow from './SongRow'
import Sc from './pics/sc.png'
import Spot  from './pics/spot.png'
import Yt from './pics/yt.png'
import SoundCloud from "soundcloud-scraper"
import PlaylistIcon from './PlaylistIcon'
// const SoundCloud = require("soundcloud-scraper/src/util");
// const Util = new SoundCloud.Util();
const fs = require("fs");

var opts = {
  maxResults: 20,
  key: 'AIzaSyA1AZNcvUFb9Cz8eF075CeLJAW4mIq_G7s',
  type: "video"
};

function Body({spotify}) {
  //⌄ Data values extracted from data layer
  const [{discover_weekly, search, search_term, page, playlists, token, device_id, link, playing}, dispatch] = useDataLayerValue()
  
  // sets the spotify player to play a new song
  var setPlayer = (link)  => {
    console.log(link)
    console.log("device_id: " + device_id)
    spotify.play({uris: [link]})
    dispatch({
      type: "SET_PLATFORM",
      platform: "Spotify"
    })
  }

  // sets the soundcloud and youtube player to the correct link
  var setReactPlayer = (link) => {
    spotify.pause()
    dispatch({
      type: "SET_PLATFORM",
      platform: "ReactPlayer"
    })
    dispatch({
        type: "SET_LINK",
        link: link
    })
  }
  
  // Conducts the search for all three platforms, and searches 
  // the database to return  all songs that match the search query
  const invokeSearch = (platform) => { // platform can be "Spotify", "Soundcloud", or "Youtube"
    if(platform === "Spotify") {
      let results = [] // results of all the songs that will be added to the search results object
      spotify.searchTracks(search_term).then( // uses built in spotify search function
          function(data) {
              data.tracks.items.forEach(function(track) { // grabs data from each song
                  const song = {
                    platform:"Spotify",
                    title:track.name,
                    artist:track.artists.map(artist => artist.name).join(", "),
                    pic:track.album.images[2].url,
                    link:track.uri
                  }
                  results.push(song)
              })
          }
      )
      console.log(results)
      dispatch({
          type: "SET_SEARCH",
          search: results
      })
      dispatch({
          type: "SET_DISCOVER_WEEKLY",
          discover_weekly: null
      })
    }
    else if(platform === "Soundcloud") {
      let results = []
      const client = new SoundCloud.Client()
      const Util = client.search(search_term)
      // const raw = Util.parseHTML(`https://soundcloud.com/search/sounds?q="${encodeURIComponent(search_term)}`, 
      // {mode:"no-cors"});
      // const html = raw.split("<noscript><ul>")[1].split("</ul>")[1].split("</noscript>")[0];
      // const loaded = Util.loadHTML(html)
      console.log(Util)
      dispatch({
          type: "SET_SEARCH",
          search: results
      })
      dispatch({
          type: "SET_DISCOVER_WEEKLY",
          discover_weekly: null
      })
    }
    else if(platform === "Youtube") {
      let results = []
      var searcher = require('youtube-search');
      console.log(search_term);
      searcher(search_term, opts, function(err, videos) {
        if(err) return console.log(err);
        else {
          videos.forEach(function(video) {
            const song = {
              platform:"Youtube",
              title:video.title,
              artist:video.channelTitle,
              pic:video.thumbnails.default.url,
              link:video.link
            }
            results.push(song)
          });
        }
      });
      console.log(results);
      dispatch({
          type: "SET_SEARCH",
          search: results
      })
      dispatch({
          type: "SET_DISCOVER_WEEKLY",
          discover_weekly: null
      })
    }
  }
  if (discover_weekly === null && page === "Home") {
    return (
      <div className="body">
        <Header spotify = {spotify}/>
        {playlists?.items?.map(playlist => (
            <img src={playlist.images[0].url}></img>
            
        ))}
      </div>
    )
  }
  else if (discover_weekly === null && page === "Search") {
    return (
      <div className="body">
        <Header spotify = {spotify}/>
        <img className = "body_playerLogo" src={Spot} onClick={() => invokeSearch("Spotify")}></img>
        <img className = "body_playerLogo" src={Sc} onClick={() => invokeSearch("Soundcloud")}></img>
        <img className = "body_playerLogo" src={Yt} onClick={() => invokeSearch("Youtube")}></img>
        {(search !== null && search.length > 0) &&
        search.map(track => {
          if(track.platform === "Spotify") {
            return (
              <div onClick={() => setPlayer(track.link)}>
                <SongRow track={track}/>
              </div>
            )
          }
          else {
            return (
              <div onClick={() => setReactPlayer(track.link)}>
                <SongRow track={track}/>
              </div>
            )
          }
        }
        )}
      </div>
    )
  }
  else {
    return (
    <div className="body">
        <Header spotify = {spotify}/> 
        <div className="body_info">
          <img src={discover_weekly?.images[0].url} alt = ""/>
          <div className="body_infoText">
            <strong>PLAYLIST</strong>
            <h2>{discover_weekly?.name}</h2>
            <p>{discover_weekly?.description}</p>
          </div>
        </div>
        <div className="body_songs">
          <div className="body_icons">
            <PlayCircleFilledIcon className="body_shuffle"/>
            <FavoriteIcon fontSize="large"/>
            <MoreHorizIcon />
          </div>
            {/*List of songs */}
            {discover_weekly?.tracks.items.map((item) => (
              <div onClick={() => setPlayer(item.track.uri)}>
                <SongRow track={item.track}/>
              </div>
            ))}
        </div>
    </div>
    )
  }
}

export default Body;