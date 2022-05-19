import React from 'react'
import './SongRow.css'
import logo from './favicon.ico'

function SongRow({track}) {
    if(track !== undefined && track.platform !== undefined){
        return ( 
            <div className  = "songRow">
                <img className = "songRow_album" src = {track.pic} alt = ""/>
                <div className = "songRow_info">
                    <h1>{track.title}</h1>
                    <p>{track.artist} </p>
                </div>
            </div>
        )
    }
    if (typeof track.track !== 'undefined') {
        if(track.platform === "Spotify"){
            return ( 
                <div className  = "songRow">
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
                <div className  = "songRow">
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
