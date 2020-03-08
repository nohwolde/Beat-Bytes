import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import SoundcloudSearch from './SoundcloudSearch';
import SpotifySearch from './SpotifySearch';

const Nav = () => {
    return (
        <div>
            <div className="App-header">
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous"></link>
            <nav className="navbar navbar-expand-lg fixed-top ">  
            <a className="navbar-brand" href="">Home</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">  
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse " id="navbarSupportedContent">     <ul className="navbar-nav mr-4">
            <li className="nav-item">
                <a className="nav-link" data-value="Spotify Search" href={SpotifySearch}>Spotify Search</a>        </li>  
            <li className="nav-item">
                <a className="nav-link " data-value="Soundcloud Search"href={SoundcloudSearch}>Soundcloud Search</a> </li>   
            <li className="nav-item"> 
                <a className="nav-link "data-value="Collaborative Playlists" href="">Collaborative Playlists</a>         </li>   
            <li className="nav-item"> 
                <a className="nav-link " data-value="Settings & Account Status" href="">Settings & Account Status</a>       </li>  
            </ul>     
            </div></nav>
            </div>
        </div>
    );
}
export default Nav;