import React from 'react';
import { useDataLayerValue } from '../DataLayer'
import '../styles/HomePage.scss';

function HomePage({spotify}) {
  //⌄ Data values extracted from data layer
  const [{playlists}, dispatch] = useDataLayerValue()

  // function that updates the playlist being displayed in the body component
  const setBody = (playlist)  => {
    console.log("Playlist:")
    console.log(playlist)
    dispatch({
      type: "SET_DISCOVER_WEEKLY",
      discover_weekly: playlist
    })
    dispatch({
      type: "SET_PAGE",
      page: "Discover Weekly"
    })
  }

  return (
      <div className='homePage'>
          <h1>Playlists</h1>
          <hr />
          <div className='homePage_playlists'>
          {
          playlists?.map(playlist => (
          <div className='homePage_playlist_box' onClick={() => setBody(playlist)}>
              <img alt='' src={playlist.images[0].url}></img>
              <h4>{playlist.name}</h4>
          </div>
          ))}
          </div>
      </div>
  )
}

export default HomePage;