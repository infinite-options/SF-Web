import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import someContexts from './makeContext';

import { Box, Badge, IconButton } from '@material-ui/core';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import appColors from 'styles/AppColors';

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#D3D3D3',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: '#0066ff',
      main: '#0044ff',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffcc00',
    },
  },
});
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

  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <AppBar
          color="white"
          position="static"
          style={{
            borderBottom: '1px solid ' + appColors.secondary,
            boxShadow: 0,
          }}
        >
          <Toolbar>
            <Box display="flex" alignSelf="center">
              <img
                width="50"
                height="50"
                src="./sf logo_without text.png"
                alt="logo"
              />
            </Box>

            <IconButton edge="end" className="link" to="/cart">
              <Badge badgeContent={itemsAmount} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </div>
  );
}
