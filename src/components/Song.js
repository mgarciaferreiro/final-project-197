import React from 'react';

export default class Song extends React.Component {
  render() {
    return (
      <div className='song'>
        <img src={this.props.song.album.images[0].url}></img>
        <div>
          <h5 style={{fontWeight: 'bold'}}>{this.props.song.name}</h5>
          <h5>{this.props.song.artists[0].name}</h5>
          <h5>{this.props.song.explicit? 'Explicit' : 'Not Explicit'}</h5>
        </div>
      </div>
    );
  }
}