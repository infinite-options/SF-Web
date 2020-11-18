import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import appColors from '../../styles/AppColors';
import { Box } from '@material-ui/core';

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
  const [isClicked, setIsClicked] = useState(false);

  const cardClicked = () => {
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
        </div>
      </div>
    </Box>
  );
};

export default DateCard;
