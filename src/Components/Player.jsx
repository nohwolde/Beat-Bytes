import {React, useEffect} from 'react';
import '../styles/Player.scss';
import Sidebar from './Sidebar'
import Body from './Body'
import Footer from './Footer'
import { useDataLayerValue } from '../DataLayer'
import useContextMenu from "./useContextMenu";
import MenuContext from './MenuContext';

function Player({spotify}) {
  return (
    <div className="player"
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <div className="player_body">
        <Sidebar spotify={spotify}/>
        <Body spotify={spotify}/>
        <Footer spotify = {spotify}/>
      </div>
    </div>
  )
}

export default Player;