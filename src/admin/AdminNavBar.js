import React, { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { AdminFarmContext } from './AdminFarmContext';
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
  },
  button: {
    marginRight: theme.spacing(1),
  },
  rightButtons: {
    position: 'absolute',
    right: '10px',
  },
  farmSelect: {
    marginRight: theme.spacing(2),
  },
}));

function AdminNavBar({ tab, setTab, ...props }) {
  const {
    farmID,
    farmList,
    setFarmList,
    handleChangeFarm,
    farmDict,
  } = useContext(AdminFarmContext);

  const [defaultFarm, setDefaultFarm] = useState(
    farmList.includes(localStorage.getItem('farmID'))
      ? localStorage.getItem('farmID')
      : 'all'
  );

  useEffect(() => {
    setDefaultFarm(
      farmList.includes(localStorage.getItem('farmID'))
        ? localStorage.getItem('farmID')
        : 'all'
    );
  }, [farmList]);

  const Auth = useContext(AuthContext);
  useEffect(() => {
    // axios
    //   .get(process.env.REACT_APP_SERVER_BASE_URI + 'all_businesses')
    //   .then((res) => {
    //     console.log(res);
    //     setFarmList(res.data.result);
    //   })
    //   .catch((err) => {
    //     if (err.response) {
    //       console.log(err.response);
    //     }
    //     console.log(err);
    //   });
  }, []);

  //when admin logs out, remove their login info from cookies
  const handleClickLogOut = () => {
    localStorage.removeItem('currentStorePage');
    localStorage.removeItem('cartTotal');
    localStorage.removeItem('cartItems');
    Cookies.remove('login-session');
    Cookies.remove('customer_uid');

    Auth.setIsAuth(false);
    Auth.setAuthLevel(0);
    props.history.push('/');
  };

  const handleLogoClick = (event) => {
    console.log(event.target.value);
    // props.history.push('/store');
  };

  const classes = useStyles();

  const businessList = () => {
    if (Auth.authLevel >= 2) {
      // Complete business list for admin roles

      return (
        <Select
          defaultValue={'all'}
          className={classes.farmSelect}
          onChange={handleChangeFarm}
        >
          <MenuItem value={'all'}>All</MenuItem>
          );
          {farmList.map((item, index) => {
            return (
              <MenuItem key={index} value={item.business_uid}>
                {item.business_name}
              </MenuItem>
            );
          })}
        </Select>
      );
    }

    let ownedFarm = farmList.filter((farm) => farm.business_uid === farmID);

    if (ownedFarm.length > 0) {
      ownedFarm = ownedFarm[0];
      return (
        <Button size={'small'} className={classes.button}>
          {ownedFarm.business_name}
        </Button>
      );
    }
    return null;
  };

  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
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
              width="98%"
              position="absolute"
              display="flex"
              justifyContent="center"
            >
              <img
                width="50"
                height="50"
                src="./logos/sf logo_without text.png"
                alt="logo"
                onClick={() => setTab(6)}
                style={{ cursor: 'pointer' }}
              />
            </Box>
            {Auth.authLevel >= 1 && (
              <React.Fragment>
                {Auth.authLevel === 1 && (
                  <Box fontWeight="bold" mt={-0.5}>
                    {farmDict[farmID]}
                  </Box>
                )}
                {businessList()}
                <Button
                  size={'small'}
                  className={classes.button}
                  onClick={() => setTab(0)}
                  style={{
                    backgroundColor:
                      tab === 0 ? appColors.componentBg : 'white',
                  }}
                >
                  Home
                </Button>
                <Button
                  size={'small'}
                  className={classes.button}
                  onClick={() => setTab(1)}
                  style={{
                    backgroundColor:
                      tab === 1 ? appColors.componentBg : 'white',
                  }}
                >
                  Reports
                </Button>
                <Button
                  size={'small'}
                  className={classes.button}
                  onClick={() => setTab(2)}
                  style={{
                    backgroundColor:
                      tab === 2 ? appColors.componentBg : 'white',
                  }}
                >
                  Settings
                </Button>
              </React.Fragment>
            )}
            <div className={classes.rightButtons}>
              {Auth.authLevel >= 2 && (
                <React.Fragment>
                  <Button
                    size={'small'}
                    className={classes.button}
                    onClick={() => setTab(7)}
                    style={{
                      backgroundColor:
                        tab === 7 ? appColors.componentBg : 'white',
                    }}
                  >
                    Zones
                  </Button>
                  <Button
                    size={'small'}
                    className={classes.button}
                    onClick={() => setTab(5)}
                    style={{
                      backgroundColor:
                        tab === 5 ? appColors.componentBg : 'white',
                    }}
                  >
                    Messages
                  </Button>
                  <Button
                    size={'small'}
                    className={classes.button}
                    onClick={() => setTab(3)}
                    style={{
                      backgroundColor:
                        tab === 3 ? appColors.componentBg : 'white',
                    }}
                  >
                    Analytics
                  </Button>
                  <Button
                    size={'small'}
                    className={classes.button}
                    onClick={() => setTab(4)}
                    style={{
                      backgroundColor:
                        tab === 4 ? appColors.componentBg : 'white',
                    }}
                  >
                    Revenue
                  </Button>
                </React.Fragment>
              )}
              <Button size={'small'} onClick={handleClickLogOut}>
                Logout
              </Button>
            </div>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </div>
  );
}

export default withRouter(AdminNavBar);
