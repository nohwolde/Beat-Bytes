import React, { useState } from "react";
import "../styles/Body.scss";
import { useDataLayerValue } from "../DataLayer";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import FavoriteIcon from "@material-ui/icons/Favorite";
import SongRow from "./SongRow.jsx";
import "../styles/PlaylistPage.scss";
import uniqueId from "lodash/uniqueId";
import { useSpotify, useQueue, useActions } from "../store";
import shuffle from "./pics/shuffle.png";
import { useEffect } from "react";
import playlistImg from "./pics/mImg.jpeg";

function PlaylistPage({ popup, togglePopup, setPopupType, setRemoveTrack }) {
  // ACTIONS
  const discover_weekly = useActions((state) => state.discover_weekly);
  const setDiscoverWeekly = useActions((state) => state.setDiscoverWeekly);
  const getDiscoverWeekly = useActions((state) => state.getDiscoverWeekly);
  const skip = useActions((state) => state.skip);
  const pause = useActions((state) => state.pause);
  const playing = useActions((state) => state.playing);
  const getPlayingStatus = useActions((state) => state.getPlayingStatus);
  const setPlaying = useActions((state) => state.setPlaying);

  // QUEUE
  const addFrontQueue = useQueue((state) => state.addFrontQueue);
  const setPlatform = useActions((state) => state.setPlatform);
  const playlist = useQueue((state) => state.playlist);
  const getQueueLength = useQueue((state) => state.getQueueLength);
  const getQueuePosition = useQueue((state) => state.getQueuePosition);
  const setPlaylist = useQueue((state) => state.setPlaylist);
  const getFullQueue = useQueue((state) => state.getFullQueue);
  const getQueue = useQueue((state) => state.getQueue);
  const getPlaylistPosition = useQueue((state) => state.getPlaylistPosition);
  const setPlaylistPosition = useQueue((state) => state.setPlaylistPosition);
  const getPlaylist = useQueue((state) => state.getPlaylist);
  const skipPlaylist = useQueue((state) => state.skipPlaylist);
  const resetPlaylistPosition = useQueue(
    (state) => state.resetPlaylistPosition
  );
  const pop = useQueue((state) => state.pop);

  // SPOTIFY
  const EmbedController = useSpotify((state) => state.EmbedController);
  const getPlaylists = useSpotify((state) => state.getPlaylists);

  const [playlistIsPlayling, setPlaylistIsPlaying] = useState(false);

  const [remove, setRemove] = useState(null);

  const shuffleState = useActions((state) => state.shuffleState);
  const getShuffleState = useActions((state) => state.getShuffleState);
  const setShuffleState = useActions((state) => state.setShuffleState);

  useEffect(() => {
    getPlayingStatus();
  }, [playing]);

  useEffect(() => {
    getShuffleState();
  }, [shuffleState]);

  useEffect(() => {
    setDiscoverWeekly(
      getPlaylists().filter(
        (playlist) => playlist.id === getDiscoverWeekly().id
      )[0]
    );
  }, [getPlaylists()]);

  useEffect(() => {
    console.log("Playlist: ", playlist);
    console.log("Discover Weekly: ", discover_weekly);
    if (playlist.id === discover_weekly.id) {
      setPlaylistIsPlaying(true);
    } else {
      setPlaylistIsPlaying(false);
    }
  }, [playlist, discover_weekly]);

  const handlePlaylist = (playlist) => {
    resetPlaylistPosition();
    let shuffled = [];
    console.log("Modified Playlist: ", playlist.playlist);
    shuffled.push(...playlist.playlist);
    console.log("Before Shuffle", shuffled);
    if (getShuffleState()) shuffled = shufflePlaylist(shuffled);
    if (shuffled.length > 0) {
      const firstSong = shuffled[0];
      console.log("Adding first song to queue: ", firstSong);
      addFrontQueue(firstSong);
      setPlaylistIsPlaying(true);
      skip();
      console.log(getFullQueue());
      console.log(getQueuePosition());
    }
    console.log(shuffled);
    setPlaylist({
      ...playlist,
      playlist: shuffled,
    });
  };

  const shufflePlaylist = (playlist) => {
    const shuffle = playlist;
    for (var i = shuffle.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = shuffle[i];
      shuffle[i] = shuffle[j];
      shuffle[j] = temp;
    }
    console.log("Playlist shuffled: ", shuffle);
    return shuffle;
  };

  const handleUnshuffle = () => {
    setShuffleState(!getShuffleState());
    console.log("Unshuffling: ", getShuffleState());
    if (playlistIsPlayling) {
      console.log("Unshuffling playlist:");
      let position = 0;

      for (let i = 0; i < getPlaylist().playlist.length; i++) {
        if (getDiscoverWeekly().playlist[i].item.id === getQueue().item.id) {
          console.log("Found position: ", i);
          position = i;
          break;
        }
      }

      let playlist = getDiscoverWeekly().playlist.filter(
        (song) => song.item.id !== getQueue().item.id
      );

      setPlaylist({
        ...getDiscoverWeekly(),
        playlist: playlist,
      });
      setPlaylistPosition(position - 1);
    }
  };

  const handleShuffle = () => {
    setShuffleState(!getShuffleState());
    console.log("Shuffling: ", getShuffleState());
    if (playlistIsPlayling) {
      console.log("Shuffling playlist:" + getPlaylist().playlist);
      const playlistToShuffle = getPlaylist();
      let shuffledPlaylist = shufflePlaylist(playlistToShuffle.playlist);
      console.log(getQueue());
      shuffledPlaylist = shuffledPlaylist.filter(
        (song) => song.item.id !== getQueue().item.id
      );

      setPlaylistPosition(0);
      setPlaylist({
        ...playlistToShuffle,
        playlist: shuffledPlaylist,
      });
    }
  };

  return (
    <div className="playlistPage">
      <div className="playlistPage_info">
        <img
          src={
            discover_weekly.images[0] && discover_weekly.images[0] !== ""
              ? discover_weekly.images[0]
              : playlistImg
          }
          alt=""
        />
        <div className="playlistPage_infoText">
          <strong>PLAYLIST</strong>
          <h2>{discover_weekly?.name}</h2>
          <p>{discover_weekly?.description}</p>
        </div>
      </div>
      <div className="playlistPage_songs">
        {getDiscoverWeekly()?.playlist.length > 0 && (
          <div className="playlistPage_icons">
            {playing && playlistIsPlayling ? (
              <PauseCircleFilledIcon
                className="playlistPage_play"
                onClick={() => pause()}
              />
            ) : (
              <PlayCircleFilledIcon
                className="playlistPage_play"
                onClick={() =>
                  playlistIsPlayling ? pause() : handlePlaylist(discover_weekly)
                }
              />
            )}
            {shuffleState ? (
              <img
                src={shuffle}
                className="playlistPage_shuffle active"
                onClick={() => handleUnshuffle()}
              />
            ) : (
              <img
                src={shuffle}
                className="playlistPage_shuffle"
                onClick={() => handleShuffle()}
              />
            )}
            <FavoriteIcon fontSize="large" />
          </div>
        )}
        {/*List of songs */}
        {getDiscoverWeekly()?.playlist.map((item) => {
          return typeof item !== "undefined" ? (
            <div
              id={item.id}
              key={item.id}
              onClick={() => {
                addFrontQueue(item);
                skip();
              }}
            >
              <SongRow
                key={uniqueId("songRow-spotify")}
                track={item}
                popup={popup}
                togglePopup={togglePopup}
                setPopupType={setPopupType}
                platform={item.platform}
                setRemoveTrack={setRemoveTrack}
                playlist={getDiscoverWeekly()}
              />
            </div>
          ) : (
            // These are songs that are downloaded on the users local computer,
            // and therefore cannot be embedded into the spotify embedded player iframe.
            <SongRow track={item} />
          );
        })}
      </div>
    </div>
  );
}

export default PlaylistPage;
