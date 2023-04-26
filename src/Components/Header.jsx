import React, { useState, useRef, useEffect } from "react";
import "../styles/Header.scss";
import SearchIcon from "@material-ui/icons/Search";
import { Avatar } from "@material-ui/core";
import { SoundCloudScraper } from "./SoundcloudScraper.jsx";
import Sc from "./pics/soundcloudDark.svg";
import Spot from "./pics/spotDark.svg";
import Yt from "./pics/ytDark.svg";
import { useSpotify } from "../store";
import { useActions } from "../store";
import { useSearch } from "../store";
import axios from "axios";

function Header({ spotify, setLoading }) {
  // SPOTIFY
  const user = useSpotify((state) => state.user);
  const token = useSpotify((state) => state.token);

  // ACTIONS
  const setPage = useActions((state) => state.setPage);
  const getPage = useActions((state) => state.getPage);
  const setSearch = useSearch((state) => state.setSearch);
  const pushSearch = useSearch((state) => state.pushSearch);

  // STATES
  const searchPlatform = useSearch((state) => state.searchPlatform);
  const setSearchPlatform = useSearch((state) => state.setSearchPlatform);
  const getSearchPlatform = useSearch((state) => state.getSearchPlatform);

  const searchRef = useRef();

  // Conducts the search for all three platforms, and searches
  // the database to return  all songs that match the search query
  const invokeSearch = async (platform) => {
    setSearchPlatform(platform);
    console.log(platform);
    // platform can be "Spotify", "Soundcloud", or "Youtube"
    const results = []; // results of all the songs that will be added to the search results object
    setPage("Search");
    setLoading(false);
    if (platform === "Spotify") {
      setSearch([]);
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      const processBatch = async (urls, query) => {
        const trackRequests = urls.map(async (url) => {
          const trackResponse = await axios
            .post("/spotify/getTrack", {
              url: url,
            })
            .then((track) => {
              return {
                item: {
                  name: track.data.name,
                  id: track.data.id,
                  is_local: false,
                  uri: track.data.uri,
                  title: track.data.name,
                  type: "track",
                  album: {
                    id: track.id,
                    images: [
                      track.data.coverArt.sources[0]
                        ? track.data.coverArt.sources[0].url
                        : "",
                    ],
                    name: track.data.name,
                    uri: track.data.uri,
                    is_playable: true,
                  },
                  artists: [...track.data.artists],
                },
                platform: platform,
              };
            });
          return trackResponse;
        });

        const tracks = await Promise.all(trackRequests);
        console.log(tracks);
        if (
          getSearchPlatform() === "Spotify" &&
          query === searchRef.current.value
        )
          pushSearch(tracks);
        return tracks;
      };

      const searchTracks = async () => {
        try {
          const query = searchRef.current.value;
          const searchResponse = await axios.post("/spotify/search", {
            query: query,
          });

          const urls = searchResponse.data;
          const batchSize = 10;
          const trackResults = [];
          for (let i = 0; i < urls.length; i += batchSize) {
            const batch = urls.slice(i, i + batchSize);
            const tracks = await processBatch(batch, query);
            if (
              !(
                getSearchPlatform() === "Spotify" &&
                query === searchRef.current.value
              )
            )
              break;
            else results.push(...tracks);
            await delay(500); // Add a delay between batches, adjust as needed
          }

          console.log(trackResults);
          return trackResults;
        } catch (error) {
          console.error("Error:", error);
        }
      };
      await searchTracks();
    } else if (platform === "Soundcloud") {
      setSearch([]);
      setLoading(true);
      const soundScraper = new SoundCloudScraper();
      let url = `/sc/search`;
      let res = (await axios.post(url, { query: searchRef.current.value }))
        .data;
      console.log(res);
      res = res.substring(
        res.indexOf("<li><h2>"),
        res.lastIndexOf("</h2></li>")
      );
      console.log(res);
      let index = 0;
      let tracklist = [];
      while (index < res.length) {
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
      console.log(tracklist);
      const resolved = await Promise.all(
        tracklist.map(async (link) => {
          return await soundScraper.extractSound(
            (
              await axios.post("/sc/track", { trackID: link })
            ).data
          );
        })
      );
      resolved.map((song) => {
        results.push({
          item: song,
          platform: "Soundcloud",
          title: song.title,
          artist: song.user.username,
          pic: song.artwork_url,
          link: song.permalink_url,
        });
      });
      console.log(results);
      setSearch(results);
      setLoading(false);
    } else if (platform === "Youtube") {
      const url = "/yt/search";
      await axios.post(url, { query: searchRef.current.value }).then((res) => {
        console.log(res.data[0]);
        results.push(
          ...res.data.map((song) => ({
            item: song,
            platform: "Youtube",
            title: song.title.replace(/&#(\d+);/g, (match, dec) =>
              String.fromCharCode(dec)
            ),
            artist: song.channelTitle,
            pic: song.thumbnails.high.url
              ? song.thumbnails.high.url
              : song.thumbnails.medium.url
              ? song.thumbnails.medium.url
              : song.thumbnails.default,
            link: song.link,
          }))
        );
      });
      console.log(results);
      setSearch(results);
    }
    setPage("Search");
  };

  return (
    <div className="header">
      <div className="header_left">
        <SearchIcon fontSize="large" />
        <input
          placeholder={`Search from ${searchPlatform}`}
          type="search"
          id="searchBar"
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchRef.current.value !== "")
              invokeSearch(searchPlatform);
          }}
          ref={searchRef}
        />
        <div className="header_leftButtons">
          <img
            alt=""
            className={
              (searchPlatform === "Spotify") | (token === null)
                ? "header_playerLogoActive"
                : "header_playerLogo"
            }
            src={Spot}
            onClick={() => invokeSearch("Spotify")}
          ></img>
          <img
            alt=""
            className={
              searchPlatform === "Soundcloud" ? "header_scActive" : "header_sc"
            }
            src={Sc}
            onClick={() => invokeSearch("Soundcloud")}
          ></img>
          <img
            alt=""
            className={
              searchPlatform === "Youtube" ? "header_ytActive" : "header_yt"
            }
            src={Yt}
            onClick={() => invokeSearch("Youtube")}
          ></img>
        </div>
      </div>
      <a href={user?.external_urls?.spotify} target="_blank">
        <div className="header_right">
          <Avatar src={user?.images[0]?.url} alt={user} />
          <h4>{user?.display_name}</h4>
        </div>
      </a>
    </div>
  );
}

export default Header;
