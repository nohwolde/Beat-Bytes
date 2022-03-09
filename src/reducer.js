export const initialState = {
    user: null,
    playlists: [],
    playing: false, 
    item: null,
    top_artists: null,
    spotify: null,
    device_id: null,
    refresh_token: null,
    volume: null,
    search_term: null,
    search: [],
    platform: "Spotify",
    link: "https://soundcloud.com/liltjay/f-n" //https://www.youtube.com/watch?v=jx96Twg-Aew"
    //Remove after finished developing
    //token: "BQA9PaJSiSL5AX0d0kroeQcuyMVbqXHV4t1l-YpqgIR9Dg7VSJI0jDWRvri4Ot29refRgtDkqox8jQufQZ31EZ_pBtO8cyElpZ5JYmVRyFpphYC39AeBwmnY3WhXEhKWPcu8k9b9_KA8Fkfl8e3RGxUjJct0wLJN5GLD1Lvb"
}

const reducer = (state, action) => {
    //console.log(action)
    switch(action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.user
            }
        case 'SET_TOKEN':
            return {
                ...state,
                token: action.token
            }
        case 'SET_PLAYLISTS':
            return {
                ...state,
                playlists: action.playlists
            }
        case 'SET_DISCOVER_WEEKLY':
            console.log(action.discover_weekly)
            return {
                ...state, 
                discover_weekly: action.discover_weekly
            }
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
        default:
            return state
    }
}

export default reducer;