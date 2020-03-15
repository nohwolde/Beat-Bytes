import React, { Component } from 'react';
import './App.css';
//import soundcloud from 'soundcloud';
import SpotifyWebApi from 'spotify-web-api-js';
import $ from 'jquery';
import "./pause.png";

const spotifyApi = new SpotifyWebApi();
var volume = 0.1;
var downVolume = 0.1;
var stop = false;
var SC = require('soundcloud');
var playlist = new Array();
var song = localStorage.getItem('soundSong');
var v;
var count = 0;

class Player extends Component {
 constructor(props){
   super(props);
   const params = this.getHashParams();
   const token = params.access_token;
   spotifyApi.setAccessToken(token);
   SC.initialize({
     client_id: 't0h1jzYMsaZXy6ggnZO71gHK3Ms6CFwE'
   });
   this.state = {
     loggedIn: token ? true : false,
     nowPlaying: { name: 'Not Checked', albumArt: '', uri: ''},
     token: "",
     deviceId: "",
     error: "",
     trackName: "",
     artistName: "",
     albumName: "Album Name",
     playing: false,
     position: 0,
     duration: 1,
     q: "Lord Willin",
     spotifyTitle: "",
     soundPlay: false,
     t: "",
     song: "",
     soundUrl: "",
     connected: false,
     openPlaylist: true,
     playlistName: "",
     v1: "",
     time: 6000,
   };
   this.playerCheckInterval = null;
 }
 handleLogin() {
   this.setState({ loggedIn: true });
   this.setState({ connected: true });
   this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
   var url = window.location.href;
   var startIndex = url.indexOf("=");
   var endIndex = url.indexOf("&");
   this.state.token = url.substring(startIndex+1, endIndex);
   console.log(this.state.token);
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
   this.getNowPlaying();
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
     // set the deviceId variable, then
     // it swaps music playback to *our* player!
     await this.setState({ deviceId: device_id });
     this.transferPlaybackHere();
   });
 }
 soundPlay() {
   var h = this;
   var same = localStorage.getItem('soundSong');
   SC.get('/tracks', {
     q: same
   }).then(function(tracks) {
      $(document).ready(function () {
        h.setState({
          song: tracks[0].permalink_url
        })
        v = h.state.t
        playlist.push(this.state.song)
        localStorage.setItem("" + v,JSON.stringify(playlist))
        console.log(localStorage.getItem("" + v))
        console.log(playlist)
      })
   }
   );
 }
 addSong(){
   if(this.state.t == localStorage.getItem(this.state.t)){

   }
   else{
     this.newPlaylist();
   }
 }
 addToPlaylist(){
  for(var i = 0; i < localStorage.length; i++){
    //console.log(localStorage.getItem(localStorage.key(i)));
  }
 }
 makeNewPlaylist(){

 }

 newPlaylist(){
   this.getNowPlaying();
   var s = this;
    spotifyApi.getMyCurrentPlaybackState()
         .then((response) => {
           this.setState({
             nowPlaying: {
               name: response.item.name,
               albumArt: response.item.album.images[0].url,
               uri: response.item.uri
             }
           })
         }).then((response) => {
         if(playlist.length>0){
            s.getNowPlaying()
            for(var i = 0;i<playlist.length;i++)
            {
              if(playlist.includes(s.state.nowPlaying.uri)){
                return
              }
            }
          }
          v = s.state.t
          playlist.push(s.state.nowPlaying.uri)
          localStorage.setItem("" + v,JSON.stringify(playlist))
          console.log(localStorage.getItem("" + v))
          console.log(playlist)
         })
         return
 }
 playCollab(){
   var collab = Array();
   var wait = 6000;
   var t = this;
   collab = JSON.parse(localStorage.getItem("log") || "[]");
   console.log(collab);
   spotifyApi.play({"uris": collab[count]})
   .then((response) => {
      t.getNowPlaying()
   });
   //spotifyApi.getAudioFeaturesForTrack(collab[count].substr(14)).then((response) => {this.setState({time: response.duration_ms})});
   for(count;count<collab.length;count++){
     console.log('sound');
     if(collab[count].charAt(0) == 's'){
       console.log(collab[count]);
       wait = t.state.time;
       console.log(wait);
       t.timerCollab();
     }
     else{

     }
   }
 }
 timerCollab(){
  var wait = Array();
  var t = this;
  var collab = Array();
  collab = JSON.parse(localStorage.getItem("log") || "[]");
  for(var i = 0;i<collab.length;i++){
    console.log('sound');
    if(collab[i].charAt(0) == 's'){
      console.log(collab[i]);
      //spotifyApi.getAudioFeaturesForTrack(collab[i].substr(14)).then((response) => {this.setState({time: response.duration_ms})});
      wait.push(t.state.time);
      console.log(wait);
      setTimeout(t.playCollab,10000);
    }
  }

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
    this.getNowPlaying();
 }

 onPlayClick() {
    this.player.togglePlay();
 }

 onNextClick() {
   this.player.nextTrack();
 }

 openPlay() {
   this.setState({
     openPlaylist: true
   })
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
 playIt(){
  var collab = Array();
  collab = JSON.parse(localStorage.getItem("log") || "[]");
  console.log(collab);
  spotifyApi.play({"uris": collab[count]})
 }

 setVolumeUp(){
   //this function increases the volume for the spotify player if the plus button is pressed 
   this.player.setVolume(volume +0.6).then(() => {
     console.log('Volume Up!');
   });
   if(volume<0.51){
     volume += 0.1;
   }
 }

 setVolumeDown(){
   //this function decreases the volume for the spotify player if the minus button is pressed
   this.player.setVolume(0.5-downVolume).then(() => {
     console.log('Volume Down!');
   });
   if(downVolume<0.51){
     downVolume += 0.1;
   }
 }

 getNowPlaying(){
   var t = this;
   if(this.state.loggedIn && this.state.playing) {
     spotifyApi.getMyCurrentPlaybackState()
         .then((response) => {
           if(typeof response.item.name !== 'undefined' ){
             //do this if the song is currently playing in the browser
            this.setState({
              nowPlaying: {
                name: response.item.name,
                albumArt: response.item.album.images[0].url,
                uri: response.item.uri
              }
            })
           }
         })
         return
   }
 }
 render() {
   const {
     token,
     //loggedIn,
     trackName,
     artistName,
     albumName,
     //error,
     playing,
     connected
   } = this.state;
   return (
     <div className="Player">
       <div className="Player-footer">
       <div>
         <nav className="navbar fixed-bottom ">
         <div>
           <a className="logo-image">
           <img src={this.state.nowPlaying.albumArt} style={{ height: 50 }} className="img-fluid">
         </img></a>
         </div>
           <div className='d-flex flex-column'>
             { !this.state.connected &&
              <button onClick={() => this.handleLogin()}>{connected ? "Connected":"Connect to Spotify"}</button>
             }
           </div>
           <div>
           <p>
            { this.state.loggedIn &&
             <button onClick={() => this.onPrevClick() && this.getNowPlaying()}>Previous</button>
            }
            { this.state.loggedIn &&
             <button onClick={() => this.onPlayClick()}>{playing ? "Pause" : "Play"}</button>
            }
            { this.state.loggedIn &&
             <button onClick={() => this.onNextClick() && this.getNowPlaying()}>Next</button>
            }
           </p>
           <div>
             {this.state.loggedIn &&
             <input type="text" placeholder = "Spotify Add to Playlist" onChange={e => this.setState({ t: e.target.value })} />
             }
             {this.state.loggedIn &&
             <button onClick={() => this.newPlaylist()}>
                 Submit
             </button>
             }
             {this.state.loggedIn &&
              <button onClick={() => this.playCollab()}>
                Play log
              </button>
             }
           </div>
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
           <div>
             <div id="playerwidget" scrolling="no" frameborder="no"></div>
             <input type="text" placeholder = "Soundcloud Add to Playlist" onChange={e => this.setState({ t: e.target.value })} />
             { this.state.openPlaylist &&
              <button onClick={() => this.soundPlay()}>
                {"add to " + this.state.t}
              </button>
             }
           </div>
         <div>
         <a className="navbar-brand">{trackName} - {artistName}</a>   
         </div> 
         </nav></div>
       </div>
     </div>
   );
 }
}

export default Player;
