import React, { useEffect, useContext } from 'react';
import appColors from '../../../styles/AppColors';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, TextField } from '@material-ui/core';
import storeContext from '../../storeContext';
import MapComponent from '../../MapComponent';
import SocialLogin from '../../../admin/SocialLogin';
import CssTextField from '../../../utils/CssTextField';
import { withStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  labelRoot: {
    fontSize: 20,
    paddingLeft: '20px',
  },
}));

const OrderConfirmation = (props) => {
  const store = useContext(storeContext);
  const classes = useStyles();

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#E0E6E6',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#E0E6E6',
            marginLeft: '5%',
          }}
        >
          <div>
            <h1
              style={{
                textDecoration: 'underline',
                color: appColors.secondary,
              }}
            >
              Order Confirmed
            </h1>
          </div>
          <div style={{ textAlign: 'justify' }}>
            <p> If we have question, we will contact you at</p>
            <p>Your order will be delivered on: {store.expectedDelivery} </p>
            <p>To your address:</p>
            <Box>
              <MapComponent />
            </Box>
          </div>
          <div>
            <h1
              style={{
                textDecoration: 'underline',
                color: appColors.secondary,
              }}
            >
              What to expect
            </h1>
          </div>
          <div style={{ textAlign: 'justify' }}>
            <p>
              {' '}
              If you have ordered with us before, please put out your old box
              out before 9am.
            </p>
          </div>
          <div>
            <h1
              style={{
                textDecoration: 'underline',
                color: appColors.secondary,
              }}
            >
              You are so close to unlocking the full potential of Serving Fresh
            </h1>
          </div>
          <div style={{ textAlign: 'center', alignItems: 'center' }}>
            <p>Sign Up via Social Media</p>
            <SocialLogin />
            <p>
              Or Create a password to make Login easier and keep track of your
              purchases
            </p>
            <Box>
              <CssTextField
                value={props.password}
                onChange={props._passwordChange}
                type="password"
                label="Create Password"
                InputProps={{
                  disableUnderline: true,
                }}
                InputLabelProps={{
                  classes: {
                    root: classes.labelRoot,
                  },
                }}
                margin="normal"
                style={{
                  background: '#FFFFFF 0% 0% no-repeat padding-box',
                  border: '1px solid #00000028',
                  width: '520px',
                  borderRadius: '18px',
                  opacity: 1,
                  marginBottom: '1%',
                }}
              />
            </Box>
            <Box>
              <CssTextField
                value={props.confirmPassword}
                onChange={props._confirmPasswordChange}
                type="password"
                label="Confirm Password"
                InputProps={{ disableUnderline: true }}
                InputLabelProps={{
                  classes: {
                    root: classes.labelRoot,
                  },
                }}
                margin="normal"
                style={{
                  background: '#FFFFFF 0% 0% no-repeat padding-box',
                  border: '1px solid #00000028',
                  width: '520px',
                  borderRadius: '18px',
                  opacity: 1,
                  marginBottom: '5%',
                }}
              />
            </Box>
            <Box>
              <Button
                variant="contained"
                type="submit"
                style={{
                  color: 'white',
                  width: '411px',
                  marginBottom: '5%',
                  background: '#FF8500 0% 0% no-repeat padding-box',
                  borderRadius: '14px',
                  opacity: 1,
                }}
              >
                Submit
              </Button>
            </Box>
            <Box>
              <Button
                href="/"
                variant="contained"
                type="submit"
                style={{
                  color: 'white',
                  width: '411px',
                  marginBottom: '5%',
                  background: '#FF8500 0% 0% no-repeat padding-box',
                  borderRadius: '14px',
                  opacity: 1,
                }}
              >
                Skip and return to Home Page
              </Button>
            </Box>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
