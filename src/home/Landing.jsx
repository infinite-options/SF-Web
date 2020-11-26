import React, { useState } from 'react';

import { Box, Button, TextField, InputAdornment } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Background from '../welcome-bg.png';

import LandingNavBar from './LandingNavBar';
import AdminLogin from '../admin/AdminLogin';
import Signup from '../customer/auth/Signup';
import appColors from '../styles/AppColors';

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

//TODO: get long and lat for guest with find local produce
const Landing = ({ ...props }) => {
  const classes = useStyles();

  // Toggles for the login and signup box to be passed in as props to the Landing Nav Bar
  const [isLoginShown, setIsLoginShown] = useState(false); // checks if user is logged in
  const [isSignUpShown, setIsSignUpShown] = useState(false);

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
          <Box display="flex" justifyContent="center">
            <CssTextField
              className={classes.margin}
              id="input-with-icon-textfield"
              size="small"
              placeholder="Enter Delivery Location"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon color="secondary" />
                  </InputAdornment>
                ),
              }}
              style={{ width: '290px' }}
            />
            <Box ml={1} />
            <Button
              size="small"
              variant="contained"
              color="secondary"
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
