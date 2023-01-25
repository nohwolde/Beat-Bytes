import {React, useEffect, useState} from 'react'
import '../styles/Footer.scss'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled'
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious"
import SkipNextIcon from "@material-ui/icons/SkipNext"
import ShuffleIcon from "@material-ui/icons/Shuffle"
import RepeatIcon from "@material-ui/icons/Repeat"
import {Grid, Slider} from "@material-ui/core"
import PlaylistPlayIcon from "@material-ui/icons/PlaylistPlay"
import VolumeDownIcon from "@material-ui/icons/VolumeDown"
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline"
import { useDataLayerValue } from '../DataLayer'
import Sc from './pics/soundcloud.svg'
import Spot  from './pics/spot.svg'
import Yt from './pics/yt.svg'
import SoundcloudWidget from 'soundcloud-widget';
import ReactPlayer from 'react-player';

// window.onSpotifyIframeApiReady = (IFrameAPI) => {
//   let element = document.getElementById('embed-iframe');
//   let options = {
//       uri: 'spotify:episode:7makk4oTQel546B0PZlDM5'
//     };
//   let callback = (EmbedController) => {};
//   IFrameAPI.createController(element, options, callback);
// };

// let element = document.getElementById('embed-iframe');
// let options = {
//   width: 200,
//   height: 400,
//   uri: 'spotify:episode:7makk4oTQel546B0PZlDM5'
// };
// let callback = (EmbedController) => {};
// IFrameAPI.createController(element, options, callback);

