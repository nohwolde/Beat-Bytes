import React from "react";
import "../styles/SidebarOption.scss";
import playlistImg from "./pics/mImg.jpeg";
import { useActions } from "../store";
import { useQueue } from "../store";

function SidebarOption({ title, Icon = null, playlist = null }) {
  const getPlayingStatus = useActions((state) => state.getPlayingStatus);
  const getQueueLength = useQueue((state) => state.getQueueLength);
  const getQueuePosition = useQueue((state) => state.getQueuePosition);
  return (
    <div className={Icon ? "sidebarHeader" : "sidebarOption"}>
      {Icon && <Icon className="sidebarOption_icon" />}
      {playlist && (
        <img
          alt=""
          className="sidebarOption_icon"
          src={
            playlist.images[0] && playlist.images[0] !== ""
              ? playlist.images[0]
              : playlistImg
          }
        />
      )}
      {Icon ? <h4>{title}</h4> : <p>{title}</p>}
    </div>
  );
}

export default SidebarOption;
