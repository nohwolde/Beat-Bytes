import '../styles/App.scss';
import React, { useEffect, useState} from 'react'
import Loading from './loading'
import SpotifyWebApi from 'spotify-web-api-js';
import { useDataLayerValue } from '../DataLayer'
import Player from './Player'

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

  useEffect(async () => {
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

      const lst = []
      await spotify.getUserPlaylists().then((playlists) => playlists.items.forEach((async playlist => {
        await spotify.getPlaylist(playlist.id).then((response) => {
          lst.push(response)
        });
      })));
      dispatch({type: "SET_PLAYLISTS", playlists: lst})
      console.log(lst)

      spotify.getPlaylist("37i9dQZEVXcL4fk8T7EeaN").then((response) => {
        dispatch({ type: "SET_DISCOVER_WEEKLY", discover_weekly: response})
      });
    }
    console.log("I have a token: ", token)
  }, [token, dispatch]);

  return (
    <div className="app">
      {
        token? <Player spotify={spotify}></Player> 
        :
        (
          <div>
            <Loading />
          </div>
        )
      }
    </div>
  )
}
export default App;
