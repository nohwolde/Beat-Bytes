import React, { useState } from "react";
import "../styles/Header.scss";
import SearchIcon from "@material-ui/icons/Search";
import { Avatar } from "@material-ui/core";
import { useDataLayerValue } from "../DataLayer";
import { SoundCloudScraper } from "./SoundcloudScraper.jsx";
import Sc from "./pics/soundcloudDark.svg";
import Spot from "./pics/spotDark.svg";
import Yt from "./pics/ytDark.svg";

const opts = {
  maxResults: 20,
  key: "AIzaSyA1AZNcvUFb9Cz8eF075CeLJAW4mIq_G7s",
  type: "video",
};

function Header({ spotify }) {
  const [{ user, search_term }, dispatch] = useDataLayerValue();
  let loading = true;
  const [platform, setPlatform] = useState("Spotify");
  const search = (elem) => {
    dispatch({
      type: "SET_SEARCH_TERM",
      search_term: elem.target.value,
    });
    if (elem.key === "Enter" && search_term !== "") {
      invokeSearch(platform);
    }
  };

  // Conducts the search for all three platforms, and searches
  // the database to return  all songs that match the search query
  const invokeSearch = async (platform) => {
    setPlatform(platform);
    // platform can be "Spotify", "Soundcloud", or "Youtube"
    const results = []; // results of all the songs that will be added to the search results object
    if (platform === "Spotify") {
      await spotify.searchTracks(search_term).then(
        // uses built in spotify search function
        (data) => {
          data.tracks.items.map(
            (
              track // grabs data from each song
            ) => results.push(track)
          );
        }
      );
      console.log(results);
      dispatch({
        type: "SET_SEARCH",
        search: results,
      });
    } else if (platform === "Soundcloud") {
      const soundScraper = new SoundCloudScraper();
      let url = `/search/sounds?q=${search_term}`;
      let res = await soundScraper.getHtmlFromUrl(url);
      // await soundScraper.getHtmlFromUrl(url);
      res = res.substring(
        res.indexOf("<li><h2>"),
        res.lastIndexOf("</h2></li>")
      );
      console.log(res);
      let index = 0;
      let tracklist = [];
      while (index < res.length) {
        if (!loading) {
          loading = true;
        }
        let start = res.indexOf('"', index);
        let end = res.indexOf('"', start + 1);
        if (start === -1 || end === -1) {
          break;
        }
        let link = res.substring(start + 1, end);
        tracklist.push(link);
        index = end + 1;
        console.log(link);
      }
      loading = false;
      console.log(tracklist);
      console.log(await soundScraper.getSound(tracklist[0]));
      const resolved = await Promise.all(
        tracklist.map(async (link) => {
          return await soundScraper.getSound(link);
        })
      );
      console.log(resolved);
      resolved.map((song) =>
        results.push({
          platform: "Soundcloud",
          title: song.title,
          artist: song.user.username,
          pic: song.artwork_url,
          link: song.permalink_url,
        })
      );
      console.log(results);
      dispatch({
        type: "SET_SEARCH",
        search: results,
      });
    } else if (platform === "Youtube") {
      const searcher = require("youtube-search");
      console.log(search_term);
      const search = (await searcher(search_term, opts)).results;
      search.map((video) => {
        results.push({
          platform: "Youtube",
          title: video.title,
          artist: video.channelTitle,
          pic: video.thumbnails.high.url,
          link: "http://www.youtube.com/watch?v=" + video.id,
        });
      });
      console.log(search);
      console.log(results);
      dispatch({
        type: "SET_SEARCH",
        search: results,
      });
    }
    dispatch({
      type: "SET_PAGE",
      page: "Search",
    });
  };

  return (
    <div className="header">
      <div className="header_left">
        <SearchIcon />
        <input
          placeholder="Search"
          type="search"
          id="searchBar"
          onKeyDown={(e) => search(e)}
        />
        <img
          alt=""
          className={
            platform === "Spotify"
              ? "header_playerLogoActive"
              : "header_playerLogo"
          }
          src={Spot}
          onClick={() => invokeSearch("Spotify")}
        ></img>
        <img
          alt=""
          className={
            platform === "Soundcloud" ? "header_scActive" : "header_sc"
          }
          src={Sc}
          onClick={() => invokeSearch("Soundcloud")}
        ></img>
        <img
          alt=""
          className={platform === "Youtube" ? "header_ytActive" : "header_yt"}
          src={Yt}
          onClick={() => invokeSearch("Youtube")}
        ></img>
      </div>
      <div className="header_right">
        <Avatar src={user?.images[0]?.url} alt={user} />
        <h4>{user?.display_name}</h4>
      </div>
    </div>
  );
}

export default Header;
