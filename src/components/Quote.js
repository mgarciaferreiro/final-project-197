import React from 'react';
import { connect } from 'react-redux';

import { deleteQuote } from '../actions/actions';

class Quote extends React.Component {
  render() {
    return (
      <div className='quote'>
        <button onClick={() => this.props.deleteItem(this.props.quote.id)}>
          X
        </button>
        <div>
          <h5 style={{fontWeight: 'bold'}}>"{this.props.quote.quote}"</h5>
          <h5>{this.props.quote.song}, {this.props.quote.artist}</h5>
        </div>
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