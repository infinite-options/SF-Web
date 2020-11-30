import React, { useContext, useEffect, useState } from 'react';
import Entry from './Entry';
import ProdSelectContext from '../ProdSelectContext';
import storeContext from '../../storeContext';
import { Box, Grid, Paper } from '@material-ui/core';
import appColors from '../../../styles/AppColors';
import { set } from 'js-cookie';

function createProduct2(product) {
  if (product.itm_business_uid == '200-000016')
    console.log('product: ', product);
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

  React.useEffect(() => {
    window.addEventListener('resize', updateWindowHeight);
    return () => window.removeEventListener('resize', updateWindowHeight);
  });

  const updateWindowHeight = () => {
    setWindowHeight(window.innerHeight);
  };

  //because at the start of the fetching, it has nothing and that will cause error
  //with this if condition, we only work if we get the data
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
          {productSelect.daysClicked.size == 0
            ? store.cartTotal == 0
              ? 'Please select the day that you want your produce delivered.'
              : 'Here are the items currently in your cart'
            : ' '}
          <Box mt={2} />
          <Paper
            style={{
              backgroundColor: appColors.componentBg,
              maxHeight: '100%',
              overflow: 'auto',
            }}
          >
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="flex-start"
              spacing={2}
            >
              {store.products.map(createProduct2)}
            </Grid>
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
