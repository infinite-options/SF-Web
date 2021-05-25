import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import StorefrontIcon from '@material-ui/icons/Storefront';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import storeContext from './storeContext';
import { Box, Badge, IconButton, Button } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import appColors from 'styles/AppColors';
import MenuNavButton from '../utils/MenuNavButton';
import { AuthContext } from 'auth/AuthContext';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import { Pointer } from 'highcharts';
import appColor from '../styles/AppColors';

import useWindowsDimensions from './WindowDimensions';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  authButton: {
    color: 'white',
    marginRight: '10px',
  },
}));

//TODO: default to payment information
export default function StoreNavBar(props) {
  const classes = useStyles();
  const store = useContext(storeContext);
  const auth = useContext(AuthContext);
  const history = useHistory();

  const [userInfo, setUserInfo] = useState(store.profile);

  const { setCheckingOut } = useContext(storeContext);
  const { width } = useWindowsDimensions();

  var itemsAmount = store.cartTotal;

  useEffect(() => {

  }, [userInfo]);

  useEffect(() => {
    if (store.profile !== {}) {
      setUserInfo(store.profile);
    }
  }, [store.profile]);

  function handleStoreClick() {
    if (props.storePage === 1) props.setStorePage(0);
  }
  const handleCartClick = () => {
    if (props.storePage === 0) props.setStorePage(1);
    store.setCartClicked((prev) => {
      return prev + 1;
    });
  };

  const Logoclick = () => {
    window.location.href = `${window.location.origin.toString()}/`;
  };

  const handleClickLogOut = () => {
    localStorage.removeItem('currentStorePage');
    localStorage.removeItem('cartTotal');
    localStorage.removeItem('cartItems');
    Cookies.remove('login-session');
    Cookies.remove('customer_uid');

    auth.setIsAuth(false);
    auth.setAuthLevel(0);
    history.push('/');
  };
  return (
    <div className={classes.root}>
      <AppBar
        color="secondary"
        position="static"
        //position="fixed" // sticky nav
        elevation={0}
        style={{
          borderBottom: '1px solid ' + appColors.secondary,
        }}
      >
        <Toolbar>
          <Box
            display="flex"
            width="98%"
            position="absolute"
            justifyContent="center"
          >
            <img
              width="75"
              height="50"
              src="./logos/sf logo_whiteBackground.png"
              alt="logo"
              onClick={Logoclick}
              style={{ cursor: 'pointer' }}
            />
          </Box>
          <MenuNavButton />
          <Box flexGrow={1}></Box>

          {/* <IconButton edge="end" className="link">
            <StorefrontIcon
              fontSize="large"
              color={props.storePage === 0 ? 'primary' : 'default'}
              onClick={handleStoreClick}
              aria-hidden="false"
              aria-label = 'Shop Search'
            />
          </IconButton> */}

          <Box>
            <Box display="flex">
              <Box >
                <p> {userInfo.firstName} </p>
              </Box>
              <Box hidden={!auth.isAuth}>
                <Button
                  className={classes.authButton}
                  variant="contained"
                  size="small"
                  color="primary"
                  style={{
                    marginLeft: '2rem',
                    height: '2rem',
                    marginTop: '0.75rem',
                  }}
                  onClick={handleClickLogOut}
                >
                  Log Out
                </Button>
              </Box>
            </Box>
            {/* <Box hidden={auth.isAuth}>
              <Button
                className={classes.authButton}
                variant="contained"
                size="small"
                color="primary"
                //  onClick={signUpClicked}
              >
                Sign Up
              </Button>
              <Button
                style={{ marginLeft: '1rem' }}
                className={classes.authButton}
                variant="contained"
                size="small"
                color="primary"
                //  onClick={loginClicked}
              >
                Login
              </Button>
            </Box> */}
          </Box>
          <Box hidden = {store.orderConfirmation}>
          <IconButton
            edge="end"
            className="link"
            onClick={() => {
              if (width < 1280) {
                setCheckingOut(true);
              }
            }}
          >
            <Badge badgeContent={itemsAmount} color="primary">
              <ShoppingCartOutlinedIcon
                fontSize="large"
                key={props.storePage || ''}
                aria-hidden="false"
                aria-label="Shopping cart"
                style={{ color: 'white' }}
              />
            </Badge>
          </IconButton>
          </Box>

          <Box hidden = {!store.orderConfirmation}>
          <IconButton
            edge="end"
            className="link"
            onClick={() => {
              store.setOrderConfirmation(!store.orderConfirmation)
            }}
          >
            <Badge badgeContent={itemsAmount} color="primary">
              <StorefrontIcon
                fontSize="large"
                key={props.storePage || ''}
                aria-hidden="false"
                aria-label="Shopping cart"
                style={{ color: 'white' }}
              />
            </Badge>
          </IconButton>

          </Box>
          

          {/* <IconButton edge="end" className="link">
            <StorefrontIcon
              fontSize="large"
              color={props.storePage === 0 ? 'primary' : 'default'}
              onClick={handleStoreClick}
              aria-hidden="false"
              aria-label = 'Shop Search'
            />
          </IconButton>
          <IconButton edge="end" className="link" onClick = {() => {
              if (width < 1280) {
                setCheckingOut(true)
              }
            }
          }>
            <Badge badgeContent={itemsAmount} color="primary">
              <ShoppingCartIcon
                fontSize="large"
                key={props.storePage || ''}
                aria-hidden="false"
                aria-label = 'Shopping cart'
              />
            </Badge>
          </IconButton> */}
        </Toolbar>
      </AppBar>
    </div>
  );
}
