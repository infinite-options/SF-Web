import React, { useState } from 'react';

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

import LandingNavBar from './LandingNavBar';
import AdminLogin from '../admin/AdminLogin';
import Signup from '../customer/auth/Signup';
import appColors from '../styles/AppColors';
import FindLongLatWithAddr from '../utils/FindLongLatWithAddr';

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: appColors.secondary,
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: appColors.secondary,
      },
    },
  },
})(TextField);

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
}));

//backgroundImage:`url(${Background})`,

//DONE: get long and lat for guest with find local produce
const Landing = ({ ...props }) => {
  const classes = useStyles();

  // Toggles for the login and signup box to be passed in as props to the Landing Nav Bar
  const [isLoginShown, setIsLoginShown] = useState(false); // checks if user is logged in
  const [isSignUpShown, setIsSignUpShown] = useState(false);

  const [deliverylocation, setDeliverylocation] = useState('');
  const [errorValue, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
    const stateZip = locationProps[2].split(' ');
    if (stateZip.length !== 2) {
      createError(
        'Please use the following format: Address, City, State Zipcode'
      );
      return;
    }
    setError('');
    setErrorMessage('');

    // TODO: Save for guest checkout
    let address = locationProps[0];
    let city = locationProps[1];
    let state = stateZip[0];
    let zip = stateZip[1];

    const { status, long, lat } = FindLongLatWithAddr(
      address,
      city,
      state,
      zip
    );

    if (status === 'found') {
    }
  };

  const handleClose = () => {
    console.log('close');
    setIsLoginShown(false);
    setIsSignUpShown(false);
  };

  return (
    <div style={{ backgroundImage: `url(${'./welcome-bg.png'})` }}>
      <LandingNavBar
        isLoginShown={isLoginShown}
        setIsLoginShown={setIsLoginShown}
        isSignUpShown={isSignUpShown}
        setIsSignUpShown={setIsSignUpShown}
      />
      <Box display="flex">
        {/* START: Landing Page Logo */}
        <Box display="flex" width="50%" justifyContent="center">
          <img
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

        {/* START: Login/SignUp Modal */}
        <Box display="flex" justifyContent="flex-end">
          {/* Login Modal */}
          <Box
            position="absolute"
            width="50%"
            display="flex"
            justifyContent="center"
          >
            <Box className={classes.authModal} hidden={!isLoginShown}>
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
            >
              <Box className={classes.authModal} hidden={!isSignUpShown}>
                <Signup />
              </Box>
            </Box>
          </Box>
        </Box>
        {/* END: Login/SignUp Modal */}
      </Box>
    </div>
  );
};

export default Landing;
