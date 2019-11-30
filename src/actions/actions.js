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
export const STATS_COMPUTED = 'STATS_COMPUTED';

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
    spotifyApi.getMyTopTracks({limit: 50, time_range: 'long_term'}).then(data => {
      dispatch({ type: SPOTIFY_TOP_TRACKS, data: data.items })
      let explicitPercentage = 0
      let instrumentalPercentage = 0
      let genres = {}
      for (let i = 0; i < data.items.length; i++) {
        const title = data.items[i].name.replace(' ', '_')
        const artist = data.items[i].artists[0].name.replace(' ', '_')
        axios.get(`/getmusixmatchid?title=${title}&artist=${artist}`)
        .then(response => {
          const track = response.data.message.body.track_list[0].track
          const instrumental = track.instrumental
          const genre = track.primary_genres.music_genre_list[0].music_genre.music_genre_name
          const explicit = track.explicit
          if (explicit != 0) explicitPercentage += 2
          if (instrumental != 0) instrumentalPercentage += 2
          genres[genre] = genres[genre]? genres[genre] += 2 : 2
          if (i == data.items.length - 1) {
            dispatch({ type: STATS_COMPUTED, data: {genres, explicitPercentage, instrumentalPercentage} })
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }).catch(e => console.log(e))
  }
}

export function getNowPlaying() {
  return dispatch => {
    spotifyApi.getMyCurrentPlaybackState().then(response => {
      const name = response.item.name
      const artist = response.item.artists[0].name
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

export function getSongId(title, artist, shouldGetLyrics) {
  return dispatch => {
    title = title.replace(' ', '_')
    artist = artist.replace(' ', '_')
    
    axios.get(`/getmusixmatchid?title=${title}&artist=${artist}`)
    .then(response => {
      const track = response.data.message.body.track_list[0].track
      const track_id = track.track_id
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