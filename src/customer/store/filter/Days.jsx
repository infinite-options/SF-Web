import React, { useContext, useState } from 'react';
import someContexts from '../../makeContext';
import FarmCard from '../../cards/FarmCard';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
// import daysInWeek from "../daysInWeek";
import DateCard from '../../cards/DateCard';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    fontSize: 10,
  },
}));

const DaysCategory = () => {
  const createDateCard = (props) => {
    return (
      <DateCard
        weekDay={props.weekDay}
        month={props.month}
        day={props.day}
        weekDayFull={props.weekDayFull}
        id={props.weekDay}
        key={props.weekDay}
      />
    );
  };

  const createDefault7Day = () => {
    var days = ['SUN', 'MON', 'TUES', 'WED', 'THUR', 'FRI', 'SAT'];
    var months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'June',
      'July',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    var fullDays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    var default7Days = [];
    for (var i = 0; i < 7; i++) {
      var today = new Date();
      today.setDate(today.getDate() + 1 + i);
      var newDay = {
        weekDay: days[today.getDay()],
        month: months[today.getMonth()],
        day: today.getDate(),
        weekDayFull: fullDays[today.getDay()],
      };
      default7Days.push(newDay);
    }
    return default7Days;
  };

  const makeFilterDay = (defaultDay, updateDay) => {
    var arr = [];
    for (var i = 0; i < updateDay.length; i++) {
      for (var j = 0; j < defaultDay.length; j++) {
        if (updateDay[i] === defaultDay[j].weekDayFull) {
          var holdNewDate = defaultDay[j];
          arr.push(holdNewDate);
        }
      }
    }

    return arr.reverse();
  };

  const cartContext = useContext(someContexts);
  var itemsAmount = cartContext.cartTotal;
  //variable: a set of day need to display
  var allValidDay = createDefault7Day();
  // console.log(allValidDay);
  if (cartContext.newWeekDay.length !== 0) {
    allValidDay = makeFilterDay(allValidDay, cartContext.newWeekDay);
    // console.log(testUpdateDay);
  }

  return allValidDay.map(createDateCard);
};

export default DaysCategory;