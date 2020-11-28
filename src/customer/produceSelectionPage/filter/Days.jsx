import React, { useContext } from 'react';
import storeContext from '../../storeContext';
import prodSelectContext from '../ProdSelectContext';
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
  const prodSelect = useContext(prodSelectContext);
  const store = useContext(storeContext);
  const filter = useContext(FilterContext);

  const createDateCard = (props) => {
    return (
      <DateCard
        weekDay={props.weekDay}
        month={props.month}
        day={props.day}
        weekDayFull={props.weekDayFull}
        id={props.weekDay}
        key={props.index}
      />
    );
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
  var allValidDay = filter.shownDays;

  console.log('allValidDay: ', allValidDay);
  if (prodSelect.newWeekDay.length !== 0) {
    allValidDay = makeFilterDay(allValidDay, prodSelect.newWeekDay);
    // console.log(testUpdateDay);
  }

  return allValidDay.map(createDateCard);
};

export default DaysCategory;
