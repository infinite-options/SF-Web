import React, { useState, useContext } from 'react';
import ProductTypeCategory from './ProductType';
import FarmCategory from './Farm';
import DaysCategory from './Days';
import ItemStack from './itemStack';
import appColors from '../../../styles/AppColors';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import storeContext from '../../storeContext';

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

  const [shownDays, setShownDays] = useState([]);

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
  );
};

export default StoreFilter;
