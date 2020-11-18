import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import someContexts from './makeContext';
import { Button, Box, Badge, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import appColors from 'styles/AppColors';
import MenuNavButton from '../utils/MenuNavButton';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'white',
    marginBottom: '20px',
  },
}));

export default function StoreNavBar({ tab, setTab, ...props }) {
  const classes = useStyles();

  const cartContext = useContext(someContexts);
  var itemsAmount = cartContext.cartTotal;

  const handleCartClick = () => {
    props.setStorePage(props.storePage === 1 ? 0 : 1);
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
          <MenuNavButton />
          <Box flexGrow={1}></Box>
          <Box display="flex" flexGrow={1}>
            <img
              width="50"
              height="50"
              src="./logos/sf logo_without text.png"
              alt="logo"
            />
          </Box>
          <IconButton edge="end" className="link" to="/cart">
            <Badge badgeContent={itemsAmount} color="primary">
              <ShoppingCartIcon
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