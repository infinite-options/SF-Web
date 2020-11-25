import React, { useContext, useState, useEffect } from 'react';
import DisplayProduce from './produce/displayProduct';
import StoreFilter from './filter';
import prodSelectContext from './prodSelectContext';
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

const ProduceSelectionPage = ({ ...props }) => {
  const store = useContext(storeContext);
  const profile = store.profile;

  const [fruitSort, setValFruit] = useState(false);
  const [vegeSort, setValVege] = useState(false);
  const [dessertSort, setValDessert] = useState(false);
  const [othersSort, setValOther] = useState(false);

  const [itemError, setHasError] = useState(false);
  const [itemIsLoading, setIsLoading] = useState(false);

  const [currentFootClick, setFootClick] = useState('days');
  const [defaultBussines, setnewBussiness] = useState([]);
  const [market, setMarket] = useState([]);
  const [busIsLoad, setBusLoading] = useState(false);
  const [busError, setBusError] = useState(false);
  // this state will notify if one of the farm is clicked or not
  const [farmClicked, setFarmClicked] = useState('');
  // this is the state of all market's farms
  const [allMarketFarm, setMarketFarms] = useState([]);
  // console.log(farmClicked);
  var businessURL =
    process.env.REACT_APP_SERVER_BASE_URI +
    'Categorical_Options/-121.928472,37.24370';

  useEffect(() => {
    axios
      .get(businessURL)
      .then((response) => {
        // console.log(response.data.result);
        // console.log(response.data.result[3].business_association);
        var initalBus = response.data.result;
        var marketFarm = [];
        var notMarketFarm = [];
        for (var i = 0; i < initalBus.length; i++) {
          if (initalBus[i].business_type === 'Farmers Market') {
            marketFarm.push(initalBus[i]);
          } else {
            notMarketFarm.push(initalBus[i]);
          }
        }
        setMarket(marketFarm);
        setnewBussiness(notMarketFarm);
      })
      .catch((er) => {
        setBusError(true);
        console.log(er);
      })
      .finally(() => {
        console.log('Business is loaded');
        setBusLoading(true);
      });
  }, [businessURL]);

  //if user wants to filtering day
  const [newWeekDay, setWeekDay] = useState([]);

  props.hidden = props.hidden !== null ? props.hidden : false;

  return (
    <prodSelectContext.Provider
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
        currentFootClick,
        setFootClick,
        defaultBussines,
        busIsLoad,
        busError,
        newWeekDay,
        setWeekDay,
        market,
        setMarket,
        farmClicked,
        setFarmClicked,
      }}
    >
      <StoreFilter />
      <DisplayProduce />
    </prodSelectContext.Provider>
  );
};

export default ProduceSelectionPage;
