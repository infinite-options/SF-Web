import React, { useContext, useState, useEffect } from 'react';
import DisplayProduce from './produce/displayProduct';
import CheckoutPage from '../checkoutPage/CheckoutStorePage';
import StoreFilter from './filter';
import Footer from '../../home/Footer';
import {
  Box,
  Badge,
  Grid,
  Dialog,
  Button,
  Hidden,
  IconButton,
  Drawer,
} from '@material-ui/core';
import ProdSelectContext from './ProdSelectContext';
import axios from 'axios';
import storeContext from '../storeContext';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import OrderConfirmation from '../checkoutPage/utils/OrderConfirmation';
import AdminLogin from '../../auth/AdminLogin';
import { AuthContext } from 'auth/AuthContext';
import Signup from '../../auth/Signup';


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

const ProductSelectionPage = (props) => {
  const store = useContext(storeContext);
  const auth = useContext(AuthContext);

  const { checkingOut, setCheckingOut } = useContext(storeContext);
  const profile = store.profile;

  const [loggingIn, setLoggingIn] = React.useState(false);
  const [signingUp, setSigningUp] = React.useState(false);
  const [itemError, setHasError] = useState(false);
  const [itemIsLoading, setIsLoading] = useState(false);

  const [farms, setFarms] = useState(props.farms);
  useEffect(() => {
    setFarms(props.farms);
  }, [props.farms]);

  const [busIsLoad, setBusLoading] = useState(false);
  const [busError, setBusError] = useState(false);
  // this state will notify if one of the farm is clicked or not
  const [farmsClicked, setFarmsClicked] = useState(store.farmsClicked);

  useEffect(() => {
    setFarmsClicked(store.farmsClicked);
  }, [store.farmsClicked]);

  // this state will notify if one of the days is clicked or not
  const [categoriesClicked, setCategoriesClicked] = useState(new Set());

  const itemsAmount = store.cartTotal;

  return (
    <Box>
      <ProdSelectContext.Provider
        value={{
          loggingIn,
          setLoggingIn,
          signingUp,
          setSigningUp,
          itemError,
          itemIsLoading,
          farms,
          busIsLoad,
          busError,
          farmsClicked,
          setFarmsClicked,
          categoriesClicked,
          setCategoriesClicked,
        }}
      >
        <Box style ={{opacity: !store.isCheckoutLogin|| !store.isCheckoutSignUp  || auth.isAuth ? 1 : .6}} >
        <Grid container>
          <Grid
            item
            lg={8}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <StoreFilter />
            <Box  hidden={store.orderConfirmation}>
              <DisplayProduce />
            </Box>

            <Box hidden={!store.orderConfirmation}>
              <OrderConfirmation />
            </Box>
          </Grid>

          <Hidden mdDown>
            <Grid item lg={4}>
              <CheckoutPage />
            </Grid>
          </Hidden>
        </Grid>      

        <Hidden lgUp>
          <Drawer variant="temporary" anchor="bottom" open={checkingOut}>
            <Box
              mt={2}
              pr={1}
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <IconButton onClick={() => setCheckingOut(false)}>
                <Badge badgeContent={itemsAmount} color="primary">
                  <ShoppingCartIcon
                    fontSize="large"
                    aria-hidden="false"
                    aria-label="Shopping cart"
                  />
                </Badge>
              </IconButton>
            </Box>

            <CheckoutPage />
          </Drawer>
        </Hidden>
        </Box>

        <Box  position= 'absolute' left='40%' top='50%' hidden = {!(store.isCheckoutLogin) || (auth.isAuth)} >
          <AdminLogin/> 
          </Box> 

          <Box  position= 'absolute' left='40%' top='50%' hidden = {!(store.isCheckoutSignUp) || (auth.isAuth)} >
         <Signup/> 
        </Box> 
        <Footer/>
      </ProdSelectContext.Provider>
    </Box>
  );
};

export default ProductSelectionPage;