// creates the footer/player element for the application
function Footer({spotify}){
    const [player, setPlayer] = useState("Spotify");
    const [{token, item, playing, volume, device_id, platform, link, soundcloud, youtube}, dispatch] = useDataLayerValue();
    const [playerUrl, setPlayerUrl] = useState("https://www.youtube.com/watch?v=7cIkC7s3d2o")
  const [rPlaying, setrPlaying] = useState(false)

    //Updates currently playing song and play/pause status of the player
    // useEffect(() => {
    //   spotify.getMyCurrentPlaybackState().then((r) => {
    //     if(r !== null && r !== undefined){
    //       dispatch({
    //           type: "SET_ITEM",
    //           item: r.item
    //       });
    //     }
    //   });
    //   console.log(item)
    // }, [item, playing]);

    //Updates the volume bar to match the levels in the spotify player
    // useEffect(() => {
    //     spotify.getVolume().then((vol) => {
    //         console.log(vol)
    //         dispatch({
    //             type: "SET_VOLUME",
    //             volume: vol
    //         });
    //     })
    // }, [item, playing, dispatch])
  
    //Pauses and plays the spotify player
    const handlePlayPause = () => {
      if (platform === "Spotify") {
        const spotifyEmbedWindow = document.querySelector('iframe[src*="spotify.com/embed"]').contentWindow;
        spotifyEmbedWindow.postMessage({command: 'toggle'}, '*');
        if(playing === null){
          dispatch({
            type: "SET_PLAYING",
            playing: true,
          });
        }
        else if(!playing) {
          dispatch({
            type: "SET_PLAYING",
            playing: !playing,
          });
        }
        else {
          dispatch({
            type: "SET_PLAYING",
            playing: !playing,
          });
        }
      }
      else {
        if(rPlaying){
          setrPlaying(false)
          dispatch({
            type: "SET_PLAYING",
            playing: (!rPlaying),
          });
        }
        setrPlaying(!rPlaying)
        dispatch({
          type: "SET_PLAYING",
          playing: (!rPlaying),
        });
      }
    };
  
    //Skips to the next song
    const skipNext = () => {
      if (platform === "Spotify") {
        const spotifyEmbedWindow = document.querySelector('iframe[src*="spotify.com/embed"]').contentWindow;
        spotifyEmbedWindow.postMessage({command: 'next'}, '*');
      }
      else {
        // if(platform === "Soundcloud"){
        //   SoundcloudWidget(playerUrl).then(function(widget){
        //     widget.next();
        //   });
        // }
        // else {
        //   const youtubeEmbedWindow = document.querySelector('iframe[src*="youtube.com/embed"]').contentWindow;
        //   youtubeEmbedWindow.postMessage({command: 'next'}, '*');
        // }
      }
    };
  
    //Goes back to the previous song
    const skipPrevious = () => {

    };

    //Changes volume to the value specified
    const changeVolume = (value) => {
      dispatch({
        type: "SET_VOLUME",
        volume: value
      });
    }

    // switches the player to the new platform on command
    function switchPlayer(play) {
      dispatch({
        type: "SET_PLATFORM",
        platform: play
      })
    }

    return (
      <div className="footer" onKeyDown={(e) => {
        if (e.key === ' ') {
          handlePlayPause();
        }
      }
      }>
            <div className="footer_left">
                <img alt='' src={Spot} onClick ={() => switchPlayer("Spotify")}></img>
                <img alt='' className = "footer_playerLogo" src={Sc} onClick ={() => switchPlayer("Soundcloud")}></img>
                <img alt='' src={Yt} onClick ={() => switchPlayer("Youtube")}></img>
          <div className="vl"></div>
          <div id='embed-iframe'></div>
                {(platform === "Spotify") && // displays a spotify song
                  <div className="footer_spotifyInfo">
                    <iframe 
                      title="Spotify"
                      id="spotifyPlayer"
                      style={{
                        borderRadius: 8,
                      }}
                      src={`https://open.spotify.com/embed/${item.type}/${item.id}`}
                      height={'95'}
                      frameBorder="0"
                aria-label="spotify-embed"
                allowtransparency="true"
                      allow="autoplay; transparency; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
                    </iframe>
                  </div>
                }
                {(platform !== "Spotify") && //displays a youtube or soundcloud song
                  <div className="footer_spotifyInfo">
                    <ReactPlayer url={platform === 'Soundcloud'? soundcloud.link: youtube.link + '&origin'} playing={playing} volume={volume?volume*0.1:0.5} height="90px" width ="300px"
                    config = {{
                      soundcloud: {
                        options: {
                          auto_play: true,
                          color: "#301934"
                        }
                      }, 
                      youtube: {
                        playerVars: { 
                          'autoplay': 1,
                          'controls': 1,
                          'autohide': 1,
                          'wmode': 'opaque',
                          'origin': 'http://localhost:3000' 
                        },
                      }
                    }}/>
                  </div>
                }
            </div>
            <div className="footer_center">
                <ShuffleIcon className ="footer_green"/>
                <SkipPreviousIcon onClick ={skipPrevious} className ="footer_icon"/>
                {(platform === "Spotify") &&
                (playing ? (
                    <PauseCircleFilledIcon
                    onClick={handlePlayPause}
                    fontSize="large"
                    className="footer_icon"
                    />
                ) : (
                    <PlayCircleFilledIcon
                        onClick={handlePlayPause}
                        fontSize="large"
                        className="footer_icon"
                    />
                ))
                }
                {(platform !== "Spotify") &&
                  (playing ? (
                    <PauseCircleFilledIcon
                      onClick={handlePlayPause}
                      fontSize="large"
                      className="footer_icon"
                    />
                  ) : (
                    <PlayCircleFilledIcon
                      onClick={handlePlayPause}
                      fontSize="large"
                      className="footer_icon"
                    />
                  ))
                }
                <SkipNextIcon onClick={skipNext} className="footer_icon"/>
                <RepeatIcon className="footer_green" />
            </div>
            <div className = "footer_right">
              <Grid container spacing={2}>
                <Grid item>
                  <PlaylistPlayIcon />
                </Grid>
                <Grid item>
                  <VolumeDownIcon />
                </Grid>
                <Grid item xs>
                  <Slider defaultValue={volume?volume:50}
                  onChange = {(_,value) => changeVolume(value)}/>
                </Grid>
              </Grid>
            </div>
        </div>
    )
}

export default Footer;