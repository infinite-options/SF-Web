import React, { useContext, useState, useEffect } from 'react';
import DisplayProduce from './produce/displayProduct';
import StoreFilter from './filter';
import ProdSelectContext from './prodSelectContext';
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

const ProduceSelectionPage = (props) => {
  const store = useContext(storeContext);
  const profile = store.profile;

  const [fruitSort, setValFruit] = useState(false);
  const [vegeSort, setValVege] = useState(false);
  const [dessertSort, setValDessert] = useState(false);
  const [othersSort, setValOther] = useState(false);

  const [itemError, setHasError] = useState(false);
  const [itemIsLoading, setIsLoading] = useState(false);

  const [farms, setFarms] = useState(props.farms);
  useEffect(() => {
    setFarms(props.farms);
  }, [props.farms]);

  const [busIsLoad, setBusLoading] = useState(false);
  const [busError, setBusError] = useState(false);
  // this state will notify if one of the farm is clicked or not
  const [farmsClicked, setFarmsClicked] = useState(new Set());

  // this state will notify if one of the days is clicked or not
  const [daysClicked, setDaysClicked] = useState(new Set());

  //if user wants to filtering day
  const [newWeekDay, setWeekDay] = useState([]);

  return (
    <ProdSelectContext.Provider
      value={{
        fruitSort,
        setValFruit,
        vegeSort,
        setValVege,
        dessertSort,
        setValDessert,
        othersSort,
        setValOther,
        itemError,
        itemIsLoading,
        farms,
        busIsLoad,
        busError,
        newWeekDay,
        setWeekDay,
        farmsClicked,
        setFarmsClicked,
        daysClicked,
        setDaysClicked,
      }}
    >
      <StoreFilter />
      <DisplayProduce />
    </ProdSelectContext.Provider>
  );
};

export default ProduceSelectionPage;
