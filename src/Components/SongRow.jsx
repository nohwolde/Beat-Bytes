import React from "react";
import "../styles/SongRow.scss";
import { CloudDownloadOutlined } from "@material-ui/icons";

function SongRow({ track }, search = true) {
  if (typeof track.track !== "undefined" || track.type === "track") {
    return (
      <div className="songRow">
        {track.album.images.length === 0 ? (
          <CloudDownloadOutlined className="songRow_download" />
        ) : (
          <img
            className="songRow_search"
            src={track.album.images[0].url}
            alt=""
          />
        )}
        <div className="songRow_info">
          <h1>{track.name}</h1>
          {track.artists.length > 0 && (
            <p>
              {track.artists.map((artist) => artist.name).join(", ")} -{" "}
              {track.album.name}{" "}
            </p>
          )}
        </div>
      </div>
    );
  } else if (track.platform !== "undefined" && track.platform !== "Spotify") {
    return (
      <div className="songRow">
        {search ? ( // if searching make the image a bit larger
          <img className="songRow_search" src={track.pic} alt="" />
        ) : (
          <img className="songRow_album" src={track.pic} alt="" />
        )}
        <div className="songRow_info">
          <h1>{track.title}</h1>
          <p>{track.artist}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="songRow">
        <CloudDownloadOutlined className="songRow_download" />
        <div className="songRow_info">
          <h1>{track.name}</h1>
        </div>
      </div>
    );
  }
}

export default SongRow;
