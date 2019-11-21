import React, { Component } from 'react';
import loginSVG from '../log_in.svg';

/**
 * Our login page
 * Has a login button that hit's the login url
 */
export default class Login extends Component {
  render() {
    return (
      <div className="spotify-login">
        <h1>LYRX</h1>
        <div className="page-content" style={{backgroundImage: "url(./rave.png)"}}>
          <p>Immediately get the lyrics and artist of any song you're listening to, 
            find out what type of music you listen to most often, and more!</p>
            <div className="login">
          <h2>Here's our login page!</h2>
          <a href="/login" dangerouslySetInnerHTML={{__html: loginSVG}}></a>
        </div>
        </div>
      </div>
    );
  }
}
