import React, { Component } from 'react';
import Login   from './Login';
import User    from './User';
import Error   from './Error';
import SongDisplay   from './SongDisplay';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

/**
 * Main app component
 * Has a header and then render's the page content
 */
export default class Nav extends Component {
  render() {
    // injected via react router
    return (
      <div className="spotify-login">
        <Router>
      <div>
      <ul>
          <li>
            <Link to="/quotes">Quotes</Link>
          </li>
          <li>
            <Link to="/user/:accessToken/:refreshToken">Current Track</Link>
          </li>
        </ul>
        <hr />
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/user/:accessToken/:refreshToken" component={User} />
          <Route path="/quotes" component={Error}/>
        </Switch>
      </div>
    </Router>
    </div>
    );
  }
}