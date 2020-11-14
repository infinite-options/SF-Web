import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import { Box, Button, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import appColors from 'styles/AppColors';

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

export default function LandingNavBar({ ...props }) {
  const classes = useStyles();

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
        style={{
          borderBottom: '1px solid ' + appColors.secondary,
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon color="secondary" />
          </IconButton>
          <Box flexGrow={1} />
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
        </Toolbar>
      </AppBar>
    </div>
  );
}
