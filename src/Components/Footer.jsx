import React, { useState, useEffect } from "react";
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

var script = document.createElement("script");
script.setAttribute(
  "src",
  "https://open.spotify.com/embed-podcast/iframe-api/v1"
);
document.body.appendChild(script);

// creates the footer/player element for the application
function Footer({ spotify }) {
  const [
    { item, playing, volume, platform, soundcloud, youtube, queue },
    dispatch,
  ] = useDataLayerValue();
  const [rPlaying, setrPlaying] = useState(false);
  const [api, setApi] = useState(null);
  const [spotifyPos, setSpotifyPos] = useState(null);

  useEffect(() => {
    if (platform === "Spotify") {
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
  }, [platform]);

  const setIframe = (IFrameAPI, seek = 0) => {
    let element = document.getElementById("embed-iframe");
    console.log(element);
    let options = {
      width: "300",
      height: "95",
      uri: `spotify:${item.type}:${item.id}`,
    };
    let callback = (EmbedController) => {
      EmbedController.addListener("ready", () => {
        console.log("The Embed has initialized");
        EmbedController.seek(seek);
      });
      EmbedController.addListener("playback_update", (e) => {
        const pos = e.data.position;
        setSpotifyPos(pos);
        console.log("Position: " + spotifyPos.current);
        if (e.data.position === e.data.duration) {
          console.log("Song Ended");
          console.log(queue);
          if (queue[0].platform === "Spotify") {
            EmbedController.loadUri(queue[0].item.uri);
            handleQueue();
          } else handleQueue();
        }
      });
      document.getElementById("toggle").addEventListener("click", () => {
        if (platform === "Spotify") {
          handlePlayPause();
          EmbedController.togglePlay();
        }
      });
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
    if (queue[0].platform === "Spotify") {
      // remove first element from queue
    } else {
      // play from react player
    }
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
    if (platform === "Spotify") {
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

  //Skips to the next song
  const skipNext = () => {
    if (platform === "Spotify") {
      console.log("skipped");
      const spotifyEmbedWindow = document.querySelector(
        'iframe[src*="spotify.com/embed"]'
      ).contentWindow;
      spotifyEmbedWindow.postMessage({ command: "next" }, "*");
    } else {
      // if(platform === "Soundcloud"){
      //   SoundcloudWidget(playerUrl).then(function(widget){
      //     widget.next();
      //   });
      // }
      // else {
      //   const youtubeEmbedWindow = document.querySelector('iframe[src*="youtube.com/embed"]').contentWindow;
      //   youtubeEmbedWindow.postMessage({command: 'next'}, '*');
      // }
    }
  };

  //Goes back to the previous song
  const skipPrevious = () => {};

  //Changes volume to the value specified
  const changeVolume = (value) => {
    dispatch({
      type: "SET_VOLUME",
      volume: value,
    });
  };

  // switches the player to the new platform on command
  const switchPlayer = (play) => {
    dispatch({
      type: "SET_PLATFORM",
      platform: play,
    });
  };

  return (
    <div
      className="footer"
      onKeyDown={(e) => {
        if (e.key === " ") {
          handlePlayPause();
        }
      }}
    >
      <div className="footer_left">
        <img alt="" src={Spot} onClick={() => switchPlayer("Spotify")}></img>
        <img
          id="sc"
          alt=""
          className="footer_playerLogo"
          src={Sc}
          onClick={() => switchPlayer("Soundcloud")}
        ></img>
        <img
          alt=""
          id="yt"
          src={Yt}
          onClick={() => switchPlayer("Youtube")}
        ></img>
        {platform === "Spotify" && ( // displays a spotify song
          <div>
            <div id="embed-iframe"></div>
          </div>
        )}
        {platform !== "Spotify" && ( //displays a youtube or soundcloud song
          <div className="footer_spotifyInfo">
            <ReactPlayer
              url={platform === "Soundcloud" ? soundcloud.link : youtube.link}
              playing={playing}
              volume={volume ? volume * 0.1 : 0.5}
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
        <ShuffleIcon className="footer_green" />
        <SkipPreviousIcon onClick={skipPrevious} className="footer_icon" />
        {platform === "Spotify" && (
          <div id="toggle">
            {playing ? (
              <PauseCircleFilledIcon
                onClick={handlePlayPause}
                fontSize="large"
                className="footer_icon"
              />
            ) : (
              <PlayCircleFilledIcon
                onClick={handlePlayPause}
                fontSize="large"
                className="footer_icon"
              />
            )}
          </div>
        )}
        {platform !== "Spotify" &&
          (playing ? (
            <PauseCircleFilledIcon
              onClick={handlePlayPause}
              fontSize="large"
              className="footer_icon"
            />
          ) : (
            <PlayCircleFilledIcon
              onClick={handlePlayPause}
              fontSize="large"
              className="footer_icon"
            />
          ))}
        <SkipNextIcon onClick={skipNext} className="footer_icon" />
        <RepeatIcon className="footer_green" />
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
              defaultValue={volume ? volume : 50}
              onChange={(_, value) => changeVolume(value)}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Footer;
