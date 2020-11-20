import React, { useContext, useState } from 'react';
import prodSelectContext from '../prodSelectContext';
import MarketCard from '../../cards/MarketCard';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    textAlign: 'center',
    fontSize: 10,
  },
}));

const MarketCategory = () => {
  const classes = useStyles();
  const topNode = useContext(prodSelectContext);

  const createMarketCard = (props) => {
    return (
      <MarketCard
        image={props.business_image}
        businessName={props.business_name}
        hour={props.business_hours}
        id={props.business_uid}
        key={props.business_uid}
      />
    );
  };

  // const allValidDay = daysInWeek;
  if (topNode.busIsLoad && !topNode.busError) {
    var farmerMarket = topNode.market;
    if (topNode.farmClicked.length !== 0) {
      var newMarketList = [];
      var currentPicked = {};

      for (var i = 0; i < topNode.defaultBussines.length; i++) {
        if (topNode.defaultBussines[i].business_name === topNode.farmClicked) {
          currentPicked = topNode.defaultBussines[i];
        }
      }

      // console.log(currentPicked);
      var farmTeam = currentPicked.business_association;
      if (farmTeam !== null) {
        // console.log(farmTeam);
        farmTeam = JSON.parse(farmTeam);
        // console.log(farmTeam);

        for (var i = 0; i < farmTeam.length; i++) {
          for (var j = 0; j < topNode.market.length; j++) {
            if (farmTeam[i] === topNode.market[j].business_uid) {
              newMarketList.push(topNode.market[j]);
            }
          }
        }
      }

      farmerMarket = newMarketList;
      // console.log(allBusiness);
    }
    return (
      <React.Fragment>{farmerMarket.map(createMarketCard)}</React.Fragment>
    );
  }

  return (
    <div>
      <div>We are gathering farm-logo</div>
      {/* <dl className="dictionary">{allValidDay.map(createDateCard)}</dl> */}
    </div>
  );
};

export default MarketCategory;
