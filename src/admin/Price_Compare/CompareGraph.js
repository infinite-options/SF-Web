import React from 'react';
import {Bar} from 'react-chartjs-2';

import {AdminFarmContext} from '../AdminFarmContext';

import Box from '@material-ui/core/Box';
// import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  cgContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

/**
 * @return {*}
 */
function CompareGraph() {
  const classes = useStyles();
  const {data, display} = React.useContext(AdminFarmContext);

  return ( data && display == 'graph' ?
    <Box className = {classes.cgContainer}>
      <Bar
        data = {data}
        options = {{
          title: {
            display: true,
            text: `Our prices versus our competitor's`,
            fontSize: 20,
          },
          scales: {
            yAxes: [{
              ticks: {
                callback: function(value, index, values) {
                  const s = value < 0 ? `-$${value * -1}` :
                    `$${value}`;
                  return s;
                },
              },
            }],
          },
        }}
      />
    </Box> : ''
  );
}

export default CompareGraph;
