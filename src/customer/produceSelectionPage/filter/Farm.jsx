import React, { useContext, useState } from 'react';
import prodSelectContext from '../prodSelectContext';
import FarmCard from '../../cards/FarmCard';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    textAlign: 'center',
    fontSize: 10,
  },
}));

const FarmCategory = () => {
  const classes = useStyles();
  const topNode = useContext(prodSelectContext);

  function createFarmCard(props) {
    return (
      <FarmCard
        image={props.image}
        businessName={props.name}
        hour={props.hours}
        key={props.name}
      />
    );
  }

  // const allValidDay = daysInWeek;
  var farms = topNode.farms;
  return <React.Fragment>{farms.map(createFarmCard)}</React.Fragment>;

  return (
    <div>
      <div>We are gathering farm-logo</div>
      {/* <dl className="dictionary">{allValidDay.map(createDateCard)}</dl> */}
    </div>
  );
};

export default FarmCategory;
