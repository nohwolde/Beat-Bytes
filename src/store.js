import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import playlists from "./playlists.js";

let queueStore = (set, get) => ({
  queue: [
    {
      item: {
        uri: "spotify:track:2Y0wPrPQBrGhoLn14xRYCG",
        name: "Come & Go (with MarshMello)",
        artists: [{ name: "Juice WRLD" }, { name: "Marshmello" }],
        album: {
          name: "Legends Never Die",
          images: [
            "https://i.scdn.co/image/ab67616d0000b2733e0698e4ae5ffb82a005aeeb",
          ],
        },
        is_local: false,
        type: "track",
        id: "2Y0wPrPQBrGhoLn14xRYCG",
      },
      platform: "Spotify",
    },
  ],
  playlist: { id: "", playlist: [] },
  playlistPosition: 0,
  queuePosition: 0,
  soundcloud: { link: "https://soundcloud.com/liltjay/f-n" },
  youtube: { link: "http://www.youtube.com/watch?v=jx96Twg-Aew" },
  firstRender: true,
  getFirstRender: () => get().firstRender,
  setFirstRender: (firstRender) => set({ firstRender: firstRender }),
  setSoundcloud: (soundcloud) => set({ soundcloud: soundcloud }),
  getSoundcloud: () => get().soundcloud,
  setYoutube: (youtube) => set({ youtube: youtube }),
  getYoutube: () => get().youtube,
  addQueue: (song) => {
    console.log("adding to front of queue", song);
    set((state) => ({ queue: [...state.queue, song] }));
  },
  addFrontQueue: (song) => {
    console.log("adding to front of queue", song);
    set((state) => ({
      queue:
        state.queue.length === 0
          ? [song]
          : state.queue.length === state.queuePosition + 1
          ? [...state.queue, song]
          : [
              ...state.queue.slice(0, state.queuePosition + 1),
              song,
              ...state.queue.slice(state.queuePosition + 1, state.queue.length),
            ],
    }));
  },
  getFullQueue: () => get().queue,
  getQueue: () => get().queue[get().queuePosition],
  setFullQueue: (queue) => set({ queue: queue }),
  getQueueLength: () => get().queue.length,
  removeQueue: (songID) =>
    set((state) => ({ queue: state.queue.filter(song.item.id === songID) })),
  getQueuePosition: () => get().queuePosition,
  pop: () =>
    set((state) => ({
      queuePosition:
        state.queue.length > state.queuePosition + 1
          ? state.queuePosition + 1
          : state.queuePosition,
    })),
  back: () =>
    set((state) => ({
      queuePosition:
        state.queuePosition > 0 ? state.queuePosition - 1 : state.queuePosition,
    })),
  getPlaying: () => get().queue[get().queuePosition - 1],
  setPlaylist: (playlist) => set({ playlist: playlist }),
  resetPlaylistPosition: () => set({ playlistPosition: 0 }),
  getPlaylist: () => get().playlist,
  getPlaylistNext: () => get().playlist.playlist[get().playlistPosition],
  skipPlaylist: () => {
    console.log("skipping playlist", get().playlist);
    set((state) => ({
      playlistPosition:
        state.playlist.playlist.length > state.playlistPosition + 1
          ? state.playlistPosition + 1
          : state.playlistPosition,
    }));
  },
  backPlaylist: () =>
    set((state) => ({
      playlistPosition:
        state.playlistPosition > 0
          ? state.playlistPosition - 1
          : state.playlistPosition,
    })),
  getPlaylistPosition: () => get().playlistPosition,
  setPlaylistPosition: (position) => set({ playlistPosition: position }),
  setPlaylistShuffled: (playlist) => set({ playlist: playlist }),
});

