import React, { useContext, useEffect, useState } from 'react';
import Entry from './Entry';
import ProdSelectContext from '../ProdSelectContext';
import storeContext from '../../storeContext';
import { Box, Grid } from '@material-ui/core';
import appColors from '../../../styles/AppColors';
import { set } from 'js-cookie';

function createProduct2(product) {
  var tryItem = product.item_name.slice(
    product.item_name.indexOf('('),
    product.item_name.indexOf('(') + 11
  );
  var itemName = product.item_name.slice(0, product.item_name.indexOf('('));
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

  //because at the start of the fetching, it has nothing and that will cause error
  //with this if condition, we only work if we get the data
  if (!store.productsLoading && !productSelect.itemError) {
    return (
      <>
        <Box
          width="100%"
          ml={2}
          p={3}
          mb={2}
          style={{ backgroundColor: appColors.componentBg, borderRadius: 10 }}
        >
          {productSelect.daysClicked.size == 0 &&
          productSelect.farmsClicked.size == 0
            ? 'Please select a day or farm.'
            : ''}
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="flex-start"
            spacing={2}
          >
            {store.products.map(createProduct2)}
          </Grid>
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
