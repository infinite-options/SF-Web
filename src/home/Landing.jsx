import React, { useContext, useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie';
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  FormHelperText,
} from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Background from '../welcome-bg.png';

import LocationSearchInput from '../utils/LocationSearchInput';
import FindLongLatWithAddr from '../utils/FindLongLatWithAddr';
import CssTextField from '../utils/CssTextField';
import appColors from '../styles/AppColors';
import LandingNavBar from './LandingNavBar';
import AdminLogin from '../admin/AdminLogin';
import Signup from '../customer/auth/Signup';

import { AuthContext } from 'auth/AuthContext';

const cookies = new Cookies();

const styles = {
  paddingTop: '70px',
  paddingBottom: '70px',
  alignItems: 'center',
  backgroundImage: `url(${Background})`,
  maxHeight: 'auto',
  backgroundSize: 'cover',
};

const useStyles = makeStyles((theme) => ({
  authModal: {
    position: 'absolute',
    width: '500px',
  },
  infoSection: {
    width: '33.33%',
    justifyContent: 'center',
  },
  infoImg: {
    alignItems: 'center',
    height: '150px',
  },
  infoTitle: {
    color: appColors.primary,
    marginBottom: '10px',
  },
  infoDesc: {
    paddingLeft: '20%',
    paddingRight: '20%',
    textAlign: 'center',
    color: appColors.paragraphText,
  },
}));

/**
 * Hook that alerts clicks outside of the passed ref
 */
