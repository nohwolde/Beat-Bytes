import react from 'react';
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
import { CompareArrowsOutlined } from '@material-ui/icons';
import axios from 'axios';
import SoundcloudWidget from 'soundcloud-widget';
var request = require('request')
const sckey = require('soundcloud-key-fetch');

const ScSearcher = require('sc-searcher');
const scSearch = new ScSearcher();


const client_id = "IeMXPcw700vri91qf4OzQXJUVIvCwGO7";

//var client_id = process.env.client;


scSearch.init(client_id);

var SC = require('soundcloud')

// var iframe = document.getElementById('sc-widget'); // can also pass in an iframe node
// var widget = new SoundcloudWidget(iframe);

// SC.initialize({
//   client_id: "bPQTmXJQGtjWjmI3P1HTY0bD5PWil6b6" //"bda4ada8694db06efcac9cf97b872b3e" //'70dbe4d49232b596d30fb6c341646830'
// })

var opts = {
  maxResults: 20,
  key: 'AIzaSyA1AZNcvUFb9Cz8eF075CeLJAW4mIq_G7s',
  type: "video"
};

const invidious = 'https://invidious.osi.kr/feed/popular';
const invidious2 = 'https://invidious.kavin.rocks/feed/popular';

function Body({spotify}) {
  const [{discover_weekly, search, search_term, token, device_id, link, playing}, dispatch] = useDataLayerValue()
  // SC.initialize({
  //   client_id: "bda4ada8694db06efcac9cf97b872b3e" //'70dbe4d49232b596d30fb6c341646830'
  // })
  var setPlayer = (track)  => {
    dispatch({
      type: "SET_PLATFORM",
      platform: "Spotify"
    })
    console.log(track)
    fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT",
       headers: {
         authorization: `Bearer ${token}`,
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
          "uris": [track],
          "device_ids": [device_id],
       }),
      })
  }

  var setReactPlayer = (link) => {
    dispatch({
      type: "SET_PLATFORM",
      platform: "ReactPlayer"
    })
    dispatch({
        type: "SET_LINK",
        link: link
    })
  }

  var invokeSearch = (platform) => {
    if(platform == "Spotify") {
      let results = []
      spotify.searchTracks(search_term).then(
          function(data) {
              data.tracks.items.forEach(function(track) {
                  var song = {
                    platform:"Spotify",
                    title:track.name,
                    artist:track.artists.map(artist => artist.name).join(", "), 
                    pic:track.album.images[2].url, 
                    link:track.uri}
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
    else if(platform == "Soundcloud") {
      let results = []
      sckey.fetchKey().then(key => {
        console.log(key)
      });
      let query = 'Avicii';
      let result_limit = 5;
      scSearch.getTracks(query, result_limit).then((res) => {
          console.log(res);
      });
      // SC.get('/tracks', {
      //     q: search_term
      // }).then(function (tracks) {
      //     console.log(tracks)
      //     tracks.forEach(function (track) {
      //       var song = {title:track.title,
      //         artist:track.artists.map(artist => artist.name).join(", "),
      //         pic:track.artwork_url,
      //         link:track.permalink_url}
      //         results.push(song)
      //     })
      // });
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
    else if(platform == "Youtube") {
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
  if (discover_weekly == null && search.length > 0) {
    return (
      <div className="body">
        <Header spotify = {spotify}/>
        <img className = "body_playerLogo" src={Spot} onClick={() => invokeSearch("Spotify")}></img>
        <img className = "body_playerLogo" src={Sc} onClick={() => invokeSearch("Soundcloud")}></img>
        <img className = "body_playerLogo" src={Yt} onClick={() => invokeSearch("Youtube")}></img>
        {search.map(track => 
        {
          if(track.platform == "Spotify") {
            return (
              <div className="card" onClick={() => setPlayer(track.link)}>
                <img src={track.pic}></img>
                <h1>{track.title}</h1>
                <p>{track.artist}</p>
              </div>
            )
          }
          else {
            return (
              <div className="card" onClick={() => setReactPlayer(track.link)}>
                <img src={track.pic}></img>
                <h1>{track.title}</h1>
                <p>{track.artist}</p>
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
              <SongRow spotify={spotify} track={item.track} onClick={() => setPlayer(item.link)}/>
            ))}
        </div>
    </div>
    )
  }
}

export default Body;