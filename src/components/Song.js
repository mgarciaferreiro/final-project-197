import React from 'react';

class Song extends React.Component {
  render() {
    return (
      <div>
        <p style={{fontWeight: 'bold'}}>"{this.props.quote.quote}"</p>
        <p>{this.props.quote.song}, {this.props.quote.artist}</p>
      </div>
    );
  }
}