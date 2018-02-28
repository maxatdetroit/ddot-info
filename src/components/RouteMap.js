import React, { Component } from 'react';
import StaticMap from 'react-map-gl';
import Helpers from '../helpers.js'
import Schedules from '../data/schedules.js'

import _ from 'lodash';
import moment from 'moment';

import {defaultMapStyle, routeLineIndex, realtimeLabelIndex} from '../style.js'

import WebMercatorViewport from 'viewport-mercator-project';

class RouteMap extends Component {

  constructor(props) {
    super(props)

    let route = Schedules[this.props.route.rt_id]
    let tripIds = {}
    
    Object.keys(this.props.route.schedules).forEach(svc => {
      Object.keys(this.props.route.schedules.weekday).forEach(dir => {
        if (!tripIds[dir]) {
          tripIds[dir] = []
        }
        tripIds[dir] = tripIds[dir].concat(this.props.route.schedules[svc][dir].trips.map(trip => trip.trip_id))
      })
    })

    this.state = {
      viewport: {
        latitude: 42,
        longitude: -83,
        zoom: 17,
        bearing: 0,
        pitch: 0,
        width: window.innerWidth > 650 ? window.innerWidth / 2 : window.innerWidth,
        height: window.innerWidth > 650 ? window.innerHeight - 100 : 225
      },
      realtimeTrips: [],
      showRealtime: true,
      fetched: false,
      tripIds: tripIds
    }

    this._resize = this._resize.bind(this)
  }

  fetchData() {
    console.log(`${Helpers.endpoint}/trips-for-route/DDOT_${this.props.route.rt_id}.json?key=BETA&includeStatus=true&includePolylines=false`)
    fetch(`${Helpers.endpoint}/trips-for-route/DDOT_${this.props.route.rt_id}.json?key=BETA&includeStatus=true&includePolylines=false`)
    .then(response => response.json())
    .then(d => {
      console.log(d)
      let geojson = _.sortBy(d.data.list, 'status.tripId').map((bus, i) => {

        let direction = _.findKey(this.state.tripIds, t => { return t.indexOf(bus.status.activeTripId.slice(-4)) > -1})
          return {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [bus.status.position.lon, bus.status.position.lat]
            },
            "properties": {
              "tripId": bus.status.activeTripId,
              "displayTripId": bus.status.activeTripId.slice(-4,),
              "scheduledDistanceAlongTrip": bus.status.scheduledDistanceAlongTrip,
              "nextStop": bus.status.nextStop,
              "nextStopOffset": bus.status.nextStopTimeOffset,
              "predicted": bus.status.predicted,
              "updateTime": moment(bus.status.lastUpdateTime).format("h:mm:ss a"),
              "onTime": bus.status.scheduleDeviation / 60,
              "lastStop": this.props.route.timepoints[direction] ? this.props.route.timepoints[direction].slice(-1)[0] : ``,
              "direction": direction
            }
          }
      })
      let realtimeTrips = _.filter(geojson, o => { return o.properties.direction !== undefined })
      this.setState({ 
        realtimeTrips: realtimeTrips ,
        fetched: true
      })
    })
    .catch(e => console.log(e))
  }

  _resize = () => {
    if (window.innerWidth > 650) {
      this.setState({
        viewport: {
          ...this.state.viewport,
          width: window.outerWidth / 2,
          height: window.innerHeight - 100
        }
      });
    }
    else {
      this.setState({
        viewport: {
          ...this.state.viewport,
          width: window.innerWidth,
          height: 225
        }
      });
    }
  };

  
  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this.fetchData()
    this.interval = setInterval(() => this.fetchData(), 3000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    const route = this.props.route

    const viewport = new WebMercatorViewport({width: this.state.viewport.width, height: this.state.viewport.height});
    console.log(route.bbox)
    const bound = viewport.fitBounds(route.bbox,
      {padding: window.innerWidth > 650 ? 50 : window.innerWidth / 20}
    );

    let style = defaultMapStyle
    style = style.setIn(['layers', routeLineIndex, 'filter', 2], parseInt(route.id, 10))

    if(this.state.showRealtime) {
      style = style.setIn(['layers', realtimeLabelIndex, 'layout', 'visibility'], 'none')
      style = style.setIn(['sources', 'realtime', 'data'], {"type": "FeatureCollection", "features": this.state.realtimeTrips})  
    }

    return (
      <div className="map">
        <StaticMap
          width={this.state.viewport.width}
          height={this.state.viewport.height}
          latitude={bound.latitude}
          longitude={bound.longitude}
          zoom={bound.zoom}
          mapStyle={style}
          mapboxApiAccessToken={Helpers.mapboxApiAccessToken} >
        </StaticMap> 
      </div>
    )
  }
}

export default RouteMap;