import React, { Component } from 'react';

/**
 * Main app component
 * Has a header and then render's the page content
 */
export default class SpotifyLogin extends Component {
  render() {
    // injected via react router
    const {children} = this.props;
    return (
      <div className="spotify-login" style={{backgroundImage: "url(/rave.png)"}}>
        <h1>LYRX</h1>
        <div className="page-content">
          <p>Immediately get the lyrics and artist of any song you're listening to, 
            find out what type of music you listen to most often, and more!</p>
          {children}
        </div>
      </div>
    );
  }
}
