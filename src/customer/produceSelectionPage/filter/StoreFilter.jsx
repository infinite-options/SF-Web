import React, { useState, useContext, useEffect } from 'react';
import ProductTypeCategory from './ProductType';
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
  },
}));

const StoreFilter = () => {
  const classes = useStyles();
  const store = useContext(storeContext);
  const produceSelect = useContext(ProdSelectContext);

  const [shownDays, setShownDays] = useState([]);
  const [shownFarms, setShownFarms] = useState([]);

  // TODO: Change to hidden field like how farms is implemented
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
    if (Object.keys(store.dayTimeDict).length > 0) {
      const SelectedFarmDays = new Set();
      var numSelectedTimes = 0;

      // Get the days of all of the selected farms
      // produceSelect.farmsClicked is a set
      for (const farm of produceSelect.farmsClicked) {
        for (const day in store.farmDayTimeDict[farm]) {
          // find the amount of times with a farm's day using the dictionary
          if (!SelectedFarmDays.has(day)) {
            numSelectedTimes += store.farmDayTimeDict[farm][day].size;
          }
          SelectedFarmDays.add(day);
        }
      }

      // If there are no selected farm, just use the number of delivery times within each day
      const numShowndays =
        numSelectedTimes > 0 ? numSelectedTimes : store.numDeliveryTimes;

      // i < 30 mostly to prevent possible infinite loop (only likely if there is misspelled weekday name)
      //
      // The whole goal is to get all of the days with their times that are available within the customer zone
      while (default7Days.length < numShowndays && i < 30) {
        var today = new Date();
        // +1 because getDate() returns the date date number indexing from 0
        today.setDate(today.getDate() + 1 + i);

        // toUpperCase because the dictionary stores in upper case
        const todaysDayUpper = fullDays[today.getDay()].toUpperCase();

        // if the iterated day is in within the the dictionary to account for no selected farms
        if (
          todaysDayUpper in store.dayTimeDict &&
          (SelectedFarmDays.has(todaysDayUpper) || SelectedFarmDays.size == 0)
        ) {
          for (const time of store.dayTimeDict[todaysDayUpper].entries()) {
            // IMPORTANT: make sure the index used for mapping a component key is unique,
            // I ran into rendering issue when they were the same
            var newDay = {
              index: todaysDayUpper + time,
              time: time,
              weekDay: days[today.getDay()],
              month: months[today.getMonth()],
              day: today.getDate(),
              weekDayFull: fullDays[today.getDay()],
            };
            default7Days.push(newDay);
          }
        }
        i++;
      }
    }

    return default7Days;
  };

  // For when the URL endpoints have finished loading in all of the information
  useEffect(() => {
    setShownDays(createDefault7Day());
  }, [store.dayTimeDict, produceSelect.farmsClicked]);

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
          <Box className={classes.filterCol}>
            {ItemStack(ProductTypeCategory)}
          </Box>
        </Box>
      </Box>
    </FilterContext.Provider>
  );
};

export default StoreFilter;
