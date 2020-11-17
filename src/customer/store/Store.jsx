import React, { useContext, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import someContexts from '../makeContext';
import DisplayProduce from './produce/displayProduct';
import StoreFilter from './filter';
import StoreNavBar from '../StoreNavBar';
import { AuthContext } from '../../auth/AuthContext';
import { Box } from '@material-ui/core';
import axios from 'axios';
import Checkout from '../checkout';

const BASE_URL =
  'https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/';

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

const Store = ({ ...props }) => {
  const Auth = useContext(AuthContext);

  // Options for which page is showing
  const [storePage, setStorePage] = useState(
    props.storePage !== undefined ? props.storePage : 0
  );

  const [cartTotal, setCartTotal] = useState(calTotal());
  const [fruitSort, setValFruit] = useState(true);
  const [vegeSort, setValVege] = useState(true);
  const [dessertSort, setValDessert] = useState(true);
  const [othersSort, setValOther] = useState(true);

  //this part will work for fatching and displaying the products of all items in shop
  var url = BASE_URL + 'itemsByBusiness/200-000003';
  const [itemsFromFetchTodDisplay, SetfetchData] = useState([]);
  const [itemError, setHasError] = useState(false);
  const [itemIsLoading, setIsLoading] = useState(false);

  //this useEffect fetch the data of all items
  useEffect(() => {
    let flag = false;
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const responseData = await response.json();
        console.log('Got the Data');
        if (!flag) {
          // console.log(responseData.result.result);
          SetfetchData(responseData.result.result);
        }
      } catch (err) {
        setHasError(true);
      } finally {
        console.log('finish loading');
        setIsLoading(true);
      }
    };
    fetchData();

    return () => {
      flag = true;
    };
  }, [url]);

  const [currentFootClick, setFootClick] = useState('days');
  const [defaultBussines, setnewBussiness] = useState([]);
  const [market, setMarket] = useState([]);
  const [busIsLoad, setBusLoading] = useState(false);
  const [busError, setBusError] = useState(false);
  //this state will notify if one of the farm is clicked or not
  const [farmClicked, setFarmClicked] = useState('');
  //this is the state of all market's farms
  const [allMarketFarm, setMarketFarms] = useState([]);
  // console.log(farmClicked);
  var businessURL =
    'https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/Categorical_Options/-121.928472,37.24370';

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
    <div hidden={props.hidden}>
      <someContexts.Provider
        value={{
          cartTotal,
          setCartTotal,
          fruitSort,
          setValFruit,
          vegeSort,
          setValVege,
          dessertSort,
          setValDessert,
          othersSort,
          setValOther,
          itemsFromFetchTodDisplay,
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
        {Auth.authLevel === 0 ? (
          <StoreNavBar storePage={storePage} setStorePage={setStorePage} />
        ) : (
          <></>
        )}
        {console.log('storePage: ', storePage)}
        <Box hidden={storePage != 0}>
          <Box display="flex">
            <StoreFilter />
            <DisplayProduce />
          </Box>
        </Box>
        <Box hidden={storePage != 1}>
          <Checkout />
        </Box>
      </someContexts.Provider>
    </div>
  );
};

export default Store;