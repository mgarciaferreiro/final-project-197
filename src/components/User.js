import Spotify from 'spotify-web-api-js';
import React, { Component } from 'react';
import { connect }      from 'react-redux';
import {
  getMyInfo,
  setTokens,
  getNowPlaying,
  getArtist
}   from '../actions/actions';

const spotifyApi = new Spotify();

/**
 * Our user page
 * Displays the user's information
 */
class User extends Component {

  constructor() {
    super();
    console.log(this.props)
  }

  /** When we mount, get the tokens from react-router and initiate loading the info */
  componentDidMount() {
    // params injected via react-router, dispatch injected via connect
    const {dispatch, params} = this.props;
    const {accessToken, refreshToken} = params;
    dispatch(setTokens({accessToken, refreshToken}));
    dispatch(getMyInfo());
    dispatch(getArtist());
    //dispatch(getNowPlaying());
  }

  /** Render the user's info */
  render() {
    const { accessToken, refreshToken, user, currentTrack } = this.props;
    const { loading, display_name, images, id, email, external_urls, href, country, product } = user;
    const { name, artist, albumArt } = currentTrack;
    const imageUrl = images[0] ? images[0].url : "";
    // if we're still loading, indicate such
    if (loading) {
      return <h2>Loading...</h2>;
    }
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
            <li><span>Profile Image</span><span><a href={imageUrl}>{imageUrl}</a></span></li>
            <li><span>Country</span><span>{country}</span></li>
            <li><span>Product</span><span>{product}</span></li>
          </ul>
        </div>
        <div>
          Now Playing: { name + ' by ' + artist }
        </div>
        <div>
          <img src={albumArt} style={{ height: 150 }}/>
        </div>
        {/* { this.state.loggedIn &&
            <button onClick={() => this.getNowPlaying()}>
              Check Now Playing
            </button>
        } */}
      </div>
    );
  }
}

export default connect(state => state)(User);
