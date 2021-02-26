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
// TEST: If date is unselected, clear the cart and give warning
// BUG: day is indicated a unselected when it is active
// DONE: Make day exclusive
const DaysCategory = () => {

  const filter = useContext(FilterContext);
  const store = useContext(storeContext);
  let keysRev = Object.keys(filter.shownDays).reverse()
  let i = keysRev.length - 1
  let tmp = []
  for (let [key, prop] of Object.entries(filter.shownDays)) {
    
    prop["unq"] = key
    filter.shownDays[key] = prop;
  }
  
  const createDateCard = (props) => {
    console.log("showndays", filter.shownDays)
    let acceptingString = ''
    if (store.acceptDayHour[props.weekDayFullUpper]){
      acceptingString = store.acceptDayHour[props.weekDayFullUpper]
    }
    return (
      <DateCard
        accept_hr = {acceptingString}
        weekDay={props.weekDay}
        month={props.month}
        day={props.day}
        time={props.time}
        monthInNumber={props.monthInNumber}
        date={props.date}
        year={props.year}
        weekDayFull={props.weekDayFull}
        weekDayFullUpper={props.weekDayFullUpper}
        id={props.index}
        key={props.index}
        unq = {props.unq}
      />
    );
  };

  return filter.shownDays.map(createDateCard);
};

export default DaysCategory;