let actionsStore = (set, get) => ({
  discover_weekly: null,
  page: "Home",
  playing: false,
  reverseStatus: false,
  reverseButton: null,
  platform: "Spotify",
  skipButton: null,
  pauseButton: null,
  playbackStatus: null,
  volume: 0.8,
  addToPlaylistClicked: false,
  selectedSong: null,
  shuffleState: false,
  getShuffleState: () => get().shuffleState,
  setShuffleState: (shuffleState) => {
    set({ shuffleState: shuffleState });
    console.log("shuffle state", get().shuffleState);
  },
  setDiscoverWeekly: (playlist) => set({ discover_weekly: playlist }),
  getDiscoverWeekly: () => get().discover_weekly,
  setPage: (page) => set({ page: page }),
  getPage: () => get().page,
  setAddToPlaylistClicked: (clicked) => set({ addToPlaylistClicked: clicked }),
  getAddToPlaylistClicked: () => {
    return get().addToPlaylistClicked;
  },
  setSelectedSong: (song) => set({ selectedSong: song }),
  getSelectedSong: () => get().selectedSong,
  setPlaying: (playing) => set({ playing: playing }),
  getPlayingStatus: () => get().playing,
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
  setPauseButton: (button) => set({ playButton: button }),
  pause: () =>
    get().playButton.current?.dispatchEvent(
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
  EmbedController: null,
  spotify: null,
  token: null,
  user: null,
  playlists: playlists,
  topArtists: null,
  setEmbedController: (controller) => set({ EmbedController: controller }),
  setSpotify: (spotify) => set({ spotify: spotify }),
  setToken: (token) => set({ token: token }),
  setUser: (user) => set({ user: user }),
  addToPlaylist: (playlistID, song) =>
    set((state) => ({
      playlists: state.playlists.map((playlist) =>
        playlist.id === playlistID
          ? {
              ...playlist,
              playlist: [...playlist.playlist, song],
            }
          : playlist
      ),
    })),
  removeFromStorePlaylist: (playlistID, songID) => {
    set((state) => ({
      playlists: state.playlists.map((playlist) => {
        if (playlist.id === playlistID) {
          console.log("removing song", songID, "from playlist", playlistID);
          return {
            ...playlist,
            playlist: playlist.playlist.filter(
              (spotSong) => spotSong.item.id !== songID
            ),
          };
        } else {
          return playlist;
        }
      }),
    }));
  },
  getNumberOfBeatbytes: () => {
    let count = 0;
    get().playlists.map((playlist) => {
      if (playlist.platform === "Beatbytes") {
        count++;
      }
    });
    return count;
  },
  addToBeatbytes: (playlistID, song) =>
    set((state) => ({
      playlists: state.playlists.map((playlist) => {
        console.log(playlist, playlistID);
        if (playlist.id === playlistID) {
          // console.log("adding song", song, "to playlist", playlistID);
          return {
            ...playlist,
            playlist: [...playlist.playlist, song],
          };
        } else return playlist;
      }),
    })),
  addPlaylist: (playlist) => {
    console.log("adding playlist", playlist);
    set((state) => ({ playlists: [...state.playlists, playlist] }));
  },
  setPlaylists: (playlists) => set({ playlists: playlists }),
  getPlaylists: () => get().playlists,
  setTopArtists: (topArtists) => set({ topArtists: topArtists }),
});

let searchStore = (set, get) => ({
  search: [],
  searchPlatform: "Spotify",
  pushSearch: (songs) =>
    set((state) => ({ search: [...state.search, ...songs] })),
  setSearch: (search) => set({ search: search }),
  getSearch: () => get().search,
  setSearchPlatform: (platform) => set({ searchPlatform: platform }),
  getSearchPlatform: () => get().searchPlatform,
});

searchStore = devtools(searchStore);

spotifyStore = devtools(spotifyStore);

actionsStore = devtools(actionsStore);

queueStore = devtools(queueStore);

const useQueue = create(queueStore);
const useActions = create(actionsStore);
const useSpotify = create(spotifyStore);
const useSearch = create(searchStore);

export { useSpotify };

export { useActions };

export { useQueue };

export { useSearch };
