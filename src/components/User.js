import React, { Component } from 'react'
import { connect }      from 'react-redux'
import {
  getMyInfo,
  setTokens,
  getNowPlaying,
  addQuote,
  getQuotes,
  getTopSongs
}   from '../actions/actions'
import Quote from './Quote'
import Song from './Song'

/**
 * Our user page
 * Displays the user's information
 */
class User extends Component {

  /** When we mount, get the tokens from react-router and initiate loading the info */
  componentDidMount() {
    // params injected via react-router, dispatch injected via connect
    const {dispatch, params} = this.props
    const {accessToken, refreshToken} = params
    dispatch(setTokens({accessToken, refreshToken}))
    dispatch(getMyInfo())
    dispatch(getNowPlaying())
    dispatch(getQuotes('martagarciaferreiro'))
    dispatch(getTopSongs())
  }

  /** Render the user's info */
  render() {
    const {dispatch} = this.props;
    const { accessToken, refreshToken, user, currentTrack, quotes, topTracks, genres, 
      explicitPercentage, instrumentalPercentage } = this.props
    const { loading, display_name, images, id, email, external_urls, href, country, product } = user
    const { name, artist, albumArt, lyrics } = currentTrack
    const imageUrl = images[0] ? images[0].url : ""

    // if we're still loading, indicate such
    console.log(user)
    if (loading) {
      return <h2>Loading...</h2>
    }
    const lyricsArray = lyrics? lyrics.split("\n") : []
    const lyricsLines = lyricsArray.map((line) => <li>{line}</li>)

    const quotesArr = Object.keys(quotes).map( key => quotes[key])
    const quotesLis = quotesArr.map(quote => <Quote quote={quote} />)

    const songsArr = Object.keys(topTracks).map( key => topTracks[key])
    const songsLis = songsArr.map(song => <Song song={song} />)

    const genresArr = Object.keys(genres).map( key => [key, genres[key]])
    // sort in descending order
    genresArr.sort((a, b) => b[1] - a[1])
    const genresLis = genresArr.map(item => <h6>{item[0]}: {item[1]}%</h6>)

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
          <h2>
          Now Playing: { name? name + ' by ' + artist : 'nothing :(' }
          </h2>
        </div>
        <div className="song-info">
        <ul>{lyricsLines}</ul>
        <div>
          <img src={albumArt}/>
          <div>
          <button onClick={() => saveQuote(name, artist, id, dispatch)} >Save selected lyrics</button>
          </div>
        </div>
      </div>
      </div>

      <div className="quotes">
      <h2>My Saved Quotes</h2>
      <ul>{quotesLis}</ul>
      </div>

      <div className="topSongs">
      <h2>My Top Spotify Songs</h2>
      <h4 style={{fontWeight: 'bold', paddingBottom: 10}}>My Stats</h4>
      <h5 style={{fontWeight: 'bold', paddingBottom: 5}}>Percentage of Explicit Songs: {explicitPercentage}%</h5>
      <h5 style={{fontWeight: 'bold', paddingBottom: 5}}>Percentage of Instrumental Songs: {instrumentalPercentage}%</h5>
      <h5 style={{fontWeight: 'bold', paddingBottom: 5}}>Genres:</h5>
      <ul>{genresLis}</ul>
      <h4 style={{fontWeight: 'bold', paddingTop: 10}}>My Songs</h4>
      <ul>{songsLis}</ul>
      </div>

      </div>
    );
  }
}

function saveQuote(song, artist, userId, dispatch) {
  var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString()
        if (text != '') {
          dispatch(addQuote(text, song, artist, userId))
        }
    }
}

export default connect(state => state)(User)
