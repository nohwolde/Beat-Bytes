import React, { useEffect } from "react";
import "../styles/Body.scss";
import Header from "./Header.jsx";
import { useDataLayerValue } from "../DataLayer";
import MenuContext from "./MenuContext.jsx";
import useContextMenu from "./useContextMenu.jsx";
import PlaylistPage from "./PlaylistPage.jsx";
import SearchPage from "./SearchPage.jsx";
import HomePage from "./HomePage.jsx";

const data = [
  {
    id: 1,
    title: "Play Now",
  },
  {
    id: 2,
    title: "Add to Queue",
  },
];

function Body({ spotify }) {
  //⌄ Data values extracted from data layer
  const [{ page }, dispatch] = useDataLayerValue();
  const { clicked, setClicked, points, setPoints } = useContextMenu();

  useEffect(() => {
    setTimeout(() => {
      if (page === "Home") {
        dispatch({
          type: "SET_PAGE",
          page: "Home",
        });
      }
    }, 1500);
  }, []);

  const updateContextMenu = (e, item) => {
    const song = document.getElementById(item.id);
    setClicked(true);
    setPoints({
      x: e.clientX - song.scrollTop,
      y: e.clientY,
    });
    console.log("Right Click", e.pageX - song.scrollTop, e.pageY);
  };

  return (
    <div className="body" id="body">
      <Header spotify={spotify} />
      <MenuContext
        data={data}
        click={clicked}
        pointX={points.x}
        pointY={points.y}
      />
      {page === "Home" ? (
        <HomePage spotify={spotify} />
      ) : page === "Search" ? (
        <SearchPage spotify={spotify} />
      ) : page === "Discover Weekly" ? (
        <PlaylistPage spotify={spotify} />
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Body;
