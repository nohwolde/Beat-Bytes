import React, { Component } from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from "react-router-dom";

import Home from "./Components/Home";
import SoundcloudSearch from "./Components/SoundcloudSearch";
import SpotifySearch from "./Components/SpotifySearch";
import Error from "./Components/Error";
import Nav from "./Components/Nav";
import Player from "./Components/Player";
const Router = () =>
   (
     <BrowserRouter>
       <div>
         <Nav />
         <Switch>
           <div>
             <Route path = "/" component = {Home} exact />
             <Route path = "/SoundcloudSearch" component = {SoundcloudSearch}/>
           </div>
             <Route component = {Error}/>
         </Switch>
         <div>
           <Player />
         </div>
       </div>
     </BrowserRouter>
   );

export default Router;




