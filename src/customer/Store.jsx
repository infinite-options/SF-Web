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
    props.storePage !== undefined ? props.storePage : 0
  );

  const [cartTotal, setCartTotal] = useState(calTotal());
  const [cartItems, setCartItems] = useState({});

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
