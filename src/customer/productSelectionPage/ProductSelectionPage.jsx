import React, { useContext, useState, useEffect } from 'react';
import DisplayProduce from './produce/displayProduct';
import StoreFilter from './filter';
import ProdSelectContext from './ProdSelectContext';
import axios from 'axios';
import storeContext from '../storeContext';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI + '';

//this function calculate the number of items in the cart and set it to global hook context
function calTotal() {
  var amount = 0,
    keys = Object.keys(localStorage),
    index = keys.length;
  for (var i = 0; i < index; i++) {
    if (keys[i].length > 30) {
      var quantity = window.localStorage.getItem(keys[i]);
      amount += parseInt(quantity);
      // arr.push(JSON.parse(keys[i]));
    }
  }
  return amount;
}

const ProductSelectionPage = (props) => {
  const store = useContext(storeContext);
  const profile = store.profile;

  const [itemError, setHasError] = useState(false);
  const [itemIsLoading, setIsLoading] = useState(false);

  const [farms, setFarms] = useState(props.farms);
  useEffect(() => {
    setFarms(props.farms);
  }, [props.farms]);

  const [busIsLoad, setBusLoading] = useState(false);
  const [busError, setBusError] = useState(false);
  // this state will notify if one of the farm is clicked or not
  const [farmsClicked, setFarmsClicked] = useState(store.farmsClicked);

  useEffect(() => {
    setFarmsClicked(store.farmsClicked);
  }, [store.farmsClicked]);

  // this state will notify if one of the days is clicked or not
  const [categoriesClicked, setCategoriesClicked] = useState(new Set());

  return (
    <ProdSelectContext.Provider
      value={{
        itemError,
        itemIsLoading,
        farms,
        busIsLoad,
        busError,
        farmsClicked,
        setFarmsClicked,
        categoriesClicked,
        setCategoriesClicked,
      }}
    >
      <StoreFilter />
      <DisplayProduce />
    </ProdSelectContext.Provider>
  );
};

export default ProductSelectionPage;
