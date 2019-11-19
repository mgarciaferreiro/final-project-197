import React, { Component } from 'react';
import { connect }      from 'react-redux';
import {
  fetchSongId
}   from '../actions/actions';

/**
 * Displays the current song
 */
class SongDisplay extends Component {

  constructor() {
    super();
  }

  componentDidMount() {
    // params injected via react-router, dispatch injected via connect
    const {dispatch} = this.props;
    dispatch(fetchSongId("Baby"));
    //dispatch(getNowPlaying());
  }

  render() {
    const { accessToken, refreshToken, user, currentTrack } = this.props;
    const { loading, display_name, images, id, email, external_urls, href, country, product } = user;
    const { name, artist, albumArt, lyrics } = currentTrack;
    const imageUrl = images[0] ? images[0].url : "";
    // if we're still loading, indicate such
    if (loading) {
      return <h2>Loading...</h2>;
    }
    return (
      <div className="song-display">
        <div>
          Now Playing: { name + ' by ' + artist }
        </div>
        <div>
          <img src={albumArt} style={{ height: 150 }}/>
        </div>
         <p>{lyrics}</p>
      </div>
    );
  }
}

export default connect(state => state)(SongDisplay);