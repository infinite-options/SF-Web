import React from 'react';
import ProduceCategory from './Produce';
import MarketCategory from './Market';
import FarmCategory from './Farm';
import DaysCategory from './Days';
import ItemStack from './itemStack';
import appColors from '../../../styles/AppColors';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  borderCol: {
    borderRight: '1px solid ' + appColors.secondary,
  },
  filterLabel: {
    width: '120px',
    textAlign: 'center',
  },
}));

const StoreFilter = () => {
  const classes = useStyles();
  return (
    <Box width="350px">
      <Box
        display="flex"
        justifyContent="center"
        p={1}
        mb={1}
        style={{ backgroundColor: appColors.componentBg, borderRadius: 10 }}
      >
        <Box className={clsx(classes.borderCol, classes.filterLabel)}>
          Delivery Days
        </Box>
        <Box className={clsx(classes.borderCol, classes.filterLabel)}>
          Farmer's Markets
        </Box>
        <Box className={clsx(classes.borderCol, classes.filterLabel)}>
          Farms
        </Box>
        <Box className={classes.filterLabel}>Item Category</Box>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        p={1}
        style={{ backgroundColor: appColors.componentBg, borderRadius: 10 }}
      >
        <Box className={clsx(classes.borderCol, classes.filterLabel)}>
          {ItemStack(DaysCategory)}
        </Box>
        <Box className={clsx(classes.borderCol, classes.filterLabel)}>
          {ItemStack(MarketCategory)}
        </Box>
        <Box className={clsx(classes.borderCol, classes.filterLabel)}>
          {ItemStack(FarmCategory)}
        </Box>
        <Box className={classes.filterLabel}>{ItemStack(ProduceCategory)}</Box>
      </Box>
    </Box>
  );
};

export default StoreFilter;
