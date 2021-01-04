import React, { useState, useEffect } from 'react';
import 'react-multi-carousel/lib/styles.css';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Cookies from 'universal-cookie';
import Nav from './Nav';
import { AdminFarmContext } from './admin/AdminFarmContext';
import { ConfirmationServiceProvider } from './services/ConfirmationService';

import { AuthContext } from './auth/AuthContext';
import axios from 'axios';
import appColors from './styles/AppColors';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

const cookies = new Cookies();

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

/* TODO: 
1. Service Fee and Delivery Fee from Zones endpoint
2. checking accepting hours for dates showing in filter
3. Home page address feature
*/
//TODO: Link Google Analytics
// TODO: change favicon to white background
function App() {
  const theme = createMuiTheme({
    palette: {
      primary: {
        // light: will be calculated from palette.primary.main,
        main: appColors.primary,
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
      secondary: {
        main: appColors.secondary,
        // dark: will be calculated from palette.secondary.main,
      },
      componentBg: {
        main: appColors.componentBg,
        // dark: will be calculated from palette.secondary.main,
      },
      secondary: {
        main: appColors.secondary,
        // dark: will be calculated from palette.secondary.main,
      },
      paragraphText: {
        main: appColors.paragraphText,
        // dark: will be calculated from palette.secondary.main,
      },
    },
  });
  console.log('app started');

  let uid =
    cookies.get('customer_uid') == null ? '' : cookies.get('customer_uid');

  let guesProfile =
    localStorage.getItem('guestProfile') == null
      ? ''
      : localStorage.getItem('guestProfile');

  const [isGuest, setIsGuest] = useState(guesProfile === '' ? false : true); // checks if user is logged in
  const [isAuth, setIsAuth] = useState(uid === '' ? false : true); // checks if user is logged in
  const [accountType, setAccountType] = useState();
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  // IF USER IS LOGGED IN, CHECK THEIR ACCOUNT AUTHORITY:
  // Level  0: Lowest level
  // Level  1: User is logged in & is farmer or higher
  // Level  2: User is logged in & is admin
  const [authLevel, setAuthLevel] = useState();
  const [timeChange, setTimeChange] = useState({});
  const [deliveryTime, setDeliveryTime] = useState({});

  const [tab, setTab] = useState(
    Number(localStorage.getItem('farmerTab')) || 0
  );

  useEffect(() => {
    localStorage.setItem('farmerTab', tab);
  }, [tab]);

  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    axios
      .get(BASE_URL + 'Profile/' + cookies.get('customer_uid'))
      .then((response) => {
        console.log('Account:', response);
        let newAccountType = response.data.result[0].role.toLowerCase();
        if (isMounted)
          setAccountType(response.data.result[0].role ? newAccountType : '');
        // Farmer is now string of businessId
        let newAuthLevel = (() => {
          console.log(newAccountType);
          switch (newAccountType) {
            case 'customer':
              return 0;
            case 'admin':
              return 2;
            default:
              return 1;
          }
        })();
        console.log(newAuthLevel);
        if (isMounted) setAuthLevel(newAuthLevel);
      })
      .catch((err) => {
        console.log(err.response || err);
      });
    return () => {
      isMounted = false;
    };
  }, [isAuth]);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div className="App">
          <ConfirmationServiceProvider>
            <AuthContext.Provider
              value={{
                isGuest,
                setIsGuest,
                isAuth,
                setIsAuth,
                authLevel,
                setAuthLevel,
              }}
            >
              {authLevel >= 1 ? (
                <AdminFarmContext.Provider
                  value={{
                    timeChange,
                    setTimeChange,
                    deliveryTime,
                    setDeliveryTime,
                    tab,
                    setTab,
                  }}
                >
                  <Nav isAuth={isAuth} authLevel={authLevel} />
                </AdminFarmContext.Provider>
              ) : (
                <Nav isAuth={isAuth} authLevel={authLevel} />
              )}
            </AuthContext.Provider>
          </ConfirmationServiceProvider>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
