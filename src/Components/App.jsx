import "../styles/App.scss";
import React, { useEffect } from "react";
import Loading from "./Loading.jsx";
import SpotifyWebApi from "spotify-web-api-js";
import Player from "./Player.jsx";
import axios from "axios";
import { useSpotify } from "../store";
import { useQueue } from "../store";
import { useActions } from "../store";

var spotify = new SpotifyWebApi();

function App() {
  //SPOTIFY
  const setSpotify = useSpotify((state) => state.setSpotify);
  const token = useSpotify((state) => state.token);
  const setToken = useSpotify((state) => state.setToken);
  const setUser = useSpotify((state) => state.setUser);
  const setPlaylists = useSpotify((state) => state.setPlaylists);
  const getPlaylists = useSpotify((state) => state.getPlaylists);
  const setTopArtists = useSpotify((state) => state.setTopArtists);
  const addToPlaylist = useSpotify((state) => state.addToPlaylist);
  const addPlaylist = useSpotify((state) => state.addPlaylist);
  const addToBeatbytes = useSpotify((state) => state.addToBeatbytes);
  const pop = useQueue((state) => state.pop);

  //ACTIONS
  const skip = useActions((state) => state.skip);
  const reverse = useActions((state) => state.reverse);

  //QUEUE
  const addQueue = useQueue((state) => state.addQueue);
  const back = useQueue((state) => state.back);

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
    console.log(hash);
    if (_token) {
      setToken(_token);
      spotify.setAccessToken(_token);
      setSpotify(spotify);
      await Promise.all([
        fetchPlaylists(),
        fetchUser(),
        fetchTopArtists(),
      ]).then(async (values) => {
        console.log(values);
        const playlists = await Promise.all([
          values[0].map((playlist) => {
            return {
              id: playlist.id,
              name: playlist.name,
              playlist: playlist.playlist,
              platform: "Spotify",
              images: playlist.images,
              owner: playlist.owner,
              description: playlist.description,
            };
          }),
        ]);
        await Promise.resolve(
          await axios.post("/db/user/login_or_create", {
            id: values[1].id,
            playlists: [],
            profilePhoto: values[1].images[0].url,
            displayName: values[1].display_name,
          }) //add an error check for the next line to add the playlist one by one using create playlist if it fails
        )
          .then(async (user) => {
            if (user.data.playlists.length === 0) {
              await Promise.all(
                values[0].map((playlist) =>
                  axios.post("/db/user/createPlaylist", {
                    id: values[1].id,
                    playlist: {
                      ...playlist,
                      playlist: playlist.playlist.filter(
                        (track) =>
                          !(track.item.is_local ? track.item.is_local : false)
                      ),
                    },
                  })
                )
              );
            }
            return values[1].id;
          })
          .then(async (id) => {
            console.log(values);
            const user = await axios.get("/db/user/getUser", {
              params: {
                id: id,
              },
            });
            if (user) {
              setPlaylists(user.data.playlists);
            }
          });
      });
    }
    console.log("I have a token: ", _token);
  }, []);

  async function fetchPlaylists() {
    // await spotify.getMyCurrentPlayingTrack().then((response) => {
    //   console.log("User Playlists:", response);
    //   if (response.item ? response.item !== null : false) {
    //     addQueue({ item: response.item, platform: "Spotify" });
    //     pop();
    //   }
    // });
    const lst = [];
    await spotify
      .getUserPlaylists()
      .then(
        async (playlists) =>
          await Promise.all(
            playlists.items.map(async (playlist) => {
              await spotify.getPlaylist(playlist.id).then(async (response) => {
                console.log("User's Playlists", response);
                lst.push({
                  playlist: await Promise.all(
                    response.tracks.items.map((track) => {
                      return {
                        item: {
                          name: track.track.name,
                          id: track.track.id,
                          is_local: track.is_local,
                          artists: [
                            ...track.track.artists.map((artist) => {
                              return {
                                id: artist.id,
                                name: artist.name,
                                uri: artist.uri,
                              };
                            }),
                          ],
                          album: {
                            name: track.track.album.name,
                            id: track.track.album.id,
                            images: [
                              track.track.album.images[0]
                                ? track.track.album.images[0].url
                                : "",
                            ],
                            is_playable: track.track.album.is_playable,
                            uri: track.track.album.uri,
                          },
                          uri: track.track.uri,
                        },
                        platform: "Spotify",
                      };
                    })
                  ),
                  id: response.id,
                  name: response.name,
                  platform: "Spotify",
                  description: response.description,
                  images: [response.images[0] ? response.images[0].url : ""],
                  owner: {
                    link: response.owner
                      ? response.owner.external_urls.spotify
                      : "",
                  },
                });
              });
            })
          )
      )
      .then(() => {
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
    <div>
      <div className={token ? "" : "disabled"}>
        <Player spotify={spotify}></Player>
      </div>
      {!token && (
        <div className="AppBlur">
          <Loading />
        </div>
      )}
    </div>
  );
}
export default App;
