import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

let queueStore = (set, get) => ({
  queue: [
    {
      item: {
        track: {
          uri: "spotify:track:78X9D3v7OarDPNdTPUV4CQ?utm_source=generator",
        },
        platform: "Spotify",
      },
    },
  ],
  queuePosition: 0,
  addQueue: (song) => set((state) => ({ queue: [...state.queue, song] })),
  addFrontQueue: (song) => {
    set((state) => ({
      queue:
        state.queue.length === 0
          ? [song]
          : state.queue.length === state.queuePosition
          ? [...state.queue, song]
          : [
              ...state.queue.slice(0, state.queuePosition),
              song,
              ...state.queue.slice(state.queuePosition, state.queue.length),
            ],
    }));
  },
  getQueue: () => get().queue[get().queuePosition],
  getQueuePosition: () => get().queuePosition,
  pop: () =>
    set((state) => ({
      queuePosition:
        state.queuePosition > state.queue.length - 1
          ? state.queuePosition
          : state.queuePosition + 1,
    })),
  back: () =>
    set((state) => ({
      queuePosition:
        state.queuePosition > 0 ? state.queuePosition - 1 : state.queuePosition,
    })),
  getPlaying: () => get().queue[get().queuePosition - 1],
});

let actionsStore = (set, get) => ({
  playing: false,
  reverseStatus: false,
  reverseButton: null,
  platform: "Spotify",
  skipButton: null,
  playbackStatus: null,
  volume: 0.8,
  addToPlaylistClicked: false,
  selectedSong: null,
  setAddToPlaylistClicked: (clicked) => set({ addToPlaylistClicked: clicked }),
  getAddToPlaylistClicked: () => {
    return get().addToPlaylistClicked;
  },
  setSelectedSong: (song) => set({ selectedSong: song }),
  getSelectedSong: () => get().selectedSong,
  setPlaying: (playing) => set({ playing: playing }),
  setVolume: (volume) => set({ volume: volume }),
  setPlaybackStatus: (status) => set({ playbackStatus: status }),
  getPlaybackStatus: () => get().playbackStatus,
  setSkipButton: (button) => set({ skipButton: button }),
  skip: () =>
    get().skipButton.current?.dispatchEvent(
      new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 1,
      })
    ),
  setReverseButton: (button) => set({ reverseButton: button }),
  reverse: () =>
    get().reverseButton.current?.dispatchEvent(
      new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 1,
      })
    ),
  getReverseStatus: () => get().reverseStatus,
  setPlatform: (platform) => set({ platform: platform }),
  getPlatform: () => get().platform,
});

let spotifyStore = (set, get) => ({
  spotify: null,
  token: null,
  user: null,
  playlists: null,
  topArtists: null,
  setSpotify: (spotify) => set({ spotify: spotify }),
  setToken: (token) => set({ token: token }),
  setUser: (user) => set({ user: user }),
  addToPlaylist: (playlistID, song) =>
    set((state) => ({
      playlists: state.playlists.map((playlist) =>
        playlist.id === playlistID ? [...playlist, song] : playlist
      ),
    })),
  addPlaylist: (playlist) =>
    set((state) => ({ playlists: [...state.playlists, playlist] })),
  setPlaylists: (playlists) => set({ playlists: playlists }),
  setTopArtists: (topArtists) => set({ topArtists: topArtists }),
});

spotifyStore = devtools(spotifyStore);

actionsStore = devtools(actionsStore);

queueStore = devtools(queueStore);

const useQueue = create(queueStore);
const useActions = create(actionsStore);
const useSpotify = create(spotifyStore);

export { useSpotify };

export { useActions };

export default useQueue;
