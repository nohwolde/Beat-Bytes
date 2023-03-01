import React, { useState, useEffect, useRef } from "react";
import "../styles/Footer.scss";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import RepeatIcon from "@material-ui/icons/Repeat";
import { Grid, Slider } from "@material-ui/core";
import PlaylistPlayIcon from "@material-ui/icons/PlaylistPlay";
import VolumeDownIcon from "@material-ui/icons/VolumeDown";
import { useDataLayerValue } from "../DataLayer";
import Sc from "./pics/soundcloud.svg";
import Spot from "./pics/spot.svg";
import Yt from "./pics/yt.svg";
import ReactPlayer from "react-player";
import useQueue from "../store";
import { useActions } from "../store";
import { useSpotify } from "../store";
import shuffle from "./pics/shuffle.png";

var script = document.createElement("script");
script.setAttribute(
  "src",
  "https://open.spotify.com/embed-podcast/iframe-api/v1"
);
document.body.appendChild(script);

// creates the footer/player element for the application
function Footer({ spotify }) {
  const [{ item, soundcloud, youtube }, dispatch] = useDataLayerValue();
  const skipButton = useRef(null);
  const prevButton = useRef(null);

  // Queue actions
  const getQueue = useQueue((state) => state.getQueue);
  const getPlaying = useQueue((state) => state.getPlaying);
  const pop = useQueue((state) => state.pop);
  const back = useQueue((state) => state.back);

  // Reverse actions
  const getReverseStatus = useActions((state) => state.getReverseStatus);
  const reverse = useActions((state) => state.reverse);
  const resetReverse = useActions((state) => state.resetReverse);
  const setPlaybackStatus = useActions((state) => state.setPlaybackStatus);
  const getPlaybackStatus = useActions((state) => state.getPlaybackStatus);
  const setVolume = useActions((state) => state.setVolume);
  const volume = useActions((state) => state.volume);
  const playing = useActions((state) => state.playing);
  const setPlaying = useActions((state) => state.setPlaying);

  // Platform actions
  const setPlatform = useActions((state) => state.setPlatform);
  const getPlatform = useActions((state) => state.getPlatform);
  const platform = useActions((state) => state.platform);
  const setSkipButton = useActions((state) => state.setSkipButton);
  const setReverseButton = useActions((state) => state.setReverseButton);

  const [rPlaying, setrPlaying] = useState(false);
  const [api, setApi] = useState(null);
  const [spotifyPos, setSpotifyPos] = useState(null);

  useEffect(() => {
    setSkipButton(skipButton);
    setReverseButton(prevButton);
  });

  useEffect(() => {
    if (getPlatform() === "Spotify") {
      console.log("loading spotify player");
      if (api === null) {
        window.onSpotifyIframeApiReady = (IFrameAPI) => {
          setApi(IFrameAPI);
          console.log(IFrameAPI);
          setIframe(IFrameAPI);
        };
      } else {
        console.log("spotify player already loaded");
        setIframe(api, spotifyPos);
      }
    }
  }, [platform, item]);

  const setIframe = (IFrameAPI, seek = 0) => {
    let element = document.getElementById("embed-iframe");
    console.log(element);
    let options = {
      width: "300",
      height: "95",
      uri: getQueue()?.item.track.uri,
      allow: "encrypted-media",
    };
    let callback = (EmbedController) => {
      EmbedController.addListener("ready", () => {
        console.log("The Embed has initialized");
        EmbedController.seek(seek);
        setPlaying(true);
        EmbedController.play();
      });
      EmbedController.addListener("playback_update", (e) => {
        setPlaybackStatus(e.data);
        if (e.data.position === e.data.duration) {
          console.log("Song Ended");
          console.log(getQueue());
          if (getQueue().platform === "Spotify") {
            const nextItem = getQueue().item.track.uri;
            EmbedController.loadUri(nextItem);
          }
          handleQueue();
        }
      });
      document.getElementById("toggle").addEventListener("click", () => {
        if (getPlatform() === "Spotify") {
          setPlaying(true);
          EmbedController.togglePlay();
        }
      });
      document.getElementById("next").addEventListener("click", () => {
        if (getPlatform() === "Spotify") {
          console.log("next");
          if (getQueue() ? true : false) {
            if (getQueue()?.platform === "Spotify") {
              pop();
              const nextItem = getQueue().item.track.uri;
              EmbedController.loadUri(nextItem);
            } else handleQueue();
          } else {
            EmbedController.play();
          }
        }
      });
      document.getElementById("prev").addEventListener("click", () => {
        if (getPlatform() === "Spotify") {
          if (
            getPlaybackStatus().position > 4000 || getQueue() ? true : false
          ) {
            // go back one song in the queue
            if (getQueue().platform === "Spotify") {
              back();
              EmbedController.loadUri(getQueue().item.track.uri);
            } else handleQueue();
          } else {
            EmbedController.play();
          }
        }
      });
      // { item: { track: { uri: "spotify:track:6Q0Cw0qZzZ4zjxYQZ7QoZa" }, platform="Spotify"}
      document.getElementById("sc").addEventListener("click", () => {
        console.log("destroying spotify player");
        EmbedController.destroy();
      });
      document.getElementById("yt").addEventListener("click", () => {
        console.log("destroying spotify player");
        EmbedController.destroy();
      });
    };
    IFrameAPI.createController(element, options, callback);
  };

  //adds to youtube queue and/or removes the first element from the queue
  const handleQueue = () => {
    if (getQueue().platform === "Spotify") {
      // remove first element from queue
      setPlatform("Spotify");
    } else {
      // play from react player
      if (getQueue().platform === "SoundCloud") {
        if (platform !== "Soundcloud") setPlatform("SoundCloud");
        dispatch({
          type: "SET_SOUNDCLOUD",
          soundcloud: getQueue().item,
        });
      } else {
        if (platform !== "YouTube") setPlatform("YouTube");
        dispatch({
          type: "SET_YOUTUBE",
          youtube: getQueue().item,
        });
      }
    }
    pop();
  };

  //Updates currently playing song and play/pause status of the player
  // useEffect(() => {
  //   spotify.getMyCurrentPlaybackState().then((r) => {
  //     if(r !== null && r !== undefined){
  //       dispatch({
  //           type: "SET_ITEM",
  //           item: r.item
  //       });
  //     }
  //   });
  //   console.log(item)
  // }, [item, playing]);

  //Updates the volume bar to match the levels in the spotify player
  // useEffect(() => {
  //     spotify.getVolume().then((vol) => {
  //         console.log(vol)
  //         dispatch({
  //             type: "SET_VOLUME",
  //             volume: vol
  //         });
  //     })
  // }, [item, playing, dispatch])

  //Pauses and plays the spotify player
  const handlePlayPause = () => {
    if (getPlatform() === "Spotify") {
      // const spotifyEmbedWindow = document.querySelector(
      //   'iframe[src*="spotify.com/embed"]'
      // ).contentWindow;
      // spotifyEmbedWindow.postMessage({ command: "toggle" }, "*");
      if (playing === null) {
        dispatch({
          type: "SET_PLAYING",
          playing: true,
        });
      } else if (!playing) {
        dispatch({
          type: "SET_PLAYING",
          playing: !playing,
        });
      } else {
        dispatch({
          type: "SET_PLAYING",
          playing: !playing,
        });
      }
    } else {
      if (rPlaying) {
        setrPlaying(false);
        dispatch({
          type: "SET_PLAYING",
          playing: !rPlaying,
        });
      }
      setrPlaying(!rPlaying);
      dispatch({
        type: "SET_PLAYING",
        playing: !rPlaying,
      });
    }
  };

  const handleEnded = () => {
    console.log("song ended");
    setPlaying(true);
    handleQueue();
  };

  return (
    <div
      className="footer"
      onKeyDown={(e) => {
        if (e.key === " ") {
          setPlaying(true);
        }
      }}
    >
      <div className="footer_left">
        <img alt="" src={Spot} onClick={() => setPlatform("Spotify")}></img>
        <img
          id="sc"
          alt=""
          className="footer_playerLogo"
          src={Sc}
          onClick={() => setPlatform("Soundcloud")}
        ></img>
        <img
          alt=""
          id="yt"
          src={Yt}
          onClick={() => setPlatform("Youtube")}
        ></img>
        {getPlatform() === "Spotify" && ( // displays a spotify song
          <div>
            <div id="embed-iframe"></div>
          </div>
        )}
        {getPlatform() !== "Spotify" && ( //displays a youtube or soundcloud song
          <div className="footer_spotifyInfo">
            <ReactPlayer
              url={
                getPlatform() === "Soundcloud" ? soundcloud.link : youtube.link
              }
              playing={playing}
              volume={volume}
              onProgress={(e) => {}}
              onEnded={handleEnded}
              height="90px"
              width="300px"
              config={{
                soundcloud: {
                  options: {
                    auto_play: true,
                    color: "#301934",
                  },
                },
                youtube: {
                  playerVars: {
                    autoplay: 1,
                    controls: 1,
                    autohide: 1,
                    wmode: "opaque",
                    origin: "http://localhost:3000",
                  },
                },
              }}
            />
          </div>
        )}
      </div>
      <div className="footer_center">
        <img src={shuffle} className="footer_shuffle" onClick={() => {}} />
        <div id="prev" ref={prevButton}>
          <SkipPreviousIcon className="footer_icon" />
        </div>
        <div id="toggle">
          {playing ? (
            <PauseCircleFilledIcon
              onClick={() => setPlaying(false)}
              fontSize="large"
              className="footer_icon"
            />
          ) : (
            <PlayCircleFilledIcon
              onClick={() => setPlaying(true)}
              fontSize="large"
              className="footer_icon"
            />
          )}
        </div>
        <div id="next" ref={skipButton}>
          <SkipNextIcon className="footer_icon" />
        </div>
        <RepeatIcon className="footer_icon" />
      </div>
      <div className="footer_right">
        <Grid container spacing={2}>
          <Grid item>
            <PlaylistPlayIcon />
          </Grid>
          <Grid item>
            <VolumeDownIcon />
          </Grid>
          <Grid item xs>
            <Slider
              defaultValue={volume * 100}
              onChange={(_, value) => {
                setVolume(value * 0.01);
                console.log(value);
              }}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Footer;
