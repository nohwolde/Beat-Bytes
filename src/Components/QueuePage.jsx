import React, { useEffect } from "react";
import { useQueue, useSpotify } from "../store";
import SongRow from "./SongRow.jsx";
import uniqueId from "lodash/uniqueId";
import "../styles/QueuePage.scss";

function QueuePage({
  spotify,
  popup,
  togglePopup,
  setPopupType,
  setRemoveTrack,
  removeFromPlaylist,
}) {
  //⌄ Data values extracted from data layer
  const queue = useQueue((state) => state.queue.slice(1));
  const playlist = useQueue((state) => state.playlist);
  const getPlaylist = useQueue((state) => state.getPlaylist);
  const getPlaying = useQueue((state) => state.getPlaying);
  const getQueue = useQueue((state) => state.getQueue);
  const getPlaylistPosition = useQueue((state) => state.getPlaylistPosition);
  const getFullQueue = useQueue((state) => state.getFullQueue);
  const getQueuePosition = useQueue((state) => state.getQueuePosition);
  const getQueueLength = useQueue((state) => state.getQueueLength);
  const setPlaylist = useQueue((state) => state.setPlaylist);
  const setFullQueue = useQueue((state) => state.setFullQueue);
  const removeFromStorePlaylist = useSpotify(
    (state) => state.removeFromStorePlaylist
  );

  const deleteFromQueue = (removeTrack) => {
    const newQueue = getFullQueue().filter((track) =>
      removeTrack.platform === "Spotify"
        ? track.item.id !== removeTrack.item.id
        : track.link !== removeTrack.link
    );
    setFullQueue(newQueue);
  };

  const deleteFromPlaylist = (removeTrack) => {
    console.log(removeTrack);
    const oldPlaylist = getPlaylist();
    console.log("oldPlaylist: ", oldPlaylist);
    const newPlaylist = getPlaylist().playlist.filter((track) =>
      removeTrack.platform === "Spotify"
        ? track.item.id !== removeTrack.item.id
        : track.link !== removeTrack.link
    );
    console.log("newPlaylist: ", newPlaylist);
    //this means that the user only wants it remove from the queue not the actual playlist
    setPlaylist({
      ...playlist,
      playlist: newPlaylist,
    });
  };

  useEffect(() => {
    getQueue();
  }, [queue]);

  return (
    <div className="queuePage">
      <h1 className="queueHeader">Queue</h1>
      {getQueuePosition() > 0 && (
        <h4 className="queuePage_title">
          Previous:{" "}
          {getPlaying().platform === "Spotify"
            ? getPlaying().item.name
            : getPlaying().title}
        </h4>
      )}
      <div className="queuePage_songs">
        <h4 className="queuePage_title">Now playing</h4>
        {getQueuePosition() < getQueueLength() && (
          <SongRow
            key={uniqueId()}
            track={getQueue()}
            popup={popup}
            togglePopup={togglePopup}
            setPopupType={setPopupType}
            queuePage={false}
            platform={getQueue().platform}
          />
        )}
        {getQueuePosition() + 1 < getQueueLength() && (
          <h4 className="queuePage_title">Next in queue</h4>
        )}
        {getQueuePosition() + 1 < getQueueLength() &&
          getFullQueue(getQueuePosition() + 1)
            .slice(getQueuePosition() + 1)
            .map((item) => (
              <SongRow
                key={uniqueId()}
                track={item}
                popup={popup}
                togglePopup={togglePopup}
                setPopupType={setPopupType}
                queuePage={true}
                platform={item.platform}
                setRemoveTrack={(trackToRemove) =>
                  deleteFromQueue(trackToRemove)
                }
              />
            ))}
        {getPlaylist()?.playlist?.length > 0 && (
          <h4 className="queuePage_title">Next from {playlist?.name} </h4>
        )}
        {getPlaylist()
          ?.playlist?.slice(getPlaylistPosition() + 1)
          .map((item) => (
            <div onClick={() => {}}>
              <SongRow
                key={uniqueId()}
                track={item}
                spotify={spotify}
                popup={popup}
                togglePopup={togglePopup}
                setPopupType={setPopupType}
                queuePage={true}
                platform={item.platform}
                setRemoveTrack={(trackToRemove) =>
                  deleteFromPlaylist(trackToRemove)
                }
                playlist={getPlaylist()}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

export default QueuePage;
