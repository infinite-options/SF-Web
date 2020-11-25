import React, { useContext, useEffect, useState } from 'react';
import Entry from './Entry';
import Footer from '../../Footer';
import Header from '../../Header';
import prodSelectContext from '../prodSelectContext';
import storeContext from '../../storeContext';
import { Box } from '@material-ui/core';
import appColors from '../../../styles/AppColors';

function createProduct2(products) {
  var tryItem = products.item_name.slice(
    products.item_name.indexOf('('),
    products.item_name.indexOf('(') + 11
  );
  var itemName = products.item_name.slice(0, products.item_name.indexOf('('));
  // console.log(tryItem);
  return (
    <Entry
      name={itemName}
      price={products.item_price}
      img={products.item_photo}
      meaning={tryItem}
      business_uid={products.itm_business_uid}
      id={products.item_uid}
      key={products.item_uid}
    />
  );
}

function DisplayProduct() {
  const prodChoice = useContext(prodSelectContext);
  const store = useContext(storeContext);
  const [productsDisplay, setProductsDisplay] = useState(store.products);

  const [fruits, setFruits] = useState([]);
  const [vegetables, setVegetables] = useState([]);
  const [desserts, setDesserts] = useState([]);
  const [others, setOthers] = useState([]);

  const [isFilter, setIsFilter] = useState(
    prodChoice.fruitSort ||
      prodChoice.vegeSort ||
      prodChoice.dessertSort ||
      prodChoice.othersSort
  );

  useEffect(() => {
    setIsFilter(
      prodChoice.fruitSort ||
        prodChoice.vegeSort ||
        prodChoice.dessertSort ||
        prodChoice.othersSort
    );
  }, [
    prodChoice.fruitSort,
    prodChoice.vegeSort,
    prodChoice.dessertSort,
    prodChoice.othersSort,
  ]);

  useEffect(() => {
    console.log('rerendered products');
    setProductsDisplay(store.products);
    setFruits(
      store.products.filter((product) => product.item_type === 'fruit')
    );
    setVegetables(
      store.products.filter((product) => product.item_type === 'vegetable')
    );
    setDesserts(
      store.products.filter((product) => product.item_type === 'dessert')
    );
    setOthers(
      store.products.filter((product) => product.item_type === 'others')
    );
  }, [store.products]);

  //because at the start of the fetching, it has nothing and that will cause error
  //with this if condition, we only work if we get the data
  if (!store.productsLoading && !prodChoice.itemError) {
    return (
      <>
        <Box
          ml={2}
          p={2}
          width="100%"
          style={{ backgroundColor: appColors.componentBg, borderRadius: 10 }}
        >
          <Box mb={2}>
            Produce from farms delivering on {prodChoice.newWeekDay}
            <Box hidden={!prodChoice.fruitSort && isFilter}>
              <Box display="flex" flexWrap="wrap">
                {fruits.map(createProduct2)}
              </Box>
            </Box>
            <Box hidden={!prodChoice.vegeSort && isFilter}>
              <Box display="flex" flexWrap="wrap">
                {vegetables.map(createProduct2)}
              </Box>
            </Box>
            <Box hidden={!prodChoice.dessertSort && isFilter}>
              <Box display="flex" flexWrap="wrap">
                {desserts.map(createProduct2)}
              </Box>
            </Box>
            <Box hidden={!prodChoice.othersSort && isFilter}>
              <Box display="flex" flexWrap="wrap">
                {others.map(createProduct2)}
              </Box>
            </Box>
          </Box>
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
