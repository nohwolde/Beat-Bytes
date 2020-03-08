import React, { Component } from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from "react-router-dom";

import Home from "./Components/Home";
import SoundcloudSearch from "./Components/SoundcloudSearch";
import SpotifySearch from "./Components/SpotifySearch";
import Error from "./Components/Error";
import Nav from "./Components/Nav";
import Player from "./Components/Player";
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Nav />
          <Switch>
            <Route path = {"/"} component = {Home} exact />
            <Route path = {"SoundcloudSearch"}/>
            <Route path = {"SpotifySearch"}/>
            <Route component = {Error}/>
          </Switch>
          <Player />
        </div>
      </BrowserRouter>
    );
  }
}
 
export default App;
 

