import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

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

  const handleCartClick = () => {
    props.setStorePage(props.storePage === 1 ? 0 : 1);
  };

  const Logoclick = () => {
    window.location.href = `${window.location.origin.toString()}/`;
  };

  const loginClicked = () => {
    props.setIsSignUpShown(false);
    props.setIsLoginShown(!props.isLoginShown);
  };

  const signUpClicked = () => {
    props.setIsLoginShown(false);
    props.setIsSignUpShown(!props.isSignUpShown);
  };

  return (
    <div className={classes.root}>
      <AppBar
        color="white"
        position="static"
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
          {/* <Box hidden={useContext(AuthContext).isAuth} display="flex">
            <Button
              className={classes.authButton}
              variant="contained"
              size="small"
              color="primary"
              onClick={signUpClicked}
            >
              Sign Up
            </Button>
            <Box ml={1} />
            <Button
              className={classes.authButton}
              variant="contained"
              size="small"
              color="secondary"
              onClick={loginClicked}
            >
              Login
            </Button>
          </Box> */}
          <IconButton edge="end" className="link">
            <Badge badgeContent={itemsAmount} color="primary">
              <ShoppingCartIcon
                fontSize="large"
                key={props.storePage || ''}
                color={props.storePage === 1 ? 'primary' : 'default'}
                onClick={handleCartClick}
              />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
