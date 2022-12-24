import {React, useEffect} from 'react';
import './Player.css';
import Sidebar from './Sidebar'
import Body from './Body'
import Footer from './Footer'
import { useDataLayerValue } from '../DataLayer'
var request = require('request')

var client_id = '3dd065b6dedd47e99ecb7ed63bcde5d6' // Your client id
var client_secret = 'a3ae8ca6169d4e8d8a956ec5f330c453'  // Your secret

function Player({spotify}) {
  let [{token, refresh_token, device_id, item, playing, platform}, dispatch] = useDataLayerValue();
  let device = ""
  let player = null;

  useEffect(() => {
    if(device_id !== null && playing === true && platform === "Spotify") {
      spotify.play()
    }
    else if(playing === true && platform === "Spotify") {
      checkForPlayer()
    }
  }, [playing])
  
  function transferPlaybackHere() {
    // https://beta.developer.spotify.com/documentation/web-api/reference/player/transfer-a-users-playback/
    fetch("https://api.spotify.com/v1/me/player", {
       method: "PUT",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "device_ids": [device], // changed from device
          // true: start playing music if it was paused on the other device
          // false: paused if paused on other device, start playing music otherwise
          "play": true,
        }),
    });
  }

  function checkForPlayer() {
      // if the Spotify SDK has loaded
      if (window.Spotify !== null) {
        player = new window.Spotify.Player({
          name: "BeatBytes Audio Player",
          getOAuthToken: cb => { cb(token); },
        });
        // set up the player's event handlers
        createEventHandlers();
        // finally, connect!
        player.connect();
      }
  }

  const createEventHandlers = () => {
    // problem setting up the player
    player.on('initialization_error', e => { console.error(e); });
    // currently only premium accounts can use the API
    player.on('authentication_error', e => {
      if(token != null) {
        var authOptions = {
          url: 'https://accounts.spotify.com/api/token',
          headers: {'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))},
          form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token 
          },
          json: true
        };
        request.post(authOptions, function(error, response, body) {
          if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            dispatch({
              type: "SET_TOKEN",
              token: access_token
            });
          }
        });
      }
    })
    player.on('account_error', e => { console.error(e); });
    // loading/playing the track failed for some reason
    player.on('playback_error', e => { console.error(e); });
    // Playback status updates
    //player.on('player_state_changed', state => this.onStateChanged(state));
    // Ready
    player.on('ready', async data => {
      let { device_id } = data;
      device = device_id
      console.log("device:" + device)
      console.log("Let the music play on!");
      // set the deviceId variable, then
      // it swaps music playback to *our* player!
      dispatch({
        type: "SET_DEVICE",
        device_id: device
      })
      transferPlaybackHere();
    });
}

  return (
    <div className="player">
      <div className="player_body">
        <Sidebar spotify={spotify}/>
        <Body spotify={spotify}/>
      </div>
      <Footer spotify = {spotify}/>
    </div>
  )
}

export default Player;