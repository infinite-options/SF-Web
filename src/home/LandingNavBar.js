import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import StorefrontIcon from '@material-ui/icons/Storefront';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Box, Button, IconButton, Badge } from '@material-ui/core';

import appColors from 'styles/AppColors';
import MenuNavButton from '../utils/MenuNavButton';
import { AuthContext } from '../auth/AuthContext';

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

export default function LandingNavBar({ ...props }) {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const history = useHistory();

  const badgeContent = parseInt(localStorage.getItem('cartTotal') || '0');
  console.log('badgeContent: ' + badgeContent);

  const loginClicked = () => {
    props.setIsSignUpShown(false);
    props.setIsLoginShown(!props.isLoginShown);
  };

  const signUpClicked = () => {
    props.setIsLoginShown(false);
    props.setIsSignUpShown(!props.isSignUpShown);
  };

  function handleStoreClick() {
    localStorage.setItem('currentStorePage', 1);
    history.push('/store');
  }
  function handleCartClick() {
    localStorage.setItem('currentStorePage', 0);
    history.push('/store');
  }

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
          <MenuNavButton />
          <Box flexGrow={1} />
          <Box hidden={auth.isAuth}>
            <Button
              className={classes.authButton}
              variant="contained"
              size="small"
              color="primary"
              onClick={signUpClicked}
            >
              Sign Up
            </Button>
            <Button
              className={classes.authButton}
              variant="contained"
              size="small"
              color="secondary"
              onClick={loginClicked}
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
}
