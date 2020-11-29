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

//TODO: Add extra days for multiple times
const DaysCategory = (daysProps) => {
  const prodSelect = useContext(ProdSelectContext);
  const store = useContext(storeContext);
  const filter = useContext(FilterContext);

  const createDateCard = (props) => {
    return (
      <DateCard
        weekDay={props.weekDay}
        month={props.month}
        day={props.day}
        time={props.time}
        weekDayFull={props.weekDayFull}
        id={props.weekDay}
        key={props.index}
      />
    );
  };

  return filter.shownDays.map(createDateCard);
};

export default DaysCategory;