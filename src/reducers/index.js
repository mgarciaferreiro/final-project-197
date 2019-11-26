import {
  SPOTIFY_TOKENS, SPOTIFY_ME_BEGIN, SPOTIFY_ME_SUCCESS, SPOTIFY_ME_FAILURE, SPOTIFY_CURRENT_TRACK, 
  LYRICS_RECEIVED, QUOTE_ADDED, QUOTES_RECEIVED
} from '../actions/actions';

/** The initial state; no tokens and no user info */
const initialState = {
  accessToken: null,
  refreshToken: null,
  user: {
    loading: false,
    country: null,
    display_name: null,
    email: null,
    external_urls: {},
    followers: {},
    href: null,
    id: null,
    images: [],
    product: null,
    type: null,
    uri: null,
  },
  currentTrack: {
    name: null,
    artist: null,
    albumArt: null,
    lyrics: null
  },
  quotes: []
};

/**
 * Reducer
 */
export default function reduce(state = initialState, action) {
  console.log(action)
  switch (action.type) {
  case SPOTIFY_TOKENS:
    const {accessToken, refreshToken} = action;
    return Object.assign({}, state, {accessToken, refreshToken});

  case SPOTIFY_ME_BEGIN:
    return Object.assign({}, state, {
      user: Object.assign({}, state.user, {loading: true})
    });

  case SPOTIFY_ME_SUCCESS:
    return Object.assign({}, state, {
      user: Object.assign({}, state.user, action.data, {loading: false})
    });

  case SPOTIFY_CURRENT_TRACK:
    return Object.assign({}, state, {
      currentTrack: Object.assign({}, state.currentTrack, action.data)
    });

  case LYRICS_RECEIVED:
    return Object.assign({}, state, {
      currentTrack: Object.assign({}, state.currentTrack, {lyrics: action.data})
    });

  case QUOTE_ADDED:
    state.quotes.push(action.data)
    return Object.assign({}, state, {
      quotes: Object.assign({}, state.quotes, state.quotes)
    });

  case QUOTES_RECEIVED:
    return Object.assign({}, state, {
      quotes: Object.assign({}, state.quotes, action.data)
    });


  // currently no failure state :(
  case SPOTIFY_ME_FAILURE:
    return state;

  default:
    return state;
  }
}
