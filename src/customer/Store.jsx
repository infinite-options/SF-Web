import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import StoreNavBar from './StoreNavBar';
import { AuthContext } from '../auth/AuthContext';
import storeContext from './storeContext';
import { Box } from '@material-ui/core';

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
    customer_uid: '',
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
    zone: '',
  }); // checks if user is logged in
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [farmsList, setFarmsList] = useState([]);
  const [dayTimeDict, setDayTimeDict] = useState({});
  const [numDeliveryTimes, setNumDeliveryTimes] = useState(0);
  const [daytimeFarmDict, setDaytimeFarmDict] = useState({});
  const [farmDaytimeDict, setFarmDaytimeDict] = useState({});
  const [startDeliveryDate, setStartDeliveryDate] = useState('');
  const [expectedDelivery, setExpectedDelivery] = useState('');

  const [farmsClicked, setFarmsClicked] = useState(new Set());
  const [dayClicked, setDayClicked] = useState(
    localStorage.getItem('selectedDay') || ''
  );

  useEffect(() => {
    localStorage.setItem('selectedDay', dayClicked);
  }, [dayClicked]);

  useEffect(() => {
    console.log('profile updated: ', profile.latitude);
    getBusinesses(profile.longitude, profile.latitude, { ...profile });
  }, [profile.latitude]);

  function getBusinesses(long, lat, updatedProfile) {
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
            zone: business.zone,
          });
          updatedProfile.zone = business.zone;
        }
        _farmDaytimeDict[id].add(daytime);
      }

      setNumDeliveryTimes(Object.keys(_daytimeFarmDict).length);
      setFarmsList(_farmList);
      setDayTimeDict(_dayTimeDict);
      setDaytimeFarmDict(_daytimeFarmDict);
      setFarmDaytimeDict(_farmDaytimeDict);
      if (_farmList.length > 0) setProfile(updatedProfile);

      console.log('profile: ', profile);
      BusiMethods.getItems(
        ['fruit', 'desert', 'vegetable', 'other'],
        Array.from(businessUids)
      ).then((itemRes) => {
        const _products = [];
        const itemDict = {};
        if (itemRes !== undefined) {
          setAllProducts(itemRes);
          for (const item of itemRes) {
            const namePrice = item.item_name + item.item_price;
            if (namePrice in itemDict) {
              _products[itemDict[namePrice]].business_uids[
                [item.itm_business_uid]
              ] = item.item_price;
            } else {
              itemDict[namePrice] = _products.length;
              item.business_uids = { [item.itm_business_uid]: item.item_price };
              _products.push(item);
            }
          }
        }
        setProducts(_products);
        setProductsLoading(false);
      });
    });
  }

  useEffect(() => {
    if (Auth.isAuth) {
      const AuthMethods = new AuthUtils();
      AuthMethods.getProfile().then((authRes) => {
        console.log('User profile and store items were retrieved');
        console.log('authRes: ', authRes);
        const updatedProfile = {
          customer_uid: authRes.customer_uid,
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
          zone: '',
        };
        setProfile(updatedProfile);
      });
    } else {
      const long = cookies.get('longitude');
      const lat = cookies.get('latitude');
      const updatedProfile = {
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
        zone: '',
      };
      setProfile(updatedProfile);

      console.log('long: ', long);
      console.log('lat: ', lat);
      if (long == undefined || lat == undefined) {
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
          startDeliveryDate,
          setStartDeliveryDate,
          farmsClicked,
          setFarmsClicked,
          dayClicked,
          setDayClicked,
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
