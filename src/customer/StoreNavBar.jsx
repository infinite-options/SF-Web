import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
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
import { Pointer } from 'highcharts';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'white',
    marginBottom: '20px',
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

  var itemsAmount = store.cartTotal;

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

  return (
    <div className={classes.root}>
      <AppBar
        color="white"
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
              width="50"
              height="50"
              src="./logos/sf logo_without text.png"
              alt="logo"
              onClick={Logoclick}
              style={{ cursor: 'pointer' }}
            />
          </Box>
          <MenuNavButton />
          <Box flexGrow={1}></Box>
          <IconButton edge="end" className="link">
            <StorefrontIcon
              fontSize="large"
              color={props.storePage === 0 ? 'primary' : 'default'}
              onClick={handleStoreClick}
              aria-hidden="false"
              aria-label = 'Shop Search'
            />
          </IconButton>
          <IconButton edge="end" className="link">
            <Badge badgeContent={itemsAmount} color="primary">
              <ShoppingCartIcon
                fontSize="large"
                key={props.storePage || ''}
                color={props.storePage === 1 ? 'primary' : 'default'}
                onClick={handleCartClick}
                aria-hidden="false"
                aria-label = 'Shopping cart'
              />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
