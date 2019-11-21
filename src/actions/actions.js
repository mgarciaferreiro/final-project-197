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

const MUSIXMATCH_API_KEY = process.env.MUSIXMATCH_API_KEY;

/** set the app's access and refresh tokens */
export function setTokens({accessToken, refreshToken}) {
  if (accessToken) {
    spotifyApi.setAccessToken(accessToken);
  }
  return { type: SPOTIFY_TOKENS, accessToken, refreshToken };
}

/* get the user's info from the /me api */
export function getMyInfo() {
  return dispatch => {
    dispatch({ type: SPOTIFY_ME_BEGIN});
    spotifyApi.getMe().then(data => {
      dispatch({ type: SPOTIFY_ME_SUCCESS, data: data });
    }).catch(e => {
      dispatch({ type: SPOTIFY_ME_FAILURE, error: e });
    });
  };
}

export function getTopSongs() {
  spotifyApi.getMyTopTracks().then(data => {
    console.log(body);
    dispatch({ type: SPOTIFY_TOP_TRACKS, data: data });
  });
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

export function fetchSongId(title, artist) {
    return dispatch => {
      title = title.replace(' ', '_');
      artist = artist.replace(' ', '_');
      return fetch('http://api.musixmatch.com/ws/1.1/track.search?&q_track=' + title + '&q_artist=' + artist
      + '&page_size=1&s_track_rating=desc&apikey=' + MUSIXMATCH_API_KEY)
      .then(
        response => response.json(),
        error => console.log('An error occurred.', error)
      ).then(function(json) {
        if (json.message.body.track_list.length > 0) {
          const musicMatchId = json.message.body.track_list[0].track.track_id;
          const artist = json.message.body.track_list[0].track.artist_name;
          const title = json.message.body.track_list[0].track.track_name;
          console.log ("song id: " + musicMatchId)
          console.log ("song title: " + title)
          fetchLyrics(musicMatchId, dispatch);
        } else {
          console.log('We couldn\'t locate a song under that ID!');
        }
      });
    };
}

export function fetchLyrics(musicMatchId, dispatch) {
    return fetch('http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=' + musicMatchId + 
    '&apikey=' + MUSIXMATCH_API_KEY).then(
      response => response.json(),
      error => console.log('An error occurred.', error)
    ).then(function(json) {
      if (json.message.body.lyrics) {
        let lyrics = json.message.body.lyrics.lyrics_body;
        lyrics = lyrics.replace('"', '');
        console.log ("lyrics: " + lyrics)
        dispatch({ type: LYRICS_RECEIVED, data: lyrics });
      } else {
        console.log('We couldn\'t locate lyrics for this song!');
      }
    });
}
