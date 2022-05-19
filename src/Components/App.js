import './App.css'
import home from './home'
import React, { Component,  useEffect, useState} from 'react'
import Search from './Search'
import Loading from './loading'
import SpotifyWebApi from 'spotify-web-api-js';
import { useDataLayerValue } from '../DataLayer'

import Spot from './pics/spot.png'
import Sc from './pics/sc.png'
import Yt from './pics/yt.png'
import searchIcon from './pics/search.png'
import homeIcon from './pics/icons8-home-48.png'

import Pause from './pics/pause.png'
import Play from './pics/play.png'
import Player from './Player'

import 'reactjs-bottom-navigation/dist/index.css'

var currPic = {
  title: "Spotify",
  icon: <img className = "App-nav" src={Spot}></img>,
  activeIcon: <img className = "App-nav" src={Spot}></img>
}

var spotify = new SpotifyWebApi()

function App() {
  const [{user, token}, dispatch] = useDataLayerValue()

  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
  }

  useEffect(() => {
    const hash = getHashParams()
    window.location.hash = ""
    const _token = hash.access_token
    const _refresh = hash.refresh_token
    if(_token) {
      dispatch({ type: 'SET_TOKEN', token: _token})
      dispatch({ type: 'SET_REFRESH_TROKEN', refresh_token: _refresh})

      spotify.setAccessToken(_token);

      spotify.getMe().then(user => {
        dispatch({ type: "SET_USER", user: user})
      })

      spotify.getMyTopArtists().then((response) =>
        dispatch({ type: "SET_TOP_ARTISTS", top_artists: response})
      );

      dispatch({ type: "SET_SPOTIFY", spotify: spotify});

      spotify.getUserPlaylists().then((playlists) => {
        dispatch({ type: "SET_PLAYLISTS", playlists: playlists})
      })

      spotify.getPlaylist("37i9dQZEVXcL4fk8T7EeaN").then((response) => {
        dispatch({ type: "SET_DISCOVER_WEEKLY", discover_weekly: response})
      });
    }
    console.log("I have a token: ", token)
  }, [token, dispatch]);

  return (
    <div>
      {
        token? <Player spotify={spotify}></Player> 
        :
        (
          <div className="app">
            <Loading />
          </div>
        )
      }
    </div>
  )
}
export default App;
