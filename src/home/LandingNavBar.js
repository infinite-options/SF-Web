import React, { useContext,useState  } from 'react';
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
import sf from '../icon/sfnav.svg';
import AuthUtils from '../utils/AuthUtils';
import BusiApiReqs from '../utils/BusiApiReqs';
import Cookies from 'js-cookie';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#2F787F',
    marginBottom: '0px',
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
  const {profile} = useContext(AuthContext);

  let [customerName,setCustomerName]=useState('');
    const BusiMethods = new BusiApiReqs();
    const AuthMethods = new AuthUtils();
    AuthMethods.getProfile().then(response=>{
      console.log((response.customer_first_name));
      setCustomerName(response.customer_first_name);
    });

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
    <div className={classes.root} style={{backgroundColor:'#2F787F'}}>
      <AppBar
       
        position="static"
        elevation={0}
        style={{
          borderBottom: '1px solid ' + appColors.secondary,
        }}
      >
        

        <Toolbar style={{backgroundColor:'#2F787F'}}>
        
          <MenuNavButton style={{color:'white'}}/>
          
          <Box flexGrow={1} >
            <div style={{float:'center'}}>
            
            <img style={{}} src={sf}></img>
            
            </div>
            </Box>
          
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
              color="primary"
              onClick={loginClicked}
            >
              Login
            </Button>
            
          </Box>
          <Box hidden={!auth.isAuth} style={{width:'18%'}}>

          <div style={{width:'50%',float:'left'}} hidden={(window.width < 1024) ? true : false}>
          <p style={{color:'white'}}>{customerName}</p>
          </div>
            
            <div style={{width:'50%',float:'right'}}>  
            {/* <Button
                  className={classes.authButton}
                  variant="contained"
                  size="small"
                  color="primary"
                  style={{
                    marginLeft: '2rem',
                    height: '2rem',
                    marginTop: '0.5rem',
                    
                  }}
                  onClick={handleClickLogOut}
                >
                  Log Out
                </Button> */}
                <Button
              className={classes.authButton}
              variant="contained"
              size="small"
              color="primary"
              onClick={handleClickLogOut}
              style={{marginTop:'.5rem'}}
            >
              Logout
            </Button>
                </div>
            
          </Box>

          <Box hidden={!(auth.isAuth || auth.isGuest)}>
            {/* <IconButton edge="end" className="link">
              <StorefrontIcon
                  fontSize="large"
                  color={'default'}
                  onClick={handleCartClick}
                  aria-hidden="false"
                  aria-label = 'Go to store'
              />
            </IconButton>
            <IconButton edge="end" className="link">
              <Badge badgeContent={badgeContent} color="primary">
                <ShoppingCartIcon
                  fontSize="large"
                  color={'default'}
                  onClick={handleStoreClick}
                  aria-hidden="false"
                  aria-label = 'Go to shopping cart'
                />
              </Badge>
            </IconButton> */}
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
}
