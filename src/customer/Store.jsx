import React, { useContext, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import DisplayProduce from './produceSelectionPage/produce/displayProduct';
import StoreFilter from './produceSelectionPage/filter';
import StoreNavBar from './StoreNavBar';
import { AuthContext } from '../auth/AuthContext';
import storeContext from './storeContext';
import prodSelectContext from './produceSelectionPage/prodSelectContext';
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
        if (busiRes !== undefined) {
          var businessUids = [];
          for (const business of busiRes)
            businessUids.push(business.business_uid);
          BusiMethods.getItems(
            ['fruit', 'desert', 'vegetable', 'other'],
            businessUids
          ).then((itemRes) => {
            setProducts(itemRes);
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
            <ProduceSelectionPage />
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
