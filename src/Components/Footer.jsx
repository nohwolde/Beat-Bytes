import {React, useEffect, useState} from 'react'
import './Footer.css'
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
import Sc from './pics/sc.png'
import Spot  from './pics/spot.png'
import Yt from './pics/yt.png'
import SoundcloudWidget from 'soundcloud-widget';
import ReactPlayer from 'react-player';

// creates the footer/player element for the application
function Footer({spotify}){
    const [player, setPlayer] = useState("Spotify");
    const [{token, item, playing, volume, device_id, platform, link}, dispatch] = useDataLayerValue();
    const [playerUrl, setPlayerUrl] = useState("https://www.youtube.com/watch?v=7cIkC7s3d2o")
    const [rPlaying, setrPlaying] = useState(false)

    //Updates currently playing song and play/pause status of the player
    useEffect(() => {
      spotify.getMyCurrentPlaybackState().then((r) => {
        dispatch({
            type: "SET_ITEM",
            item: r.item
        });
      });
    }, [item, playing, dispatch]);

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
        if(playing === null){
          dispatch({
            type: "SET_PLAYING",
            playing: true,
          });
        }
        else if(!playing) {
          spotify.play();
          dispatch({
            type: "SET_PLAYING",
            playing: !playing,
          });
        }
        else {
          spotify.pause();
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
      spotify.skipToNext();
      spotify.getMyCurrentPlayingTrack().then((r) => {
        dispatch({
          type: "SET_PLAYING",
          playing: true
        });
        dispatch({
            type: "SET_ITEM",
            item: r.item
        });
      });
    };
  
    //Goes back to the previous song
    const skipPrevious = () => {
      spotify.skipToPrevious();
      spotify.getMyCurrentPlayingTrack().then((r) => {
        dispatch({
          type: "SET_PLAYING",
          playing: true,
        });
        dispatch({
            type: "SET_ITEM",
            item: r.item,
        });
      });
    };

    //Changes volume to the value specified
    const changeVolume = (value) => {
        console.log(value)
        fetch("https://api.spotify.com/v1/me/player/volume", {
          method: "PUT",
           headers: {
             authorization: `Bearer ${token}`,
             "Content-Type": "application/json",
           },
           body: JSON.stringify({
              "volume_percent": [value],
              "device_ids": [device_id],
           }),
        })
        spotify.setVolume(value)
    }

    // switches the player to the new platform on command
    function switchPlayer(play) {
      dispatch({
        type: "SET_PLATFORM",
        platform: play
      })
      if(play !== "Spotify"){
        spotify.pause()
      }
      else{
        spotify.play()
        dispatch({
          type: "SET_PLAYING",
          playing: !playing,
        });
      }
      console.log(play)
    }

    return (
        <div className="footer">
            <div className="footer_left">
                <img className = "footer_playerLogo" src={Spot} onClick ={() => switchPlayer("Spotify")}></img>
                <img className = "footer_playerLogo" src={Sc} onClick ={() => switchPlayer("ReactPlayer")}></img>
                <img className = "footer_playerLogo" src={Yt} onClick ={() => switchPlayer("ReactPlayer")}></img>
                <div className="vl"></div>
                {(platform === "Spotify") && // displays a spotify song
                  // <div className="footer_spotifyInfo" >
                  //   <img className = "footer_albumLogo" src={item?.album.images[2].url}></img>
                  //   <div className="footer_songInfo">
                  //       <h4>{item?.name}</h4>
                  //       <h5>{item?.artists.map((artist) => artist.name).join(", ")}</h5>
                  //   </div>
                  // </div>
                  <div className="footer_spotifyInfo">
                    {/* <iframe
                      title="Spotify Web Player"
                      src="https://open.spotify.com/embed/track/0N3W5peJUQtI4eyR6GJT5O?utm_source=generator"
                      width={'40%'}
                      height={'50'}
                      style={{
                        borderRadius: 8,
                      }}
                    /> */}
                    <iframe 
                      style={{
                        borderRadius: 8,
                      }}
                      src="https://open.spotify.com/embed/track/0N3W5peJUQtI4eyR6GJT5O?utm_source=generator" 
                      width={'125%'}
                      height={'95'}
                      frameBorder="0"
                      allowFullScreen="" 
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
                    </iframe>
                  </div>
                }
                {(platform !== "Spotify") && //displays a youtube or soundcloud song
                  <div className="footer_spotifyInfo">
                    <ReactPlayer url={link} playing={playing} volume={volume?volume*0.1:0.5} height="90px" width ="400px"
                    config = {{
                      soundcloud: {
                        options: {
                          auto_play: true,
                          color: "#301934"
                        }
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