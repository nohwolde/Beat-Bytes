import React, { Component } from 'react';
import './App.css';
import soundcloud from 'soundcloud';
import SpotifyWebApi from 'spotify-web-api-js';
import "./pause.png";
import Searcher from "./Searcher";
import $ from 'jquery';

var spotifyApi = new SpotifyWebApi();
var volume = 0.1;
var downVolume = 0.1;
var stop = false;
var SC = require('soundcloud');
var t = this;

class SoundcloudSearch extends Component {
   constructor(props){
       super(props);
       this.state = {
           q: "",
           songs: [],
       };
       this.playerCheckInterval = null;
   }
   soundcloudSearch() {
        var t = this;
        var song = this.state.q;
        localStorage.setItem('soundSong', song);
        console.log(localStorage.getItem('soundSong'));
        SC.get('/tracks', {
            q: t.state.q
        }).then(function (tracks) {
          SC.oEmbed(tracks[0].permalink_url, {
            auto_play: true,
            maxheight: 80,
            element: document.getElementById('playerwidget')
          });

       });
   }
   // when we receive a new update from the player
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
               <div>
                   <div>
                       <img src="fav.ico" className="App-logo"/>
                   </div>
                   <div>
                       <input type="text" placeholder = "SoundCloud Search" onChange={e => this.setState({ q: e.target.value })} />
                   </div>
                   <button onClick={() => this.soundcloudSearch()}>
                       Search
                   </button>
                   <div id="putTheWidgetHere"></div>
                   <Searcher song = {this.state.songs}/>
               </div>
           </div>
       );
   }
}

export default SoundcloudSearch;
