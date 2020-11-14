import React, { useContext } from 'react';
import Cookies from 'js-cookie';
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

export default function AdminNavBar({ tab, setTab, ...props }) {
  const { farmID, setFarmID } = useContext(AdminFarmContext);
  const Auth = useContext(AuthContext);
  //when admin logs out, remove their login info from cookies
  const handleClickLogOut = () => {
    Auth.setIsAuth(false);
    Cookies.remove('login-session');
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
                <Select
                  defaultValue={'200-000003'}
                  className={classes.farmSelect}
                  onChange={handleChangeFarm}
                >
                  <MenuItem value={'200-000003'}>Esquivel Farm</MenuItem>
                  <MenuItem value={'200-000004'}>Resendiz Family</MenuItem>
                </Select>
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
