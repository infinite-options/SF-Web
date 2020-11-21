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

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

//this function calculate the number of items in the cart and set it to global hook context

var profileData = {};
const AuthMethods = new AuthUtils();
AuthMethods.getProfile().then((res) => {
  console.log('User profile was retrieved');
  profileData = res;
});

const Store = ({ ...props }) => {
  const Auth = useContext(AuthContext);

  const [profile, setProfile] = useState({}); // checks if user is logged in

  useEffect(() => {
    console.log('profile info changed');
    setProfile(profileData);
  }, [profileData]);

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
        }}
      >
        <StoreNavBar
          setIsLoginShown={setIsLoginShown}
          setIsSignUpShown={setIsSignUpShown}
          storePage={storePage}
          setStorePage={setStorePage}
        />

        {console.log('storePage: ', storePage)}
        <Box hidden={storePage != 0}>
          <Box display="flex">
            <ProduceSelectionPage />
          </Box>
        </Box>
        <Box hidden={storePage != 1}>
          <CheckoutPage profile={profile} />
        </Box>
      </storeContext.Provider>
    </div>
  );
};

export default Store;
