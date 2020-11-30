import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import appColors from '../../../../styles/AppColors';
import { Box } from '@material-ui/core';
import ProdSelectContext from '../../ProdSelectContext';
import storeContext from '../../../storeContext';

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: '#e0e6e6',
    width: 70,
    height: 80,
    borderRadius: 10,
    cursor: 'pointer',
  },
  weekDay: {
    backgroundColor: appColors.secondary,
    borderRadius: 10,
    color: 'white',
    textAlign: 'center',
  },
  date: {
    textAlign: 'center',
    fontSize: 16,
  },
  time: {
    textAlign: 'center',
    fontSize: 10,
  },
}));

const DateCard = (props) => {
  const productSelect = useContext(ProdSelectContext);
  const store = useContext(storeContext);
  const todaysDayUpper = props.weekDayFull.toUpperCase();

  const [isClicked, setIsClicked] = useState(false);
  const [showCard, setShowCard] = useState(
    productSelect.farmsClicked.size == 0 ? true : false
  );

  const cardClicked = () => {
    const newDaysClicked = new Set(productSelect.daysClicked);

    if (isClicked) {
      newDaysClicked.delete(todaysDayUpper + '&' + props.time);
    } else {
      newDaysClicked.add(todaysDayUpper + '&' + props.time);
    }
    productSelect.setDaysClicked(newDaysClicked);
    setIsClicked(!isClicked);
  };

  useEffect(() => {
    let _showCard = productSelect.farmsClicked.size == 0 ? true : false;
    productSelect.farmsClicked.forEach((farmId) => {
      if (todaysDayUpper in store.farmDayTimeDict[farmId]) {
        _showCard = true;
      }
    });
    if (!_showCard && isClicked) {
      setIsClicked(false);
    }
    setShowCard(_showCard);
  }, [productSelect.farmsClicked]);
  const classes = useStyles();

  // IMPORTANT: if you're going to use the hidden field, make sure you either
  //            put a conditional on the display prop, wrap it alone in a Box tag,
  //            not use display
  return (
    <Box
      hidden={!showCard}
      justifyContent="center"
      width="100%"
      m={0.5}
      p={0.5}
      mb={1}
    >
      <div className={classes.card} onClick={cardClicked}>
        <div className={classes.weekDay}>{props.weekDay}</div>
        <div
          className={classes.date}
          style={{ color: isClicked ? appColors.primary : appColors.secondary }}
        >
          {props.month} <br />
          {props.day}
          <br />
          <Box
            className={classes.time}
            style={{
              color: isClicked ? appColors.primary : appColors.secondary,
            }}
          >
            {props.time}
          </Box>
        </div>
      </div>
    </Box>
  );
};

export default DateCard;
