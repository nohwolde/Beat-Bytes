import React from "react";
import "../styles/Menu.scss";
const Menu = ({ title, key }) => {
  return (
    <div className='MenuContextContainer' key={key}>{title}</div>
  );
};
export default Menu;