import React, { useContext, useEffect, useState } from 'react';
import storeContext from '../../storeContext';
import ProdSelectContext from '../ProdSelectContext';
import { makeStyles } from '@material-ui/core/styles';
// import daysInWeek from "../daysInWeek";
import DateCard from './cards/DateCard';
import FilterContext from './FilterContext';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    fontSize: 10,
  },
}));

// DONE: Add extra days for multiple times
// TODO testing: If date is unselected, clear the cart and give warning
// BUG: day is indicated a unselected when it is active
// DONE: Make day exclusive
const DaysCategory = () => {
  const filter = useContext(FilterContext);

  const createDateCard = (props) => {
    return (
      <DateCard
        weekDay={props.weekDay}
        month={props.month}
        day={props.day}
        time={props.time}
        weekDayFull={props.weekDayFull}
        weekDayFullUpper={props.weekDayFullUpper}
        id={props.index}
        key={props.index}
      />
    );
  };

  return filter.shownDays.map(createDateCard);
};

export default DaysCategory;