// TODO: click outside works, needs configuration on initial click
function useOutsideAlerter(ref) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        !ref.current.hidden
      ) {
        ref.current.hidden = true;
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

//backgroundImage:`url(${Background})`,

// TODO:  Social login can login direct login only if the email is verified
// TODO:  Add auto address fill
// DONE:  Allow a click out of login to close it
const Landing = ({ ...props }) => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const classes = useStyles();

  // Toggles for the login and signup box to be passed in as props to the Landing Nav Bar
  const [isLoginShown, setIsLoginShown] = useState(false); // checks if user is logged in
  const [isSignUpShown, setIsSignUpShown] = useState(false);

  // For Guest Procedure
  const [deliverylocation, setDeliverylocation] = useState('');
  const [errorValue, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const loginWrapperRef = useRef(null);
  useOutsideAlerter(loginWrapperRef, setIsLoginShown);
  const signupWrapperRef = useRef(null);
  useOutsideAlerter(signupWrapperRef, setIsSignUpShown);

  const onFieldChange = (event) => {
    const { value } = event.target;
    setDeliverylocation(value);
  };

  function createError(message) {
    setError('Invalid Input');
    setErrorMessage(message);
  }

  const onFindProduceClicked = () => {
    const locationProps = deliverylocation.split(',');
    if (locationProps.length !== 3) {
      createError(
        'Please use the following format: Address, City, State Zipcode'
      );
      return;
    }
    const stateZip = locationProps[2].trim().split(' ');
    if (stateZip.length !== 2) {
      createError(
        'Please use the following format: Address, City, State Zipcode'
      );
      return;
    }
    setError('');
    setErrorMessage('');

    // DONE: Save for guest checkout
    let address = locationProps[0];
    let city = locationProps[1];
    let state = stateZip[0];
    let zip = stateZip[1];

    FindLongLatWithAddr(address, city, state, zip).then((res) => {
      console.log('res: ', res);
      if (res.status === 'found') {
        cookies.set('longitude', res.longitude);
        cookies.set('latitude', res.latitude);
        cookies.set('address', address);
        cookies.set('city', city);
        cookies.set('state', state);
        cookies.set('zip', zip);
        history.push('/store');
      } else {
        createError('Sorry, we could not find this location');
      }
    });
  };
  const handleClose = () => {
    console.log('close');
    setIsLoginShown(false);
    setIsSignUpShown(false);
  };

  return (
    <Box
      height={window.innerHeight}
      style={{
        backgroundSize: '1000px',
        backgroundImage: `url(${'transparent-landing-bg.png'})`,
      }}
    >
      <LandingNavBar
        isLoginShown={isLoginShown}
        setIsLoginShown={setIsLoginShown}
        isSignUpShown={isSignUpShown}
        setIsSignUpShown={setIsSignUpShown}
      />
      {/* START: Login/SignUp Modal */}
      <Box display="flex" justifyContent="flex-end">
        {/* Login Modal */}
        <Box
          position="absolute"
          width="50%"
          display="flex"
          justifyContent="center"
          zIndex={40}
        >
          <Box
            ref={loginWrapperRef}
            className={classes.authModal}
            hidden={!isLoginShown}
          >
            <AdminLogin />
          </Box>
        </Box>

        {/* Sign Up Modal */}
        <Box display="flex" justifyContent="flex-end">
          <Box
            position="absolute"
            width="50%"
            display="flex"
            justifyContent="center"
            zIndex={40}
          >
            <Box
              ref={signupWrapperRef}
              className={classes.authModal}
              hidden={!isSignUpShown}
            >
              <Signup />
            </Box>
          </Box>
        </Box>
      </Box>
      {/* END: Login/SignUp Modal */}
      {/* START: landing Logo and Guest Login */}
      <Box display="flex">
        {/* START: Landing Page Logo */}
        <Box display="flex" width="50%" justifyContent="center">
          <img
            alt="logo.png"
            height="300px"
            width="300px"
            src="./logos/logo_transprarent bg.png"
          />
        </Box>
        {/* END: Landing Page Logo */}

        {/* START: Local Produce Search */}
        <Box mt={10} width="50%" justifyContent="center">
          <h4 style={{ color: appColors.secondary }}>
            Local produce delivered to your doorstop
          </h4>
          <Box justifyContent="center">
            {/* <LocationSearchInput /> */}
            <CssTextField
              error={errorValue}
              value={deliverylocation}
              className={classes.margin}
              id="input-with-icon-textfield"
              size="small"
              placeholder="Enter Delivery Location"
              variant="outlined"
              fullWidth
              onChange={onFieldChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon color="secondary" />
                  </InputAdornment>
                ),
              }}
              style={{ width: '500px' }}
            />
            <Box width="100%" justifyContent="center">
              <FormHelperText error={true} style={{ textAlign: 'center' }}>
                {errorMessage}
              </FormHelperText>
            </Box>
          </Box>
          <Box justifyContent="center" mt={2}>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={onFindProduceClicked}
              style={{ width: '200px' }}
            >
              Find Local Produce
            </Button>
          </Box>
        </Box>
        {/* END: Local Produce Search */}
      </Box>

      <Box> </Box>
      <Box display="flex">
        <Box className={classes.infoSection}>
          <Box className={classes.infoImg}>
            <img src="./landing/vegetables_info.png" alt="vegetables info" />
          </Box>
          <div className={classes.infoTitle}>Farm to doorstep</div>
          <div className={classes.infoDesc}>
            We bring fresh produce from local farms right to our consumers'
            doorstep. It's a farmer's market experience at your fingertips
          </div>
        </Box>
        <Box className={classes.infoSection}>
          <Box className={classes.infoImg}>
            <img src="./landing/farmer_info.png" alt="farmer info" />
          </Box>
          <div className={classes.infoTitle}>Farm to doorstep</div>
          <div className={classes.infoDesc}>
            We bring fresh produce from local farms right to our consumers'
            doorstep. It's a farmer's market experience at your fingertips
          </div>
        </Box>
        <Box className={classes.infoSection}>
          <Box className={classes.infoImg}>
            <img src="./landing/student_info.png" alt="student info" />
          </Box>
          <div className={classes.infoTitle}>Farm to doorstep</div>
          <div className={classes.infoDesc}>
            We bring fresh produce from local farms right to our consumers'
            doorstep. It's a farmer's market experience at your fingertips
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default Landing;
