import axios from 'axios'
import Spotify from 'spotify-web-api-js';
const spotifyApi = new Spotify();

// our constants
export const SPOTIFY_TOKENS = 'SPOTIFY_TOKENS';
export const SPOTIFY_ME_BEGIN = 'SPOTIFY_ME_BEGIN';
export const SPOTIFY_ME_SUCCESS = 'SPOTIFY_ME_SUCCESS';
export const SPOTIFY_ME_FAILURE = 'SPOTIFY_ME_FAILURE';
export const SPOTIFY_CURRENT_TRACK = 'SPOTIFY_CURRENT_TRACK';
export const SPOTIFY_TOP_TRACKS = 'SPOTIFY_TOP_TRACKS';
export const LYRICS_RECEIVED = 'LYRICS_RECEIVED';
export const QUOTE_ADDED = 'QUOTE_ADDED';
export const QUOTES_RECEIVED = 'QUOTES_RECEIVED';
export const QUOTE_DELETED = 'QUOTE_DELETED';

/** set the app's access and refresh tokens */
export function setTokens({accessToken, refreshToken}) {
  if (accessToken) {
    spotifyApi.setAccessToken(accessToken)
  }
  return { type: SPOTIFY_TOKENS, accessToken, refreshToken }
}

/* get the user's info from the /me api */
export function getMyInfo() {
  return dispatch => {
    dispatch({ type: SPOTIFY_ME_BEGIN})
    spotifyApi.getMe().then(data => {
      dispatch({ type: SPOTIFY_ME_SUCCESS, data: data })
    }).catch(e => {
      dispatch({ type: SPOTIFY_ME_FAILURE, error: e })
    });
  };
}

export function getTopSongs() {
  return dispatch => {
    spotifyApi.getMyTopTracks().then(data => {
      console.log(data)
      dispatch({ type: SPOTIFY_TOP_TRACKS, data: data.items })
    }).catch(e => console.log(e))
  }
}

export function getNowPlaying() {
  return dispatch => {
    spotifyApi.getMyCurrentPlaybackState().then(response => {
      const name = response.item.name
      const artist = response.item.artists[0].name
      console.log("now playing: " + name)
      dispatch({ type: SPOTIFY_CURRENT_TRACK, data: { 
                name: name,
                artist: artist,
                albumArt: response.item.album.images[0].url
              } });
      dispatch(getSongId(name, artist));
    }).catch(e => {
      console.log(e);
    });
  };
}

export function getSongId(title, artist) {
  return dispatch => {
    title = title.replace(' ', '_')
    artist = artist.replace(' ', '_')
    
    axios.get(`/getmusixmatchid?title=${title}&artist=${artist}`)
    .then(response => {
      console.log(response)
      const track_id = response.data.message.body.track_list[0].track.track_id
      console.log(track_id)
      getLyrics(track_id, dispatch)
    })
    .catch(err => {
      console.log(err)
    })
  }
}

export function getLyrics(songId, dispatch) {
  return axios.get(`/getmusixmatchlyrics?songId=${songId}`)
    .then (res => {
        console.log(res)
        dispatch({ type: LYRICS_RECEIVED, data: res.data.message.body.lyrics.lyrics_body })
    })
    .catch(err => {
        console.log(err)
    })
}

export function addQuote(line, song, artist, userId) {
  return dispatch => {
    axios
      .post('/createquote', { line, song, artist, userId })
      .then(({ data }) => {
        console.log(data)
        dispatch({ type: QUOTE_ADDED, data: data });
      })
      .catch(error => {
        console.log(error)
      });
  };
};

export function getQuotes(userId) {
  return dispatch => {
    axios
      .get(`/quotes?userId=${userId}`)
      .then(({ data }) => {
        //console.log(data)
        dispatch({ type: QUOTES_RECEIVED, data: data });
      })
      .catch(error => {
        console.log(error)
      });
  };
};

export function deleteQuote(quoteId) {
  return dispatch => {
    axios
      .post('/deletequote', { quoteId })
      .then(({ data }) => {
        dispatch({ type: QUOTE_DELETED, data: data });
      })
      .catch(error => {
        console.log(error)
      });
  };
};