import React from 'react';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import List, { ListItem, ListItemText } from 'material-ui/List'

import StopInlineLink from './StopInlineLink';
import RouteLink from './RouteLink';
import {Chip} from 'material-ui';

import Schedules from '../data/schedules.js';
import Stops from '../data/stops.js';

const StopTransfers = ({ stops }) => (
  <div className="transfers" style={{overflowX: 'scroll', margin: 10}}>
    <h4 style={{margin: 0, padding: 10}}>Transfer to other routes</h4>
    {Object.keys(stops).map((s, i) => (
      <Card style={{margin: 5}}>
        <CardHeader component={RouteLink} id={s}/>
        <CardContent>
        {stops[s].map((s,i) => (
            <p style={{margin: 0, padding: 5}}>
            {s[1]}: {<StopInlineLink id={s[2]} />}
            </p>
          ))}
        </CardContent>
      </Card>
    ))}
  </div>
);

export default StopTransfers;
