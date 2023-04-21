import React, { useState, useEffect, useRef } from "react";
import "../styles/Footer.scss";

import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import RepeatIcon from "@material-ui/icons/Repeat";
import { Grid, Slider } from "@material-ui/core";
import PlaylistPlayIcon from "@material-ui/icons/PlaylistPlay";
import VolumeDownIcon from "@material-ui/icons/VolumeDown";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";

import Sc from "./pics/soundcloud.svg";
import Spot from "./pics/spot.svg";
import Yt from "./pics/yt.svg";
import ReactPlayer from "react-player";
import { useQueue, useSpotify } from "../store";
import { useActions } from "../store";
import shuffle from "./pics/shuffle.png";

var script = document.createElement("script");
script.setAttribute(
  "src",
  "https://open.spotify.com/embed-podcast/iframe-api/v1"
);
document.body.appendChild(script);

// creates the footer/player element for the application
function Footer({ spotify }) {
  const skipButton = useRef(null);
  const reverseButton = useRef(null);
  const pauseButton = useRef(null);
  const playerRef = useRef(null);

  // Queue actions
  const getQueue = useQueue((state) => state.getQueue);
  const getFullQueue = useQueue((state) => state.getFullQueue);
  const getPlaying = useQueue((state) => state.getPlaying);
  const pop = useQueue((state) => state.pop);
  const back = useQueue((state) => state.back);
  const getQueuePosition = useQueue((state) => state.getQueuePosition);
  const getQueueLength = useQueue((state) => state.getQueueLength);
  const addQueue = useQueue((state) => state.addQueue);
  const addFrontQueue = useQueue((state) => state.addFrontQueue);
  const resetPlaylistPosition = useQueue(
    (state) => state.resetPlaylistPosition
  );
  // ReactPlayer actions
  const soundcloud = useQueue((state) => state.soundcloud);
  const youtube = useQueue((state) => state.youtube);
  const setSoundcloud = useQueue((state) => state.setSoundcloud);
  const setYoutube = useQueue((state) => state.setYoutube);
  const getSoundcloud = useQueue((state) => state.getSoundcloud);
  const getYoutube = useQueue((state) => state.getYoutube);
  const setFirstRender = useQueue((state) => state.setFirstRender);
  const getFirstRender = useQueue((state) => state.getFirstRender);

  // Spotify actions
  const setPlaylist = useQueue((state) => state.setPlaylist);
  const getPlaylist = useQueue((state) => state.getPlaylist);
  const getPlaylistNext = useQueue((state) => state.getPlaylistNext);
  const skipPlaylist = useQueue((state) => state.skipPlaylist);
  const getPlaylistPosition = useQueue((state) => state.getPlaylistPosition);
  const setPlaylistPosition = useQueue((state) => state.setPlaylistPosition);

  // Reverse actions
  const setPlaybackStatus = useActions((state) => state.setPlaybackStatus);
  const getPlaybackStatus = useActions((state) => state.getPlaybackStatus);
  const setVolume = useActions((state) => state.setVolume);
  const volume = useActions((state) => state.volume);
  const playing = useActions((state) => state.playing);
  const setPlaying = useActions((state) => state.setPlaying);
  const getShuffleState = useActions((state) => state.getShuffleState);
  const setShuffleState = useActions((state) => state.setShuffleState);
  const shuffleState = useActions((state) => state.shuffleState);

  // Platform actions
  const setPlatform = useActions((state) => state.setPlatform);
  const getPlatform = useActions((state) => state.getPlatform);
  const platform = useActions((state) => state.platform);
  const setSkipButton = useActions((state) => state.setSkipButton);
  const setReverseButton = useActions((state) => state.setReverseButton);
  const setPauseButton = useActions((state) => state.setPauseButton);
  const getPlayingStatus = useActions((state) => state.getPlayingStatus);
  const setEmbedController = useSpotify((state) => state.setEmbedController);

  const skip = useActions((state) => state.skip);

  // Page actions
  const setPage = useActions((state) => state.setPage);

  const [rPlaying, setrPlaying] = useState(false);
  const [api, setApi] = useState(null);
  const [spotifyPos, setSpotifyPos] = useState(null);

  useEffect(() => {
    getQueue();
  }, [getQueue()]);

  useEffect(() => {
    setSkipButton(skipButton);
  }, [skipButton]);

  useEffect(() => {
    setReverseButton(reverseButton);
  }, [reverseButton]);

  useEffect(() => {
    setPauseButton(pauseButton);
  }, [pauseButton]);

  useEffect(() => {
    getShuffleState();
  }, [shuffleState]);

  useEffect(() => {
    if (getPlatform() === "Spotify") {
      console.log("loading spotify player");
      if (api === null) {
        window.onSpotifyIframeApiReady = (IFrameAPI) => {
          setApi(IFrameAPI);
          console.log(IFrameAPI);
          setIframe(IFrameAPI);
          console.log(getFullQueue());
        };
      } else {
        console.log("spotify player already loaded");
        // figure out if we can do this without removing the iframe
        setIframe(api, spotifyPos);
      }
    }
  }, [platform]);

  const setIframe = (IFrameAPI) => {
    let element = document.getElementById("embed-iframe");
    console.log(element);
    let options = {
      width: "400",
      height: "95",
      uri:
        getQueue()?.item.uri ||
        getPlaylistNext()?.item.uri ||
        "spotify:track:2Y0wPrPQBrGhoLn14xRYCG",
      allow: "encrypted-media",
    };
    let callback = (EmbedController) => {
      EmbedController.addListener("ready", () => {
        console.log("The Embed has initialized");
        if (!getFirstRender()) {
          console.log("playing as normal");
          setPlaying(true);
          EmbedController.togglePlay();
        } else setFirstRender(false);
        setEmbedController(EmbedController);
      });
      EmbedController.addListener("playback_update", (e) => {
        setPlaybackStatus(e.data);
        if (e.data.position === e.data.duration && !e.data.isPaused) {
          console.log(e.data);
          console.log("Song Ended");
          console.log(getPlaylist());
          skip();
        }
        if (e.data.isPaused !== !getPlayingStatus()) {
          setPlaying(!e.data.isPaused);
        }
      });
      document.getElementById("toggle").addEventListener("click", () => {
        if (getPlatform() === "Spotify") {
          if (getPlaybackStatus() === null || getPlaybackStatus().isPaused) {
            setPlaying(true);
            EmbedController.togglePlay();
          } else {
            setPlaying(false);
            EmbedController.pause();
          }
        }
      });

      function handleItem(nextItem, backwards = false) {
        if (nextItem.platform === "Spotify") {
          console.log(nextItem);
          EmbedController.loadUri(nextItem.item.uri);
          console.log(getPlaybackStatus());
        } else {
          document
            .getElementById("next")
            .removeEventListener("click", skipNext);
          document.getElementById("prev").removeEventListener("click", goBack);
          EmbedController.destroy();
          if (!backwards) back();
          else pop();
          setPlatform(nextItem.platform);
          console.log("Platform:", nextItem.platform);
        }
      }

      function skipNext() {
        console.log("Queue Position:", getQueuePosition());
        console.log("Full Queue:", getFullQueue());
        console.log("Playlist Position:", getPlaylistPosition());
        console.log("Playlist:", getPlaylist());
        console.log("Queue Next", getQueue());
        console.log("Playlist Next", getPlaylistNext());
        if (getPlatform() === "Spotify") {
          if (getQueueLength() === getQueuePosition() + 1) {
            if (getPlaylist().playlist.length !== getPlaylistPosition() + 1) {
              skipPlaylist();
              const nextItem = getPlaylistNext();
              if (nextItem !== undefined) {
                addFrontQueue(nextItem);
                pop();
                handleItem(nextItem);
              } else console.log("ERROR: nextItem is undefined");
            } else {
              resetPlaylistPosition();
              const nextItem = getPlaylistNext();
              if (nextItem !== undefined) {
                addFrontQueue(nextItem);
                pop();
                handleItem(nextItem);
              } else console.log("ERROR: nextItem is undefined");
            }
          } else {
            pop();
            console.log("next");
            const nextItem = getQueue();
            console.log("Skipping to: ", nextItem);
            console.log(getQueuePosition());
            if (nextItem !== undefined) {
              handleItem(nextItem);
            } else console.log("ERROR: nextItem is undefined");
          }
        }
      }

      function goBack() {
        console.log(getQueuePosition());
        if (getPlatform() === "Spotify") {
          if (getPlaybackStatus().position < 4000 && getQueuePosition() > 0) {
            back();
            const prevItem = getQueue();
            console.log(prevItem);
            console.log(getFullQueue());
            console.log(getQueuePosition());
            // go back one song in the queue
            handleItem(prevItem, true);
          } else {
            // restart the current song
            console.log("restarting song");
            EmbedController.seek(0);
          }
        }
      }

      function destroy() {
        console.log("destroying spotify player");
        EmbedController.destroy();
      }
      document.getElementById("next").addEventListener("click", skipNext);
      document.getElementById("prev").addEventListener("click", goBack);
    };
    IFrameAPI.createController(element, options, callback);
  };

  //adds to youtube queue and/or removes the first element from the queue
  const handleQueue = (item) => {
    console.log(getFullQueue());
    console.log(getQueuePosition());
    setPlatform(item.platform);
    if (item.platform === "Spotify") {
      setPlatform("Spotify");
    } else {
      console.log(getPlaying());
      console.log(item);
      // play from react player
      if (item.platform === "Soundcloud") {
        setSoundcloud(item);
        setPlatform("Soundcloud");
      } else {
        setYoutube(item);
        setPlatform("Youtube");
      }
    }
  };

  const handleReverse = () => {
    console.log("reverse");
    if (getPlatform() !== "Spotify") {
      if (playerRef.current.getCurrentTime() <= 4) {
        // go back one song in the queue
        back();
        if (getQueue() !== undefined) handleQueue(getQueue());
        else console.log("Error in handleReverse");
      } else {
        playerRef.current.seekTo(0, "seconds");
      }
    }
  };

  const handleNext = () => {
    if (getPlatform() !== "Spotify") {
      console.log("Normal Actions for Youtube Skip");
      console.log("Queue Position:", getQueuePosition());
      console.log("Full Queue:", getFullQueue());
      console.log("Playlist Position:", getPlaylistPosition());
      console.log("Playlist:", getPlaylist());
      console.log("Queue Next", getQueue());
      console.log("Playlist Next", getPlaylistNext());
      if (getQueueLength() === getQueuePosition() + 1) {
        if (getPlaylist().playlist.length !== getPlaylistPosition() + 1) {
          skipPlaylist();
          console.log("Getting Playlist:", getPlaylist());
          const nextItem = getPlaylistNext();
          if (nextItem !== undefined) {
            addFrontQueue(nextItem);
            pop();
            handleQueue(nextItem);
            console.log("nextItem", nextItem);
          } else console.log("ERROR: nextItem is undefined");
        } else {
          console.log("Playlist is over");
          resetPlaylistPosition();
          const nextItem = getPlaylistNext();
          if (nextItem !== undefined) {
            addFrontQueue(nextItem);
            pop();
            handleQueue(nextItem);
            console.log("nextItem", nextItem);
          } else console.log("ERROR: nextItem is undefined");
        }
      } else {
        pop();
        const nextItem = getQueue();
        console.log("Skipping to: ", nextItem);
        console.log(getQueuePosition());
        if (nextItem !== undefined) {
          handleQueue(nextItem);
          console.log("nextItem", nextItem);
        } else console.log("ERROR: nextItem is undefined");
      }
    }
  };

  const handleUnshuffle = () => {
    setShuffleState(!getShuffleState());
    console.log("Unshuffling: ", getShuffleState());
    if (getPlaylist() !== null) {
      console.log("Unshuffling playlist:");
      let position = 0;

      for (let i = 0; i < getPlaylist().playlist.length; i++) {
        if (getPlaylist().playlist[i].item.id === getQueue().item.id) {
          console.log("Found position: ", i);
          position = i;
          break;
        }
      }

      let playlist = getPlaylist().playlist.filter(
        (song) => song.item.id !== getQueue().item.id
      );

      setPlaylist({
        ...getPlaylist(),
        playlist: playlist,
      });
      setPlaylistPosition(position - 1);
    }
  };

  const handleShuffle = () => {
    setShuffleState(!getShuffleState());
    if (getPlaylist() !== null) {
      let position = 0;

      for (let i = 0; i < getPlaylist().playlist.length; i++) {
        if (getDiscoverWeekly().playlist[i].item.id === getQueue().item.id) {
          position = i;
          break;
        }
      }

      const playlist = getDiscoverWeekly().playlist.slice(position);

      setPlaylist({
        ...getDiscoverWeekly(),
        playlist: playlist,
      });
    }
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
        {platform === "Spotify" && (
          <img alt="" className="footer_playerLogo" src={Spot}></img>
        )}
        {getPlatform() === "Soundcloud" && (
          <img id="sc" alt="" className="footer_playerLogo" src={Sc}></img>
        )}
        {getPlatform() === "Youtube" && (
          <img alt="" id="yt" className="footer_playerLogo" src={Yt}></img>
        )}
        {getPlatform() === "Spotify" && ( // displays a spotify song
          <div>
            <div id="embed-iframe"></div>
          </div>
        )}
        {getPlatform() !== "Spotify" && ( //displays a youtube or soundcloud song
          <div className="footer_spotifyInfo">
            <ReactPlayer
              ref={playerRef}
              url={
                getPlatform() === "Soundcloud"
                  ? getSoundcloud().link
                  : getYoutube().link
              }
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              playing={playing}
              volume={volume}
              onEnded={() => handleNext()}
              height={getPlatform() === "Soundcloud" ? "120px" : "115px"}
              width="500px"
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
        {!getShuffleState() ? (
          <img
            src={shuffle}
            className="footer_shuffle footer_icon"
            onClick={() => handleShuffle()}
          />
        ) : (
          <img
            src={shuffle}
            className="footer_shuffle footer_icon active"
            onClick={() => handleUnshuffle()}
          />
        )}
        <div id="prev" ref={reverseButton}>
          <SkipPreviousIcon
            className="footer_icon"
            onClick={() => handleReverse()}
          />
        </div>
        <div
          id="toggle"
          ref={pauseButton}
          onClick={() => {
            if (getPlatform() !== "Spotify") setPlaying(!playing);
          }}
        >
          {playing ? (
            <PauseCircleFilledIcon className="footer_icon" />
          ) : (
            <PlayCircleFilledIcon className="footer_icon" />
          )}
        </div>
        <div id="next" ref={skipButton} onClick={() => handleNext()}>
          <SkipNextIcon className="footer_icon" />
        </div>
        <RepeatIcon className="footer_icon" />
      </div>
      <div className="footer_right">
        <Grid container spacing={2}>
          <Grid
            item
            onClick={() => {
              setPage("Queue");
            }}
          >
            <PlaylistPlayIcon className="footer_icon" fontSize="large" />
          </Grid>
          {platform !== "Spotify" && (
            <>
              <Grid item>
                <VolumeDownIcon fontSize="medium" />
              </Grid>
              <Grid item xs>
                <Slider
                  size="small"
                  defaultValue={volume * 100}
                  onChange={(_, value) => {
                    setVolume(value * 0.01);
                    console.log(value);
                  }}
                />
              </Grid>
              <Grid item>
                <VolumeUpIcon fontSize="medium" />
              </Grid>
            </>
          )}
        </Grid>
      </div>
    </div>
  );
}

export default Footer;
