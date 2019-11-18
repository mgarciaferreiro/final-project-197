import Spotify from 'spotify-web-api-js';
const spotifyApi = new Spotify();

// our constants
export const SPOTIFY_TOKENS = 'SPOTIFY_TOKENS';
export const SPOTIFY_ME_BEGIN = 'SPOTIFY_ME_BEGIN';
export const SPOTIFY_ME_SUCCESS = 'SPOTIFY_ME_SUCCESS';
export const SPOTIFY_ME_FAILURE = 'SPOTIFY_ME_FAILURE';
export const SPOTIFY_CURRENT_TRACK = 'SPOTIFY_CURRENT_TRACK';

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

export function getNowPlaying() {
  return dispatch => {
    spotifyApi.getMyCurrentPlaybackState().then(response => {
      console.log(response)
      dispatch({ type: SPOTIFY_CURRENT_TRACK, data: { 
                name: response.item.name,
                artist: response.item.artists[0].name,
                albumArt: response.item.album.images[0].url
              } });
    }).catch(e => {
      dispatch({ type: SPOTIFY_ME_FAILURE, error: e });
    });
  };
}

export function getArtist() {
  return dispatch => {
    spotifyApi.getArtist('2hazSY4Ef3aB9ATXW7F5w3').then(response => {console.log(response)
    }).catch(e => {
      dispatch({ type: SPOTIFY_ME_FAILURE, error: e });
    });
  };
}
  export function fetchSongId(title) {
    return dispatch => {
      const localSongId = v4();
      title = title.replace(' ', '_');
      return fetch('http://api.musixmatch.com/ws/1.1/track.search?&q_track=' + title + 
      '&page_size=1&s_track_rating=desc&apikey=' + MUSIXMATCH_API_KEY)
      .then(
        response => response.json(),
        error => console.log('An error occurred.', error)
      ).then(function(json) {
        if (json.message.body.track_list.length > 0) {
          const musicMatchId = json.message.body.track_list[0].track.track_id;
          const artist = json.message.body.track_list[0].track.artist_name;
          const title = json.message.body.track_list[0].track.track_name;
          fetchLyrics(title, artist, musicMatchId, localSongId, dispatch);
        } else {
          console.log('We couldn\'t locate a song under that ID!');
        }
      });
    };
  }

  export function fetchLyrics(title, artist, musicMatchId, localSongId, dispatch) {
    return fetch('http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=' + musicMatchId + 
    '&apikey=' + MUSIXMATCH_API_KEY).then(
      response => response.json(),
      error => console.log('An error occurred.', error)
    ).then(function(json) {
      if (json.message.body.lyrics) {
        let lyrics = json.message.body.lyrics.lyrics_body;
        lyrics = lyrics.replace('"', '');
        const songArray = lyrics.split(/\n/g).filter(entry => entry!="");
        dispatch(receiveSong(title, artist, localSongId, songArray));
      } else {
        console.log('We couldn\'t locate lyrics for this song!');
      }
    });
  }

  
  // spotifyApi.getMyCurrentPlaybackState()
  //   .then((response) => {
  //     console.log(response.item)
  //     this.setState({
  //       nowPlaying: { 
  //         name: response.item.name,
  //         artist: response.item.artists[0].name,
  //         albumArt: response.item.album.images[0].url
  //       }
  //     });
  //   }, (error) => console.log(error))
