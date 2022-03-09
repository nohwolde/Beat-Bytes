import React, { Component, useEffect} from 'react'
import logo from './favicon.ico'
import './loading.css'
import {accessUrl} from "./spotify"
export default class Loading extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="loading">
        <img src = {logo} />
        <a href={accessUrl}
        style = {{padding: 20, borderRadius: 99, backgroundColor: '#1db954',fontWeight: 800, color:'white', textDecoration: 'none' }}
        > Login to Spotify </a>
      </div>
    )
  }
}