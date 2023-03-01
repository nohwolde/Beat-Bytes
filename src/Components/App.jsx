import "../styles/App.scss";
import React, { useEffect } from "react";
import Loading from "./Loading.jsx";
import SpotifyWebApi from "spotify-web-api-js";
import { useDataLayerValue } from "../DataLayer";
import Player from "./Player.jsx";
import axios from "axios";
import { useSpotify } from "../store";

var spotify = new SpotifyWebApi();

function App() {
  const [{}, dispatch] = useDataLayerValue();
  const setSpotify = useSpotify((state) => state.setSpotify);
  const token = useSpotify((state) => state.token);
  const setToken = useSpotify((state) => state.setToken);
  const setUser = useSpotify((state) => state.setUser);
  const setPlaylists = useSpotify((state) => state.setPlaylists);
  const setTopArtists = useSpotify((state) => state.setTopArtists);
  const addToPlaylist = useSpotify((state) => state.addToPlaylist);

  function getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    e = r.exec(q);
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
  }

  useEffect(async () => {
    const hash = getHashParams();
    window.location.hash = "";
    const _token = hash.access_token;
    const _refresh = hash.refresh_token;
    console.log(_refresh);
    if (_token) {
      setToken(_token);
      spotify.setAccessToken(_token);
      await Promise.all([fetchPlaylists(), fetchUser(), fetchTopArtists()])
        .then(async (values) => {
          console.log(values);
          const playlists = await Promise.all([
            values[0].map((playlist) => {
              return {
                playlistID: playlist.id,
                beatbytesSongs: [],
              };
            }),
          ]);
          return Promise.resolve(
            await axios.post("/db/user/login_or_create", {
              userID: values[1].id,
              playlists: playlists[0],
              profilePhoto: values[1].images[0].url,
            })
          );
        })
        .then((user) => {
          console.log(user.data);
          user.data.playlists.map((playlist) => {
            playlist.beatbytesSongs.length > 0
              ? playlist.beatbytesSongs.map((song) => {
                  addToPlaylist(playlist.playlistID, song);
                })
              : null;
          });
        });
      setSpotify(spotify);
    }
    console.log("I have a token: ", token);
  }, [token]);

  async function fetchPlaylists() {
    const lst = [];
    await spotify
      .getUserPlaylists()
      .then(
        async (playlists) =>
          await Promise.all(
            playlists.items.map(async (playlist) => {
              await spotify.getPlaylist(playlist.id).then((response) => {
                lst.push(response);
              });
            })
          )
      )
      .then(() => {
        setPlaylists(lst);
        console.log(lst);
        return lst;
      });
    return lst;
  }

  async function fetchTopArtists() {
    return await spotify.getMyTopArtists().then((response) => {
      console.log(response);
      setTopArtists(response);
      return response;
    });
  }

  async function fetchUser() {
    return await spotify.getMe().then((user) => {
      setUser(user);
      console.log(user);
      return user;
    });
  }

  return (
    <div className="app">
      {token ? (
        <Player spotify={spotify}></Player>
      ) : (
        <div>
          <Loading />
        </div>
      )}
    </div>
  );
}
export default App;
