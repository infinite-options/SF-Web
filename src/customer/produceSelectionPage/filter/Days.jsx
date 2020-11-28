import React, { useContext } from 'react';
import storeContext from '../../storeContext';
import prodSelectContext from '../prodSelectContext';
import { makeStyles } from '@material-ui/core/styles';
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
  const prodSelect = useContext(prodSelectContext);
  const store = useContext(storeContext);

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
    let i = 0;
    if (Object.keys(store.daysDict).length > 0) {
      while (default7Days.length < 7 && i < 50) {
        var today = new Date();
        // +1 because date days starts at 0
        today.setDate(today.getDate() + 1 + i);
        console.log(fullDays[today.getDay()]);
        if (fullDays[today.getDay()].toUpperCase() in store.daysDict) {
          var newDay = {
            weekDay: days[today.getDay()],
            month: months[today.getMonth()],
            day: today.getDate(),
            weekDayFull: fullDays[today.getDay()],
          };
          default7Days.push(newDay);
        }
        i++;
      }
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

  var itemsAmount = store.cartTotal;
  //variable: a set of day need to display
  var allValidDay = createDefault7Day();
  // console.log(allValidDay);
  if (prodSelect.newWeekDay.length !== 0) {
    allValidDay = makeFilterDay(allValidDay, prodSelect.newWeekDay);
    // console.log(testUpdateDay);
  }

  return allValidDay.map(createDateCard);
};

export default DaysCategory;
