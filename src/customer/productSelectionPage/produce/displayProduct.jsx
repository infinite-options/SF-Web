import React, { useContext, useEffect, useState } from 'react';
import Entry from './Entry';
import ProdSelectContext from '../ProdSelectContext';
import storeContext from '../../storeContext';
import { Box, Grid, Paper } from '@material-ui/core';
import appColors from '../../../styles/AppColors';
import { set } from 'js-cookie';

function createProduct2(product) {
  var tryItem = '';
  var itemName = product.item_name;
  if (product.item_name.indexOf('(') !== -1) {
    tryItem = product.item_name.slice(
      product.item_name.indexOf('('),
      product.item_name.indexOf(')') + 1
    );
    itemName = product.item_name.slice(0, product.item_name.indexOf('('));
  }
  return (
    <Entry
      name={itemName}
      price={product.item_price}
      img={product.item_photo}
      type={product.item_type}
      meaning={tryItem}
      business_uid={product.itm_business_uid}
      id={product.item_uid}
      key={product.item_uid}
    />
  );
}

function DisplayProduct() {
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
    if (productSelect.daysClicked.size == 0) {
      message = 'Please select one produce delivery date and time.';

      if (store.cartTotal > 0) {
        message = 'Here are the items currently in your cart';
      }
    } else {
      message = 'Produce available for delivery on ' + store.expectedDelivery;
    }
    if (store.products.length == 0 && !store.productsLoading) {
      message =
        'Sorry, we could not find any produce that can be delivered to your provided address';
    }
    setDisplayMessage(message);
  }, [productSelect.daysClicked, store.productsLoading, store.cartTotal]);

  if (!store.productsLoading && !productSelect.itemError) {
    return (
      <>
        <Box
          width="100%"
          height={windowHeight - 165}
          ml={2}
          p={3}
          pb={5}
          mb={2}
          style={{ backgroundColor: appColors.componentBg, borderRadius: 10 }}
        >
          {displayMessage}
          <Box mt={2} />
          <Paper
            style={{
              backgroundColor: appColors.componentBg,
              maxHeight: '100%',
              width: '100%',
              overflow: 'auto',
            }}
          >
            <Box width="97%" justifyContent="center">
              <Grid container direction="row" justify="flex-start" spacing={5}>
                {store.products.map(createProduct2)}
              </Grid>
            </Box>
          </Paper>
        </Box>
      </>
    );
  } else {
    return (
      <Box
        ml={2}
        p={2}
        width="100%"
        style={{ backgroundColor: appColors.componentBg, borderRadius: 10 }}
      >
        <div>Thank you for waiting, we are loading the products for you.</div>
      </Box>
    );
  }
}

export default DisplayProduct;
