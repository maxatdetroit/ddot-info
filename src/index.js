import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './css/index.css';
import App from './App';
import About from './components/About';
import RouteRealtime from './components/RouteRealtime';
import RouteSchedule from './components/RouteSchedule';
import RouteStops from './components/RouteStops';
import BusRoute from './components/BusRoute'
import Stop from './components/Stop';
import Nearby from './components/Nearby';
import TransitCenter from './components/TransitCenter';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


import ReactGA from 'react-ga';
ReactGA.initialize('UA-107915075-4');

const muiTheme = getMuiTheme({
  fontFamily: 'Gibson Detroit Regular',
  tabs: {
    backgroundColor: '#b0d27b',
  },
});


class GAListener extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  componentDidMount() {
    this.sendPageView(this.context.router.history.location);
    this.context.router.history.listen(this.sendPageView);
  }

  sendPageView(location) {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  }

  render() {
    return this.props.children;
  }
}

ReactDOM.render(
  <Router basename="/route-explorer">
    <GAListener>
      <MuiThemeProvider muiTheme={muiTheme}>
        <Switch>
          <Route exact path='/' component={App} />
          <Route path='/about' component={About} />
          <Route path='/nearby' component={Nearby} />
          <Route path='/stop/rosa-parks-tc' component={TransitCenter} />
          <Route path='/stop/:name' component={Stop} />
          <Route path="/route/:name/real-time" component={RouteRealtime} />
          <Route path="/route/:name/schedule" component={RouteSchedule} />
          <Route path="/route/:name/stops" component={RouteStops} />
          <Route path='/route/:name' component={BusRoute} />
        </Switch>
      </MuiThemeProvider>
    </GAListener>
  </Router>,
  document.getElementById('root'));
registerServiceWorker();
