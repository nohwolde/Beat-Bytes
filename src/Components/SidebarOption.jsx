import React from 'react';
import '../styles/SidebarOption.scss';

function SidebarOption({title, Icon = null, playlist = null}) {
    return (
        <div className="sidebarOption">
            {Icon && <Icon className="sidebarOption_icon" />}
            {playlist && <img className="sidebarOption_icon" src={playlist.images[0].url} />}
            {Icon ? <h4>{title}</h4> : <p>{title}</p>}
        </div>
    )
}

export default SidebarOption
