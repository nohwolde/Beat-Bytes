import React from 'react'
import "./Header.css"
import SearchIcon from "@material-ui/icons/Search"
import {Avatar} from "@material-ui/core"
import {useDataLayerValue} from '../DataLayer'

function Header({spotify}) {
    const [{user}, dispatch] = useDataLayerValue();
    const search = (elem) => {
        console.log("searching")
        if(elem.key === "Enter") {
            console.log(elem.target.value)
            dispatch({
                type: "SET_SEARCH_TERM", 
                search_term: elem.target.value
            });
            let results = []
            spotify.searchTracks(elem.target.value).then(
                function(data) {   
                    data.tracks.items.forEach(function(track) {
                        var song = {title:track.name,
                        artist:track.artists.map(artist => artist.name).join(", "), 
                        pic:track.album.images[2].url, 
                        link:track.uri}
                        results.push(song)
                    })
                }
            )
            console.log(results)
            dispatch({
                type: "SET_SEARCH",
                search: results
            })
            dispatch({
                type: "SET_DISCOVER_WEEKLY",
                discover_weekly: null
            })
        }
    }
    return (
        <div className="header">
            <div className="header_left" >
                <SearchIcon />
                <input
                    placeholder="Search"
                    type="search"
                    id="searchBar"
                    onKeyDown={(e)=> search(e)}
                />
            </div>
            <div className="header_right" >
                <Avatar src={user?.images[0]?.url} alt={user}/>
                <h4>{user?.display_name}</h4>
            </div>
        </div>
    )
}

export default Header
