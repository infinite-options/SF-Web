import React, { useContext, useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import StoreNavBar from './StoreNavBar';
import { AuthContext } from '../auth/AuthContext';
import storeContext from './storeContext';
import { Box } from '@material-ui/core';
import axios from 'axios';
import CheckoutPage from './checkoutPage';
import ProductSelectionPage from './productSelectionPage';
import AuthUtils from '../utils/AuthUtils';
import BusiApiReqs from '../utils/BusiApiReqs';
import AlertDialog from '../utils/dialog';
import { set } from 'js-cookie';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;
const cookies = new Cookies();

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
  const [dayTimeDict, setDayTimeDict] = useState({});
  const [numDeliveryTimes, setNumDeliveryTimes] = useState(0);
  const [daytimeFarmDict, setDaytimeFarmDict] = useState({});
  const [farmDaytimeDict, setFarmDaytimeDict] = useState({});

  const [expectedDelivery, setExpectedDelivery] = useState('');

  function getBuisnesses(long, lat) {
    const BusiMethods = new BusiApiReqs();
    BusiMethods.getLocationBusinessIds(long, lat).then((busiRes) => {
      // dictionary: business id with delivery days
      // show all if nothing selected
      if (busiRes == undefined) {
        setProductsLoading(false);
        return;
      }
      if (busiRes.result == undefined) {
        setProductsLoading(false);
        return;
      }
      console.log('busiRes: ', busiRes);
      const businessesRes = busiRes.result;
      const businessUids = new Set();
      const _farmList = [];
      const _dayTimeDict = {};
      const _daytimeFarmDict = {};
      const _farmDaytimeDict = {};
      // get a list of buiness UIDs for the next req and
      // the farms properties for the filter
      for (const business of businessesRes) {
        if (!businessUids.has(business.z_biz_id))
          businessUids.add(business.z_biz_id);
        const id = business.z_biz_id;
        const day = business.z_delivery_day;
        const time = business.z_delivery_time;
        const daytime = day + '&' + time;

        // Put set of farms into a dictionary with day as key
        // Set for faster lookups when inserting
        if (!(daytime in _daytimeFarmDict)) {
          _daytimeFarmDict[daytime] = new Set();
        }
        _daytimeFarmDict[daytime].add(id);

        if (!(day in _dayTimeDict)) {
          _dayTimeDict[day] = new Set();
        }
        _dayTimeDict[day].add(time);

        // Put (dictionary of day that contains a set of times) into a dictionary with id as key
        // - when clicking farm check id and see if day is a key in dictionary for filter
        // - the day key has a set to account for a farm that has multiple delivery times in a day
        // - if above note is not needed (only one delivery time per day), the set can be changed to one time string
        if (!(id in _farmDaytimeDict)) {
          _farmDaytimeDict[id] = new Set();
          _farmList.push({
            id: id,
            name: business.business_name,
            image: business.business_image,
          });
        }
        _farmDaytimeDict[id].add(daytime);
      }

      setNumDeliveryTimes(Object.keys(_daytimeFarmDict).length);
      setFarmsList(_farmList);
      setDayTimeDict(_dayTimeDict);
      setDaytimeFarmDict(_daytimeFarmDict);
      setFarmDaytimeDict(_farmDaytimeDict);
      BusiMethods.getItems(
        ['fruit', 'desert', 'vegetable', 'other'],
        Array.from(businessUids)
      ).then((itemRes) => {
        setProducts(itemRes !== undefined ? itemRes : []);
        setProductsLoading(false);
      });
    });
  }

  useEffect(() => {
    if (Auth.isAuth) {
      const AuthMethods = new AuthUtils();
      AuthMethods.getProfile().then((authRes) => {
        console.log('User profile and store items were retrieved');
        setProfile({
          email: authRes.customer_email,
          firstName: authRes.customer_first_name,
          lastName: authRes.customer_last_name,
          pushNotifications: authRes.customer_last_name,
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
        getBuisnesses(authRes.customer_long, authRes.customer_lat);
      });
    } else {
      const long = cookies.get('longitude');
      const lat = cookies.get('latitude');
      setProfile({
        email: '',
        firstName: '',
        lastName: '',
        phoneNum: '',
        address: cookies.get('address'),
        unit: '',
        city: cookies.get('city'),
        state: cookies.get('state'),
        zip: cookies.get('zip'),
        deliveryInstructions: '',
        latitude: lat,
        longitude: long,
      });

      console.log('long: ', long);
      console.log('lat: ', lat);
      if (long != undefined && lat != undefined) {
        getBuisnesses(long, lat);
      } else {
        window.location.href = `${window.location.origin.toString()}/`;
      }
    }
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
          numDeliveryTimes,
          dayTimeDict,
          daytimeFarmDict,
          farmDaytimeDict,
          expectedDelivery,
          setExpectedDelivery,
        }}
      >
        <StoreNavBar
          setIsLoginShown={setIsLoginShown}
          setIsSignUpShown={setIsSignUpShown}
          storePage={storePage}
          setStorePage={setStorePage}
        />
        <Box hidden={storePage !== 0}>
          <Box display="flex">
            <ProductSelectionPage farms={farmsList} />
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
