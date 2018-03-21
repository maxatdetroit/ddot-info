import React, { Component } from 'react';
import {TextField} from 'material-ui';
import PropTypes from 'prop-types';

class RouteInput extends Component {
  render() {
    return (
      <div>
        <TextField
          floatinglabeltext='Search routes by name or number'
          hinttext='E.g. "Woodward" or "53"'
          value={this.props.input}
          onChange={this.props.onSearchChange} />
      </div>
    );
  }
}

RouteInput.propTypes = {
  input: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default RouteInput;
