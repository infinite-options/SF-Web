import React, { useState, useContext, useEffect } from 'react';
import ItemCategory from './ItemCategory';
import FarmCategory from './Farm';
import DaysCategory from './Days';
import ItemStack from './itemStack';
import appColors from '../../../styles/AppColors';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import storeContext from '../../storeContext';
import ProdSelectContext from '../ProdSelectContext';
import FilterContext from './FilterContext';

const useStyles = makeStyles((theme) => ({
  borderCol: {
    borderRight: '1px solid ' + appColors.secondary,
  },
  filterCol: {
    width: '100px',
    textAlign: 'center',
    color: appColors.paragraphText,
  },
}));

// Fixed: When all of the days, farms, and items are selected, KEM Farms - Berries produce stays up
//      It may have to do with the fact that KEM Farms delivers at two times on Friday
//      To recreate: from Prashant's Lat and Long click on the two Fridays, then click on Royal Greens Farms
//          - Basically the two fridays, and then a farm that doesn't have those friday to make them disappear
//          - It has to do with since the two Fridays are disappearing at asynchronously, the clicked state that is passed
//            through to delete the field is not udated to the other friday's deletion so the latter setCategory include the
//            other Friday since it didn't know it was deleted
const StoreFilter = () => {
  const classes = useStyles();
  const store = useContext(storeContext);
  const productSelect = useContext(ProdSelectContext);

  const [shownDays, setShownDays] = useState([]);

  // DONE: Change to hidden field like how farms is implemented
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
    var fullDaysUpper = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ];

    var default7Days = [];
    let i = 0;
    if (Object.keys(store.dayTimeDict).length > 0) {
      // i < 30 mostly to prevent possible infinite loop (only likely if there is misspelled weekday name)
      //
      // The whole goal is to get all of the days with their times that are available within the customer zone
      while (default7Days.length < store.numDeliveryTimes && i < 30) {
        var today = new Date();
        // +1 to start from tomorrow
        // DONE, needs testing: after 1pm change to + 2

        today.setDate(today.getDate() + 1 + i);

        // toUpperCase because the dictionary stores in upper case
        const todaysDayUpper = fullDaysUpper[today.getDay()];

        // if the iterated day is in within the the dictionary to account for no selected farms
        if (todaysDayUpper in store.dayTimeDict) {
          // eslint-disable-next-line no-loop-func
          store.dayTimeDict[todaysDayUpper].forEach((time) => {
            // IMPORTANT: make sure the index used for mapping a component key is unique,
            // I ran into rendering issue when they were the sameconst dateString =
            const dateString =
              months[today.getMonth()] +
              '&' +
              today.getDate() +
              '&' +
              todaysDayUpper +
              '&' +
              time;
            if (dateString in store.daytimeFarmDict) {
              var newDay = {
                index: dateString,
                time: time,
                weekDay: days[today.getDay()],
                month: months[today.getMonth()],
                day: today.getDate(),
                year: today.getFullYear(),
                monthInNumber: today.getMonth() + 1,
                date: today.getDate(),
                weekDayFull: fullDays[today.getDay()],
                weekDayFullUpper: todaysDayUpper,
              };
              default7Days.push(newDay);
            }
          });
        }
        i++;
      }
    }

    return default7Days;
  };

  // If the decision changes to make an 'or' for shown days on farms clicked refer to to a commit before 12/02/20

  // For when the URL endpoints have finished loading in all of the information
  useEffect(() => {
    setShownDays(createDefault7Day());
  }, [store.dayTimeDict, store.daytimeFarmDict]);

  return (
    <FilterContext.Provider value={{ shownDays }}>
      <Box width="300px">
        <Box
          display="flex"
          justifyContent="center"
          p={1}
          mb={1}
          style={{ backgroundColor: appColors.componentBg, borderRadius: 10 }}
        >
          <Box p={1} className={clsx(classes.borderCol, classes.filterCol)}>
            Delivery Days
          </Box>
          <Box p={1} className={clsx(classes.borderCol, classes.filterCol)}>
            Farms
          </Box>
          <Box p={1} className={classes.filterCol}>
            Item Category
          </Box>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          p={1}
          style={{ backgroundColor: appColors.componentBg, borderRadius: 10 }}
        >
          <Box className={clsx(classes.borderCol, classes.filterCol)}>
            {ItemStack(DaysCategory)}
          </Box>
          <Box className={clsx(classes.borderCol, classes.filterCol)}>
            {ItemStack(FarmCategory)}
          </Box>
          <Box className={classes.filterCol}>{ItemStack(ItemCategory)}</Box>
        </Box>
      </Box>
    </FilterContext.Provider>
  );
};

export default StoreFilter;
