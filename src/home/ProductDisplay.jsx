import React, { useState, useEffect } from 'react';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import appColors from '../styles/AppColors';
import BusiApiReqs from '../utils/BusiApiReqs';
import classes from '*.module.css';
import Axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: appColors.componentBg,
  },
}));

const BusiMethods = new BusiApiReqs();

const ProductDisplay = () => {
  const classes = useStyles();
  const [itemsList, setItemsList] = useState([]);

  useEffect(() => {
    BusiMethods.getItems(
      ['fruit', 'desert', 'vegetable', 'other'],
      ['200-000016', '200-000017']
    ).then((itemsData) => {});
  return (
    <Box my={5} className={classes.root}>
      {itemsList.map()}
    </Box>
  );
};

export default ProductDisplay;
