import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import appColors from '../../../../styles/AppColors';
import { Box } from '@material-ui/core';
import ProdSelectContext from '../../ProdSelectContext';

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
}));

const DateCard = (props) => {
  const produceSelect = useContext(ProdSelectContext);

  const [isClicked, setIsClicked] = useState(false);

  const cardClicked = () => {
    const newDaysClicked = new Set(produceSelect.daysClicked);

    if (isClicked) {
      newDaysClicked.delete(props.weekDayFull.toUpperCase());
    } else {
      newDaysClicked.add(props.weekDayFull.toUpperCase());
    }
    produceSelect.setDaysClicked(newDaysClicked);
    setIsClicked(!isClicked);
  };

  const classes = useStyles();
  return (
    <Box
      display="flex"
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
          {props.time}
        </div>
      </div>
    </Box>
  );
};

export default DateCard;
