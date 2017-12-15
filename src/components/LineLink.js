import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class LineLink extends Component {
  render() {
    return (
      <li className="ph3 pv2 bb b--light-silver">
        <span className='white fw7 f5 w2 pv2 tc dib' style={{backgroundColor: this.props.color}}>
          {this.props.id}
        </span> 
        <span className='tr pl1 f5 fw6 pl2'>
          <Link to={{pathname: `/route/${this.props.id}`, 
                    state: { id: this.props.id, routeId: this.props.routeId, name: this.props.name }}}>{this.props.name}</Link>
        </span>
      </li>
    )
  }
}

LineLink.propTypes = {
  short: PropTypes.string.isRequired,
  long: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
}

export default LineLink;
