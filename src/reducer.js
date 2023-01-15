export const initialState = {
    user: null,
    playlists: [],
    playing: false, 
    item: { id: "0N3W5peJUQtI4eyR6GJT5O?utm_source=generator", type: "track"} ,
    top_artists: null,
    spotify: null,
    soundcloud: {link: "https://soundcloud.com/liltjay/f-n", position: 0},
    youtube: {link: "http://www.youtube.com/watch?v=jx96Twg-Aew", position: 0},
    device_id: null,
    refresh_token: null,
    volume: null,
    search_term: null,
    search: [],
    platform: "Spotify",
    link: "https://soundcloud.com/liltjay/f-n", //https://www.youtube.com/watch?v=jx96Twg-Aew"
    //Remove after finished developing
    token: "",
    currentPlaylist: [],
    page: "Home"
}

const reducer = (state, action) => {
    //console.log(action)
    switch(action.type) {
        case 'SET_PAGE':
            return {
                ...state,
                page: action.page
            };
        case 'SET_USER':
            return {
                ...state,
                user: action.user
            };
        case 'SET_TOKEN':
            return {
                ...state,
                token: action.token
            };
        case 'SET_PLAYLISTS':
            return {
                ...state,
                playlists: action.playlists
            };
        case 'SET_DISCOVER_WEEKLY':
            console.log(action.discover_weekly)
            return {
                ...state, 
                discover_weekly: action.discover_weekly
            };
        case "SET_ITEM":
            return {
                ...state,
                item: action.item,
            };
        case "SET_TOP_ARTISTS":
            return {
                ...state,
                top_artists: action.top_artists,
            };
        case "SET_SPOTIFY":
            return {
                ...state,
                spotify: action.spotify,
            };
        case "SET_SOUNDCLOUD":
            return {
                ...state,
                soundcloud: action.soundcloud,
            };
        case "SET_YOUTUBE":
            return {
                ...state,
                youtube: action.youtube,
            };
        case "SET_PLAYING":
            console.log('SET_PLAYING')
            return {
                ...state,
                playing: action.playing,
            };
        case "SET_DEVICE":
            console.log("Reducer:" + action.device_id)
            return {
                ...state, 
                device_id: action.device_id,
            };
        case "SET_REFRESH_TOKEN":
            return {
                ...state,
                refresh_token: action.refresh_token,
            };
        case "SET_VOLUME":
            return {
                ...state,
                volume: action.volume
            };
        case "SET_SEARCH_TERM":
            return {
                ...state,
                search_term: action.search_term
            };
        case "SET_SEARCH":
            return {
                ...state, 
                search: action.search
            };
        case "SET_PLATFORM":
            return {
                ...state,
                platform: action.platform
            };
        case "SET_LINK":
            return {
                ...state,
                link: action.link
            };
        case "SET_CURRENTPLAYLIST":
            return {
                ...state,
                currentPlaylist: action.currentPlaylist
            };
        default:
            return state
    }
}

export default reducer;