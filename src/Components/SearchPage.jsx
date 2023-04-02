import React, { useEffect } from "react";
import "../styles/Body.scss";
import SongRow from "./SongRow.jsx";
import "../styles/SearchPage.scss";
import uniqueId from "lodash/uniqueId";
import { useQueue } from "../store";
import logo from "./logo.png";
import { useSearch } from "../store";
import { useActions } from "../store";

function SearchPage({ popup, togglePopup, loading, setPopupType }) {
  const search = useSearch((state) => state.search);

  //Adding to Queue
  const addFrontQueue = useQueue((state) => state.addFrontQueue);
  const skip = useActions((state) => state.skip);

  return (
    <div className="searchPage">
      {loading && (
        <div className="searchPageLoading">
          <img src={logo} />
        </div>
      )}
      {search.length !== 0 &&
        search.map((track) => (
          <div
            key={uniqueId("search-")}
            onClick={() => {
              console.log("Adding to queue: ", track);
              addFrontQueue(track);
              skip();
            }}
          >
            <SongRow
              key={uniqueId("songRow-")}
              track={track}
              popup={popup}
              togglePopup={togglePopup}
              setPopupType={setPopupType}
              platform={track.platform}
            />
          </div>
        ))}
    </div>
  );
}

export default SearchPage;
