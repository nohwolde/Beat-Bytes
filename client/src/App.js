import React, { Component } from 'react';
import './App.css';
import soundcloud from 'soundcloud';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();
var volume;
var downVolume = 0.1;
var stop = false;
var track = 'https://soundcloud.com/forss/sets/soulhack';
var SC = require('soundcloud');

class App extends Component {
  constructor(props){
    super(props);
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    SC.initialize({
      client_id: 'wJ3iwkqswthCXMGaBX9lJeIZAIshvKtV'
    });
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
      token: "",
      deviceId: "",
      error: "",
      trackName: "Track Name",
      artistName: "Artist Name",
      albumName: "Album Name",
      playing: false,
      position: 0,
      duration: 1,
    };
    this.playerCheckInterval = null;
  }
  handleLogin() {
    if (this.state.token !== "" && stop === false) {
      // change the loggedIn variable, then start checking for the window.Spotify variable
      this.setState({ loggedIn: true });
      this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
    }
    stop = true;
  }
  soundcloudSearch() {
    SC.get('/tracks', {
        title: 'SoundPlay'
      }).then(function(tracks) {
        console.log(tracks);
          SC.oEmbed(track, {
            element: document.getElementById('putTheWidgetHere')
          });
      });
    SC.oEmbed(track, {
      element: document.getElementById('putTheWidgetHere')
    });
  }
  // when we receive a new update from the player
  onStateChanged(state) {
    // only update if we got a real state
    if (state !== null) {
      const {
        current_track: currentTrack,
        position,
        duration,
      } = state.track_window;
      const trackName = currentTrack.name;
      const albumName = currentTrack.album.name;
      const artistName = currentTrack.artists
        .map(artist => artist.name)
        .join(", ");
      const playing = !state.paused;
      this.setState({
        position,
        duration,
        trackName,
        albumName,
        artistName,
        playing
      });
    } else {
      // state was null, user might have swapped to another device
      this.setState({ error: "Looks like you might have swapped to another device?" });
    }
  }
  
  createEventHandlers() {
    // problem setting up the player
    this.player.on('initialization_error', e => { console.error(e); });
    // problem authenticating the user.
    // either the token was invalid in the first place,
    // or it expired (it lasts one hour)
    this.player.on('authentication_error', e => {
      console.error(e);
      this.setState({ loggedIn: false });
    });
    // currently only premium accounts can use the API
    this.player.on('account_error', e => { console.error(e); });
    // loading/playing the track failed for some reason
    this.player.on('playback_error', e => { console.error(e); });
  
    // Playback status updates
    this.player.on('player_state_changed', state => this.onStateChanged(state));
  
    // Ready
    this.player.on('ready', async data => {
      let { device_id } = data;
      console.log("Let the music play on!");
      // set the deviceId variable, then let's try
      // to swap music playback to *our* player!
      await this.setState({ deviceId: device_id });
      this.transferPlaybackHere();
    });
  }
  
  checkForPlayer() {
    const { token } = this.state;
    
    // if the Spotify SDK has loaded
    if (window.Spotify !== null) {
      // cancel the interval
      clearInterval(this.playerCheckInterval);
      // create a new player
      
      this.player = new window.Spotify.Player({
        name: "BeatBytes Audio Player",
        getOAuthToken: cb => { cb(token); },
      });
      // set up the player's event handlers
      this.createEventHandlers();
      
      // finally, connect!
      this.player.connect();
    }
  }
  
  onPrevClick() {
    this.player.previousTrack();
  }
  
  onPlayClick() {
    this.player.togglePlay();
  }
  
  onNextClick() {
    this.player.nextTrack();
  }
  
  transferPlaybackHere() {
    const { deviceId, token } = this.state;
    // https://beta.developer.spotify.com/documentation/web-api/reference/player/transfer-a-users-playback/
    fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "device_ids": [ deviceId ],
        // true: start playing music if it was paused on the other device
        // false: paused if paused on other device, start playing music otherwise
        "play": true,
      }),
    });
  }
  
  getHashParams() {
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
  
  setVolumeUp(){
    this.player.setVolume(volume +0.1).then(() => {
      console.log('Volume Up!');
    });
  }
  
  setVolumeDown(){
    this.player.setVolume(0.6-downVolume).then(() => {
      console.log('Volume Down!');
    });
    if(downVolume<0.51){
      downVolume += 0.1;
    }
  }
 
  getNowPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: { 
              name: response.item.name, 
              albumArt: response.item.album.images[0].url
            }
        });
      })
  }
  getVolume(){
    this.player.getVolume().then(volume => {
    let volume_percentage = volume * 100;
    volume = (volume_percentage/100)
    console.log(`The volume of the player is ${volume_percentage}%`);
  });
  }
  render() {
    const {
      token,
      //loggedIn,
      trackName,
      artistName,
      albumName,
      //error,
      playing
    } = this.state;
    return (
      <div className="App">
        <a href='http://localhost:8888' > Login to Spotify </a>
        <div>
          Now Playing: { this.state.nowPlaying.name }
        </div>
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
        </div>
        { this.state.loggedIn &&
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
        }
        <div>      
          <p>Artist: {artistName}</p>
          <p>Track: {trackName}</p>
          <p>Album: {albumName}</p>
          <p>
            <button onClick={() => this.onPrevClick()}>Previous</button>
            <button onClick={() => this.onPlayClick()}>{playing ? "Pause" : "Play"}</button>
            <button onClick={() => this.onNextClick()}>Next</button>
          </p>
        </div>
        <div>
        { this.state.loggedIn &&
          <button onClick={() => this.setVolumeUp()}>
            +
          </button>
        }
        { this.state.loggedIn &&
          <button onClick={() => this.setVolumeDown()}>
            -
          </button>
        }
        </div>
        :
        <div>
          <p className="App-intro">
        Spotify Access Token Here:{" "}
          </p>
          <p>
            <input type="text" value={token} onChange={e => this.setState({ token: e.target.value })} />
          </p>
          <p>
            <button onClick={() => this.handleLogin()}>
              Go
            </button>
          </p>
        </div>
      </div>
    );
  }
}
 
export default App;
 

