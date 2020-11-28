import React, { useContext, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import DisplayProduce from './produceSelectionPage/produce/displayProduct';
import StoreFilter from './produceSelectionPage/filter';
import StoreNavBar from './StoreNavBar';
import { AuthContext } from '../auth/AuthContext';
import storeContext from './storeContext';
import prodSelectContext from './produceSelectionPage/ProdSelectContext';
import { Box } from '@material-ui/core';
import axios from 'axios';
import CheckoutPage from './checkoutPage';
import ProduceSelectionPage from './produceSelectionPage';
import AuthUtils from '../utils/AuthUtils';
import BusiApiReqs from '../utils/BusiApiReqs';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

//this function calculate the number of items in the cart and set it to global hook context

const Store = ({ ...props }) => {
  const Auth = useContext(AuthContext);

  const [profile, setProfile] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNum: '',
    address: '',
    unit: '',
    city: '',
    state: '',
    zip: '',
    deliveryInstructions: '',
    latitude: '',
    longitude: '',
  }); // checks if user is logged in
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [farmsList, setFarmsList] = useState([]);
  const [farmsDict, setFarmsDict] = useState({});
  const [daysDict, setDaysDict] = useState({});

  useEffect(() => {
    const AuthMethods = new AuthUtils();
    const BusiMethods = new BusiApiReqs();
    AuthMethods.getProfile().then((authRes) => {
      console.log('User profile and store items were retrieved');
      setProfile({
        email: authRes.customer_email,
        firstName: authRes.customer_first_name,
        lastName: authRes.customer_last_name,
        phoneNum: authRes.customer_phone_num,
        address: authRes.customer_address,
        unit: authRes.customer_unit,
        city: authRes.customer_city,
        state: authRes.customer_state,
        zip: authRes.customer_zip,
        deliveryInstructions: '',
        latitude: authRes.customer_lat,
        longitude: authRes.customer_long,
      });
      BusiMethods.getLocationBusinessIds(
        authRes.customer_long,
        authRes.customer_lat
      ).then((busiRes) => {
        // dictionary: business id with delivery days
        // show all if nothing selected
        if (busiRes !== undefined) {
          console.log('busiRes: ', busiRes);
          const businessesRes = busiRes.result;
          const businessUids = new Set();
          const _farmList = [];
          const _daysDict = {};
          const _farmsDict = {};
          // get a list of buiness UIDs for the next req and
          // the farms properties for the filter
          for (const business of businessesRes) {
            if (!businessUids.has(business.z_biz_id))
              businessUids.add(business.z_biz_id);
            const id = business.z_biz_id;
            const day = business.z_delivery_day;
            const time = business.z_delivery_time;

            // Put set of farms into a dictionary with day as key
            // Set for faster lookups when inserting
            if (day in _daysDict) {
              if (!_daysDict[day].has(id)) _daysDict[day].add(id);
            } else {
              _daysDict[day] = new Set();
              _daysDict[day].add(id);
            }

            // Put (dictionary of day that contains a set of times) into a dictionary with id as key
            // - when clicking farm check id and see if day is a key in dictionary for filter
            // - the day key has a set to account for a farm that has multiple delivery times in a day
            // - if above note is not needed (only one delivery time per day), the set can be changed to one time string
            console.log('id: ', id);
            if (id in _farmsDict) {
              if (day in _farmsDict[id]) {
                if (!_farmsDict[id][day].has(time))
                  _farmsDict[id][day].add(time);
              } else {
                _farmsDict[id][day] = new Set();
                _farmsDict[id][day].add(time);
              }
            } else {
              console.log('name: ', business.business_name);
              _farmList.push({
                id: id,
                name: business.business_name,
                image: business.business_image,
              });
              _farmsDict[id] = { [day]: new Set() };
              _farmsDict[id][day].add(time);
            }
          }
          console.log('_farmList', _farmList);
          console.log('_farmsDict', _farmsDict);
          console.log('_daysDict', _daysDict);
          setFarmsList(_farmList);
          setFarmsDict(_farmsDict);
          setDaysDict(_daysDict);

          BusiMethods.getItems(
            ['fruit', 'desert', 'vegetable', 'other'],
            Array.from(businessUids)
          ).then((itemRes) => {
            setProducts(itemRes !== undefined ? itemRes : []);
            setProductsLoading(false);
          });
        }
      });
    });
  }, []);

  // Toggles for the login and signup box to be passed in as props to the Landing Nav Bar
  const [isLoginShown, setIsLoginShown] = useState(false); // checks if user is logged in
  const [isSignUpShown, setIsSignUpShown] = useState(false);

  // Options for which page is showing
  const [storePage, setStorePage] = useState(
    parseInt(localStorage.getItem('currentStorePage') || '0')
  );

  useEffect(() => {
    localStorage.setItem('currentStorePage', storePage);
  }, [storePage]);

  localStorage.setItem('currentStorePage', storePage);

  const [cartTotal, setCartTotal] = useState(
    parseInt(localStorage.getItem('cartTotal') || '0')
  );
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem('cartItems') || '{}')
  );

  useEffect(() => {
    console.log('cartTotal: ', cartTotal);
    localStorage.setItem('cartTotal', cartTotal);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartTotal, cartItems]);

  props.hidden = props.hidden !== null ? props.hidden : false;

  return (
    <div hidden={props.hidden}>
      <storeContext.Provider
        value={{
          cartTotal,
          setCartTotal,
          cartItems,
          setCartItems,
          profile,
          setProfile,
          products,
          productsLoading,
          setStorePage,
          farmsDict,
          daysDict,
        }}
      >
        <StoreNavBar
          setIsLoginShown={setIsLoginShown}
          setIsSignUpShown={setIsSignUpShown}
          storePage={storePage}
          setStorePage={setStorePage}
        />
        {console.log('storePage: ', storePage)}
        <Box hidden={storePage !== 0}>
          <Box display="flex">
            <ProduceSelectionPage farms={farmsList} />
          </Box>
        </Box>
        <Box hidden={storePage !== 1}>
          <CheckoutPage />
        </Box>
      </storeContext.Provider>
    </div>
  );
};

export default Store;
