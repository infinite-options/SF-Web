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
      // i < 50 mostly to prevent possible infinite loop and to account for 1 availale day out of the week
      const SelectedFarmDays = new Set();

      for (const farm of produceSelect.farmsClicked) {
        for (const day in store.farmsDict[farm]) {
          if (!SelectedFarmDays.has(day)) {
            SelectedFarmDays.add(day);
          }
        }
      }

      while (default7Days.length < 7 && i < 50) {
        var today = new Date();
        // +1 because date days starts at 0
        today.setDate(today.getDate() + 1 + i);

        const todaysDayUpper = fullDays[today.getDay()].toUpperCase();
        console.log(
          'checkdays: ',
          todaysDayUpper,
          store.daysDict,
          SelectedFarmDays
        );
        if (
          todaysDayUpper in store.daysDict &&
          (SelectedFarmDays.has(todaysDayUpper) || SelectedFarmDays.size == 0)
        ) {
          var newDay = {
            index: i,
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

  const [shownDays, setShownDays] = useState([]);
  const [allDays, setAllDays] = useState([]);

  useEffect(() => {
    setShownDays(createDefault7Day());
    console.log('shownDays: ', shownDays);
  }, [store.daysDict, produceSelect.farmsClicked]);

  return (
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
        <FilterContext.Provider value={{ shownDays }}>
          <Box className={clsx(classes.borderCol, classes.filterCol)}>
            {ItemStack(DaysCategory)}
          </Box>
          <Box className={clsx(classes.borderCol, classes.filterCol)}>
            {ItemStack(FarmCategory)}
          </Box>
          <Box className={classes.filterCol}>
            {ItemStack(ProductTypeCategory)}
          </Box>
        </FilterContext.Provider>
      </Box>
    </Box>
  );
};

export default StoreFilter;
