import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import useContextMenu from "./useContextMenu";
import '../styles/MenuContext.scss'
const MenuContext = ({ data, click, pointX, pointY }) => {
    const { clicked, setClicked, points, setPoints } = useContextMenu();
    
    return (
      <div>
        {click && (
          <div id='context_menu' className='context_menu' 
            style={{position: "absolute", 
                left: `${pointX}px`,
                top: `${pointY}px`,}}
            >
            <ul>
              <li>Play Now</li>
              <li>Add To Queue</li>
              <li>Add to Playlist</li>
            </ul>
          </div>
        )}
      </div>
    );
  };
export default MenuContext;