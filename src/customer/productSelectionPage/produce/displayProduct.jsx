import React, { useContext, useEffect, useState } from 'react';
import Entry from './Entry';
import ProdSelectContext from '../ProdSelectContext';
import storeContext from '../../storeContext';
import { Box, Grid, Paper, Typography } from '@material-ui/core';
import appColors from '../../../styles/AppColors';
import { set } from 'js-cookie';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  itemDisplayContainer: {
    backgroundColor: appColors.componentBg,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
    marginBottom: theme.spacing(2),
  },

  productsPaperContainer: {
    backgroundColor: appColors.componentBg,
    marginTop: theme.spacing(2),
  },
}));

// DONE: add unit, each is as is, anything else is '/' or 'per'
function createProduct2(product) {
  return (
    <Entry
      name={product.item_name}
      desc={product.item_desc}
      price={product.item_price}
      businessPrice={product.business_price}
      img={product.item_photo}
      type={product.item_type}
      unit={product.item_unit}
      isTaxable={product.taxable === 'TRUE'}
      business_uids={product.business_uids} // This is not from the database and not used, it is parsed in store within the last part of the getBusinesses method
      business_uid={product.lowest_price_business_uid} // This is the business ID with the lowest price, also parsed from the getBusinesses method
      id={product.item_uid}
      key={product.item_uid}
    />
  );
}
// TEST: We are considering matching on item_name, item_desc and item_price.
// If they are identical we should choose the one with the lowest business_price.
// If Identical still then we should select the one with the earliest created_at date

function DisplayProduct() {
  const classes = useStyles();
  const productSelect = useContext(ProdSelectContext);
  const store = useContext(storeContext);

  const [windowHeight, setWindowHeight] = React.useState(window.innerHeight);

  useEffect(() => {
    window.addEventListener('resize', updateWindowHeight);
    return () => window.removeEventListener('resize', updateWindowHeight);
  });

  const updateWindowHeight = () => {
    setWindowHeight(window.innerHeight);
  };

  const [displayMessage, setDisplayMessage] = useState('');

  // DONE: add date to expected delivery
  // DONE: clear out expected delivery if unclicked
  useEffect(() => {
    let message = '';
    if (store.dayClicked === '') {
      message = 'Start by selecting a delivery date and time.';

      if (store.cartTotal > 0) {
        message = 'Here are the items currently in your cart';
      }
    } else {
      message = 'Produce available for delivery on ' + store.expectedDelivery;
    }
    if (store.products.length === 0 && !store.productsLoading) {
      message =
        'Sorry, we could not find any produce that can be delivered to your provided address';
    }
    setDisplayMessage(message);
  }, [
    store.dayClicked,
    store.products,
    store.productsLoading,
    store.cartTotal,
  ]);

  if (!store.productsLoading && !productSelect.itemError) {
    return (
      <Box
        className = {classes.itemDisplayContainer}
      >
        <Paper
          elevation={0}
          className = {classes.productsPaperContainer}
        >
          <Box justifyContent="center">
            <Grid container direction="row" justify="flex-start" 
              // spacing={5}
            >
              {store.products.map(createProduct2)}
            </Grid>
          </Box>
        </Paper>
      </Box>
    );
  } else {
    return (
      <Box
        p={2}
        style={{ display: 'flex', backgroundColor: appColors.componentBg, borderRadius: 10}}
      >
        <Typography>Thank you for waiting, we are loading the products for you.</Typography>
      </Box>
    );
  }
}

export default DisplayProduct;
