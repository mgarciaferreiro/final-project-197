import React from 'react';
import { connect } from 'react-redux';

import { deleteQuote } from '../actions/actions';

class Quote extends React.Component {
  render() {
    return (
      <div>
        <p style={{fontWeight: 'bold'}}>"{this.props.quote.quote}"</p>
        <p>{this.props.quote.song}, {this.props.quote.artist}</p>
        <button onClick={() => this.props.deleteItem(this.props.quote.id)}>
          X
        </button>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deleteItem: quoteId => dispatch(deleteQuote(quoteId))
  };
};

export default connect(null, mapDispatchToProps)(Quote);