import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();

  const [profile, setProfile] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNum: '',
    pushNotifications: false,
    address: '',
    unit: '',
    city: '',
    state: '',
    zip: '',
    deliveryInstructions: '',
    latitude: '',
    longitude: '',
    zone: '',
    socialMedia: '',
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

  // Toggles for the login and signup box to be passed in as props to the Landing Nav Bar
  const [isLoginShown, setIsLoginShown] = useState(false); // checks if user is logged in
  const [isSignUpShown, setIsSignUpShown] = useState(false);

  // Options for which page is showing
  const [storePage, setStorePage] = useState(
    parseInt(localStorage.getItem('currentStorePage') || '0')
  );
  const [rightTabChosen, setRightTabChosen] = useState(0);

  useEffect(() => {
    if (
      location.state !== undefined &&
      (location.state.rightTabChosen !== undefined ||
        location.state.leftTabChosen !== undefined)
    )
      setStorePage(1);
  }, [location]);

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

  useEffect(() => {
    if (Auth.isAuth) {
      setProductsLoading(true);
      const AuthMethods = new AuthUtils();
      AuthMethods.getProfile().then((authRes) => {
        console.log('User profile and store items were retrieved');
        console.log('authRes: ', authRes);
        const updatedProfile = {
          email: authRes.customer_email,
          firstName: authRes.customer_first_name,
          lastName: authRes.customer_last_name,
          pushNotifications:
            authRes.cust_notification_approval === 'TRUE' ? true : false,
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
          socialMedia: authRes.user_social_media,
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
        pushNotifications: false,
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
        socialMedia: '',
      };
      setProfile(updatedProfile);

      console.log('long: ', long);
      console.log('lat: ', lat);
      if (long == undefined || lat == undefined) {
        window.location.href = `${window.location.origin.toString()}/`;
      }
    }
  }, []);
  function getBusinesses(long, lat, updatedProfile) {
    if (long !== '' && lat !== '') {
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
        setProductsLoading(true);
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

          // Put set of days into a dictionary with farm id as key
          // Set for faster lookups when inserting
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
        if (_farmList.length > 0 && updatedProfile.zone !== profile.zone)
          setProfile(updatedProfile);

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
              setProductsLoading(true);
              try {
                if (item.item_status === 'Active') {
                  const namePriceDesc =
                    item.item_name + item.item_price + item.item_desc;
                  // Business Price
                  const bPrice = item.business_price;

                  // if we've seen the the item before, check its business pricing and, if needed, creation date to take the lowest business price
                  if (namePriceDesc in itemDict) {
                    const itemIdx = itemDict[namePriceDesc];

                    // keeps a list of the items business_uid(s) with the business' associated pricing
                    _products[itemIdx].business_uids[item.itm_business_uid] =
                      item.item_price;

                    // checks for if the current iterated business has a lower price than the one previously seen
                    if (bPrice < _products[itemIdx].lowest_price) {
                      _products[itemIdx].lowest_price = bPrice;
                      _products[itemIdx].lowest_price_business_uid =
                        item.itm_business_uid;
                    }

                    // If the price is the same, take the one that was created first
                    if (
                      bPrice === _products[itemIdx].lowest_price &&
                      new Date(item.created_at) <
                        new Date(_products[itemIdx].created_at)
                    )
                      _products[itemIdx].lowest_price_business_uid =
                        item.itm_business_uid;
                  } else {
                    // If we haven't seen it push it into the dictionary just in case we see it again
                    itemDict[namePriceDesc] = _products.length;
                    item.business_uids = {
                      [item.itm_business_uid]: item.item_price,
                    };
                    item.lowest_price_business_uid = item.itm_business_uid;
                    item.lowest_price = bPrice;

                    // Push to products to have distinct products
                    _products.push(item);
                  }
                }
              } catch (error) {
                console.error(error);
              }
            }
          }
          setProducts(_products);
          setProductsLoading(false);
        });
      });
    }
  }

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
          rightTabChosen,
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
          setRightTabChosen={setRightTabChosen}
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
