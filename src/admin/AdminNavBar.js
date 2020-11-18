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
  const { farmID, setFarmID } = useContext(AdminFarmContext);
  const [ farmList, setFarmList ] = useState([])
  const Auth = useContext(AuthContext);

  useEffect(() => {
    axios
    .get('https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/all_businesses')
    .then((res) => {
      console.log(res)
      setFarmList(res.data.result)
    })
    .catch((err) => {
      if(err.response) {
        console.log(err.response)
      }
      console.log(err)
    })
  },[])

  //when admin logs out, remove their login info from cookies
  const handleClickLogOut = () => {
    Auth.setIsAuth(false);
    Cookies.remove('login-session');
    Cookies.remove('customer_uid');
    props.history.push('/');
  };

  const handleChangeFarm = (event) => {
    console.log(event.target.value);
    setFarmID(event.target.value);
  };

  const handleLogoClick = (event) => {
    console.log(event.target.value);
    // props.history.push('/store');
  };

  const classes = useStyles();

  const businessList = () => {
    return (
      <Select
        defaultValue={'200-000004'}
        className={classes.farmSelect}
        onChange={handleChangeFarm}
      >
        {farmList.map((item) => {
            return (
              <MenuItem
                key={item.business_uid}
                value={item.business_uid}
              > 
                {item.business_name}
              </MenuItem>
            )
        })}
      </Select>
    )
  }

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
                {businessList()}
                <Button
                  size={'small'}
                  className={classes.button}
                  onClick={() => setTab(0)}
                >
                  Home
                </Button>
                <Button
                  size={'small'}
                  className={classes.button}
                  onClick={() => setTab(1)}
                >
                  Reports
                </Button>
                <Button
                  size={'small'}
                  className={classes.button}
                  onClick={() => setTab(2)}
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
                    onClick={() => setTab(5)}
                  >
                    Messages
                  </Button>
                  <Button
                    size={'small'}
                    className={classes.button}
                    onClick={() => setTab(3)}
                  >
                    Charts
                  </Button>
                  <Button
                    size={'small'}
                    className={classes.button}
                    onClick={() => setTab(4)}
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

export default withRouter(AdminNavBar)
