import React, { useContext, useState } from 'react';
import someContexts from '../makeContext';
import FarmCard from '../pages/FarmCard';
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
  const topNode = useContext(someContexts);

  function createFarmCard(props) {
    return (
      <FarmCard
        image={props.business_image}
        businessName={props.business_name}
        hour={props.business_hours}
        id={props.business_uid}
        key={props.business_uid}
      />
    );
  }

  // const allValidDay = daysInWeek;
  if (topNode.busIsLoad && !topNode.busError) {
    var farms = topNode.defaultBussines;
    var pickedFarm = [];
    for (var i = 0; i < topNode.market.length; i++) {
      pickedFarm.push(topNode.defaultBussines[i]);
    }
    farms = pickedFarm;
    return <React.Fragment>{farms.map(createFarmCard)}</React.Fragment>;
  }

  return (
    <div>
      <div>We are gathering farm-logo</div>
      {/* <dl className="dictionary">{allValidDay.map(createDateCard)}</dl> */}
    </div>
  );
};

export default FarmCategory;
