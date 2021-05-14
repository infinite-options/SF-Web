import React, { useContext } from 'react';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Box, Badge, IconButton, Button } from '@material-ui/core';
import appColors from 'styles/AppColors';
import MenuNavButton from '../../utils/MenuNavButton';
import { AuthContext } from 'auth/AuthContext';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';

import useWindowsDimensions from '../WindowDimensions';

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
export default function ProfileInfoNavBar() {
  const classes = useStyles();
//   const store = useContext(storeContext);
  const auth = useContext(AuthContext);
  const history = useHistory();

  const {profile, cartTotal} = useContext(AuthContext);
  console.warn('IN PROFILE NAVBAR');
  console.warn(profile);

//   const { setCheckingOut } = useContext(storeContext);
  const { width } = useWindowsDimensions();

//   var itemsAmount = store.cartTotal;

//   useEffect(() => {
//     if (profile !== {}) {
//       setProfile(store.profile);
//     }
//   }, [profile]);

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

          <Box>
            <Box display="flex">
              <Box hidden={!auth.isAuth}>
                <p> {`${profile.firstName} ${profile.lastName}`} </p>
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
            <Box hidden={auth.isAuth}>
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
            </Box>
          </Box>
          <IconButton
            edge="end"
            className="link"
            onClick={() => {
              if (width < 1280) {
                // setCheckingOut(true);
              }
            }}
          >
            <Badge badgeContent={cartTotal} color="primary">
              <ShoppingCartOutlinedIcon
                fontSize="large"
                // key={props.storePage || ''}
                aria-hidden="false"
                aria-label="Shopping cart"
                style={{ color: 'white' }}
              />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
