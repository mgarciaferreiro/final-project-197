import React, { Component } from 'react';
import { connect }      from 'react-redux';
import {
  getMyInfo,
  setTokens,
  getNowPlaying
}   from '../actions/actions';

/**
 * Our user page
 * Displays the user's information
 */
class User extends Component {

  /** When we mount, get the tokens from react-router and initiate loading the info */
  componentDidMount() {
    // params injected via react-router, dispatch injected via connect
    const {dispatch, params} = this.props;
    const {accessToken, refreshToken} = params;
    dispatch(setTokens({accessToken, refreshToken}));
    dispatch(getMyInfo());
    dispatch(getNowPlaying());
  }

  /** Render the user's info */
  render() {
    const { accessToken, refreshToken, user, currentTrack } = this.props;
    const { loading, display_name, images, id, email, external_urls, href, country, product } = user;
    const { name, artist, albumArt, lyrics } = currentTrack;
    const imageUrl = images[0] ? images[0].url : "";
    // if we're still loading, indicate such
    if (loading) {
      return <h2>Loading...</h2>;
    }
    const lyricsArray = lyrics? lyrics.split("\n") : []
    const lyricsLines = lyricsArray.map((line) => <li>{line}</li>)

    return (
      <div className="user">
        <h2>{`Logged in as ${display_name}`}</h2>
        <div className="user-content">
          <img src={imageUrl} />
          <ul>
            <li><span>Display name</span><span>{display_name}</span></li>
            <li><span>Id</span><span>{id}</span></li>
            <li><span>Email</span><span>{email}</span></li>
            <li><span>Spotify URI</span><span><a href={external_urls.spotify}>{external_urls.spotify}</a></span></li>
            <li><span>Link</span><span><a href={href}>{href}</a></span></li>
            <li><span>Country</span><span>{country}</span></li>
            <li><span>Product</span><span>{product}</span></li>
          </ul>
        </div>
        <div className="song">
        <div>
          Now Playing: { name? name + ' by ' + artist : 'nothing :(' }
        </div>
        <div className="song-info">
        <ul>{lyricsLines}</ul>
        <div>
          <img src={albumArt}/>
          <div>
          <button onClick={() => saveQuote(name, artist, id)} >Save selected lyrics</button>
          </div>
        </div>
      </div>
      </div>
      </div>
    );
  }
}

function saveQuote(song, artist, userId) {
  var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
        if (text != '') {
          console.log(text)
          //addQuote(text, song, artist, userId)
        }
    }
}

export default connect(state => state)(User);
