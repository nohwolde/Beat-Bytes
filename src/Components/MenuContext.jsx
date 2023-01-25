import React from "react";
import '../styles/MenuContext.scss'
const MenuContext = ({ data, click, pointX, pointY }) => {
  function handlePlayNow() {
    console.log("Play Now");
    var elem = document.elementFromPoint(pointX - 1, pointY);
    console.log(elem);
  }
    return (
      <div>
        {click && (
          <div id='context_menu' className='context_menu' 
            style={{
              position: "absolute",
              left: `${pointX}px`,
              top: `${pointY}px`,
            }}
            >
            <ul>
              <div onClick={() => handlePlayNow()}>
                <li>Play Now</li>
              </div>
              <li>Add To Queue</li>
              <li>Add to Playlist</li>
            </ul>
          </div>
        )}
      </div>
    );
  };
export default MenuContext;