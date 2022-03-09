import React from 'react'
import './SongRow.css'
import { useDataLayerValue } from '../DataLayer'
import logo from './favicon.ico'

function SongRow({track, spotify, playlist}) {
    const [{token, device_id}, dispatch] = useDataLayerValue()
    var setReactPlayer = (track) => {
        dispatch({
            type: "SET_LINK",
            link: track.link
        })
    }
    var setPlayer = (track)  => {
      console.log("Track:")
      console.log(track.uri)
      console.log("token: " + token)
      console.log("device_id: " + device_id)
      fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
         headers: {
           authorization: `Bearer ${token}`,
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
            "uris": [track.uri],
            // "context_uri": track.uri,
            // "offset": {
            //     "position": 5
            //   },
            // "position_ms": 0
            "device_ids": [device_id],
           // true: start playing music if it was paused on the other device
           // false: paused if paused on other device, start playing music otherwise
           //"play": true,
        }),
      })
    }
    if (typeof track.track !== 'undefined') {
        if(track.platform == "Spotify"){
            return ( 
                <div className  = "songRow" onClick = {() => setPlayer(track)}>
                    <img className = "songRow_album" src = {track.album.images[0].url} alt = ""/>
                    <div className = "songRow_info">
                        <h1>{track.name}</h1>
                        <p>{track.artists.map((artist) => artist.name).join(', ')} -{" "}{track.album.name} </p>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className  = "songRow" onClick = {() => setReactPlayer(track)}>
                    <img className = "songRow_album" src = {track.album.images[0].url} alt = ""/>
                    <div className = "songRow_info">
                        <h1>{track.name}</h1>
                        <p>{track.artists.map((artist) => artist.name).join(', ')} -{" "}{track.album.name} </p>
                    </div>
                </div>
            )
        }
    }
    else {
        return (
            <div className  = "songRow">
                <img className = "songRow_album" src = {logo} alt = "" />
                <div className = "songRow_info" >
                    <h1>{"Downloaded Song"}</h1>
                </div>
            </div>
        )
    }
}

export default SongRow
