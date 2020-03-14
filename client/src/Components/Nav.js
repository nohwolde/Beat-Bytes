import React from 'react';
import './App.css';
import {Link} from 'react-router-dom';
import SoundcloudSearch from './SoundcloudSearch';
const Nav = () => {
   return (
       <div className="App-header">
           <nav className="navbar navbar-expand-lg fixed-top ">
               <header><Link to={{pathname: "/"}}>
                   <a className="navbar-brand">Home</a>
               </Link></header>
           <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
           <span className="navbar-toggler-icon"></span>
           </button>
               <div className="AppHead bg-light text-center" ><header>
                   <h2>BeatBytes</h2>
               </header></div>
           <div className="collapse navbar-collapse " id="navbarSupportedContent">     <ul className="navbar-nav mr-4">
           <li className="nav-item nav-link">
               <Link to={{pathname: "/SoundcloudSearch"}}>SoundcloudSearch</Link></li>
           </ul>
           </div></nav>
       </div>
   );
}
export default Nav;
