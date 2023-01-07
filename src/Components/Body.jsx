import React from 'react';
import './Body.css';
import Header from './Header';
import { useDataLayerValue } from '../DataLayer'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
import FavoriteIcon from '@material-ui/icons/Favorite'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import SongRow from './SongRow'
import Sc from './pics/sc.png'
import Spot  from './pics/spot.png'
import Yt from './pics/yt.png'
import {load} from 'cheerio'
import { SoundCloudScraper } from 'scrape-soundcloud';
import Loading from './loading';
import axios from "axios";

var opts = {
  maxResults: 20,
  key: 'AIzaSyA1AZNcvUFb9Cz8eF075CeLJAW4mIq_G7s',
  type: "video"
};

function Body({spotify}) {
  //⌄ Data values extracted from data layer
  const [{discover_weekly, search, search_term, page, playlists, token, device_id, link, playing, platform}, dispatch] = useDataLayerValue()
  let loading = true

  // sets the spotify player to play a new song
  var setPlayer = (link)  => {
    const track = link.track
    console.log(track)
    console.log("device_id: " + device_id)
    dispatch({
      type: "SET_ITEM",
      item: track
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
  
  // Conducts the search for all three platforms, and searches 
  // the database to return  all songs that match the search query
  const invokeSearch = async (platform) => { // platform can be "Spotify", "Soundcloud", or "Youtube"
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
      const soundScraper = new SoundCloudScraper();
      let url = `https://soundcloud.com/search/sounds?q=${search_term}`;
      let lst = []
      // let res = await soundScraper.getHtmlFromUrl(url);
      const response = await axios.get(url);
      // , { headers: { 'Access-Control-Allow-Origin' : '*',
      // 'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS', "Access-Control-Allow-Headers" : "x-access-token, Origin, X-Requested-With, Content-Type, Accept"}});
      let res = response.data;
      const $ = load(res);
      res = res.substring(res.indexOf('<li><h2>'), res.lastIndexOf('</h2></li>'))
      console.log(res);
      let index = 0;
      let tracklist = []
      while(index < res.length) {
        if(!loading){
          loading = true
        }
        let start = res.indexOf('"', index);
        let end = res.indexOf('"', start + 1);
        if(start === -1 || end === -1) {
          break;
        }
        let link = res.substring(start + 1, end);
        tracklist.push(link);
        index = end + 1;
        console.log(link)
        let soundSong = await soundScraper.getSound('https://soundcloud.com' + link);
        console.log(soundSong)
        let song = {
          platform:"Soundcloud",
          title:soundSong.title,
          artist:soundSong.user.username,
          pic:soundSong.artwork_url,
          link:soundSong.permalink_url
        }
        console.log(song);
        results.push(song)
      }
      loading = false
      console.log(tracklist)
      let song  = await soundScraper.getSound('https://soundcloud.com/logic_official/1-800-273-8255');
      console.log(song);
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
    dispatch({
      type: "SET_PLATFORM",
      platform: platform
    })
    dispatch({ 
      type: "SET_PAGE",
      page: "Search"
    })
  }

  if (discover_weekly === null && page === "Home") {
    return (
      <div className="body">
        <Header spotify = {spotify}/>
        {
        playlists?.items?.map(playlist => (
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
        {(search !== null) &&
        search.map(track => {
          if(track.platform === "Spotify") {
            return (
              <div onClick={() => setPlayer(track)}>
                <SongRow track={track}/>
              </div>
            )
          }
          else {
            return (
              <div onClick={() => setReactPlayer(track)}>
                <SongRow track={track}/>
              </div>
            )
          }
        }
        )}
        {loading && platform === 'Soundcloud' && <Loading />}
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
              <div onClick={() => setPlayer(item)}>
                <SongRow track={item.track}/>
              </div>
            ))}
        </div>
    </div>
    )
  }
}

export default Body;