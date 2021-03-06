'use strict'

const Spotify = require('spotify-web-api-node')
const querystring = require('querystring')
const express = require('express')
const router = new express.Router()

const dotenv = require('dotenv')
const axios = require('axios')
const db = require('../db/dbconnect')
const dbapi = require('../db/api')

// get global variables from .env file
const result = dotenv.config()
if (result.error) {
  throw result.error
} else {
  console.log(result.parsed)
}

const {CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, MUSIXMATCH_API_KEY} = process.env
const STATE_KEY = 'spotify_auth_state'
// your application requests authorization
const scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state', 'user-top-read']

// configure spotify
const spotifyApi = new Spotify({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI
})

/** Generates a random string containing numbers and letters of N characters */
const generateRandomString = N => (Math.random().toString(36)+Array(N).join('0')).slice(2, N+2)

// const getUserIfLoggedInMW = (req,res,next) => {
//   if (!req.session.userId) {
//     res.redirect('/login')
//   } else {
//     dbapi.getUser().then(user => {
//       req.user = user
//       next()
//     })
//   }
// }

/**
 * The /login endpoint
 * Redirect the client to the spotify authorize url, but first set that user's
 * state in the cookie.
 */
router.get('/login', (_, res) => {
  const state = generateRandomString(16)
  res.cookie(STATE_KEY, state)
  res.redirect(spotifyApi.createAuthorizeURL(scopes, state))
})

router.get('/getmusixmatchid', (req,res) => {
  const {title, artist} = req.query
  const url = 'http://api.musixmatch.com/ws/1.1/track.search?q_track=' + title 
    + '&q_artist=' + artist + '&page_size=10&page=1&s_track_rating=desc&apikey=' + MUSIXMATCH_API_KEY
  axios.get(url)
  .then(({data}) => res.json(data))
})

router.get('/getmusixmatchlyrics', (req,res) => {
  const {songId} = req.query
  const url = `https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${songId}
  &apikey=${MUSIXMATCH_API_KEY}`
  axios.get(url)
  .then(({data}) => res.json(data))
})

/**
 * The /callback endpoint - hit after the user logs in to spotifyApi
 * Verify that the state we put in the cookie matches the state in the query
 * parameter. Then, if all is good, redirect the user to the user page. If all
 * is not good, redirect the user to an error page
 */
router.get('/callback', (req, res) => {
  const { code, state } = req.query;
  const storedState = req.cookies ? req.cookies[STATE_KEY] : null;
  // first do state validation
  if (state === null || state !== storedState) {
    res.redirect('/#/error/state mismatch');
  // if the state is valid, get the authorization code and pass it on to the client
  } else {
    res.clearCookie(STATE_KEY);
    // Retrieve an access token and a refresh token
    spotifyApi.authorizationCodeGrant(code).then(data => {
      const { expires_in, access_token, refresh_token } = data.body;

      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      // use the access token to access the Spotify Web API
      spotifyApi.getMe().then(({ body }) => {
        req.session.userId = body.id
        dbapi.createUser(body.id)
          .then(user => {
            req.session.userId = body.id
          }).catch(error => console.log(error))
      });

      // we can also pass the token to the browser to make requests from there
      res.redirect(`/#/user/${access_token}/${refresh_token}`);
    }).catch(err => {
      res.redirect('/#/error/invalid token');
    });
  }
});

router.get('/quotes', (req, res) => {
  const {userId} = req.query
  dbapi.getQuotes(userId).then(quotes => res.json(quotes));
});

router.post('/createquote', (req, res) => {
  const {line, song, artist, userId} = req.body
  dbapi.addQuote(line, song, artist, userId).then(quote => res.json(quote));
});

router.post('/deletequote', (req, res) => {
  const {quoteId} = req.body
  dbapi.removeQuote(quoteId).then( quoteId => res.json(quoteId));
});

module.exports = router;
