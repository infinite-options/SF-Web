import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  Paper,
  Box,
  TextField,
  Switch,
  Button,
  FormHelperText,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useConfirmation } from '../../../services/ConfirmationService';
import FindLongLatWithAddr from '../../../utils/FindLongLatWithAddr';
import AuthUtils from '../../../utils/AuthUtils';
import BusiApiReqs from '../../../utils/BusiApiReqs';
import appColors from '../../../styles/AppColors';
import Signup from '../../auth/Signup';
import { AuthContext } from '../../../auth/AuthContext';
import StoreContext from '../../storeContext';
import checkoutContext from '../CheckoutContext';
import CssTextField from '../../../utils/CssTextField';
import { mergeClasses } from '@material-ui/styles';
import { Axis } from 'highcharts';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    paddingTop: '20px',
    paddingLeft: '50px',
    paddingRight: '50px',
  },
  button: {
    color: appColors.primary,
    width: '300px',
  },
  notify: {
    fontSize: '18px',
    color: '#fc6f03',
    fontWeight: 'bold',
  },
});

//TODO verification: implement update profile
export default function DeliveryInfoTab() {
  const classes = useStyles();
  const store = useContext(StoreContext);
  const Auth = useContext(AuthContext);
  const history = useHistory();
  const confirm = useConfirmation();
  const AuthMethods = new AuthUtils();
  const BusiApiMethods = new BusiApiReqs();

  // Setting so that the store context isn't constantly re-rendered
  const [userInfo, setUserInfo] = useState(store.profile);
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(true);

  const [locError, setLocError] = useState('');
  const [locErrorMessage, setLocErrorMessage] = useState('');

  function createLocError(message) {
    setLocError('Invalid Input');
    setLocErrorMessage(message);
  }

  const { paymentProcessing, setLeftTabChosen } = useContext(checkoutContext);

  useEffect(() => {
    if (store.profile !== {}) {
      setUserInfo(store.profile);
    }
  }, [store.profile]);

  const [map, setMap] = React.useState(null);

  const { setProfile } = store;

  const onSubmit = () => {
    if (isAddressConfirmed) {
      AuthMethods.updateProfile(userInfo).then((res) => {
        console.log('(res.code === 200): ', res);
        if (res.code === 200) {
          setProfile({ ...userInfo });
        } else {
          setLocErrorMessage(
            'There was an issue updating your profile, please try again later'
          );
        }
      });
    } else {
      createLocError(
        'Your address Had not been validated, please validate before saving changes.'
      );
    }
  };

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  //TODO testing: refresh on farms when address is validated
  const onCheckAddressClicked = () => {
    console.log('Verifying longitude and latitude from Delivery Info');
    FindLongLatWithAddr(
      userInfo.address,
      userInfo.city,
      userInfo.state,
      userInfo.zip
    ).then((res) => {
      if (res.status === 'found') {
        BusiApiMethods.getLocationBusinessIds(res.longitude, res.latitude).then(
          (busiRes) => {
            if (busiRes.result && busiRes.result.length > 0) {
              if (busiRes.result[0].zone === store.profile.zone) {
                updateProfile(false, res.latitude, res.longitude);
              } else {
                confirm({
                  variant: 'danger',
                  catchOnCancel: true,
                  title: 'About to Clear Cart',
                  description:
                    "Thanks for updating your address. Please note if you click 'Yes' your cart will be cleared. Would you like to proceed?",
                })
                  .then(() => {
                    updateProfile(true, res.latitude, res.longitude);
                  })
                  .catch(() => {});
              }
            } else {
              confirm({
                variant: 'danger',
                catchOnCancel: true,
                title: 'Address Notification',
                description:
                  "We're happy to save your address. But please note, we are current not delivering to this address. Would you like to proceed?",
              })
                .then(() => {
                  updateProfile(true, res.latitude, res.longitude);
                })
                .catch(() => {});
            }
          }
        );
      } else {
        createLocError('Sorry, we could not find this Address');
      }
    });
  };

  // 1445 Koch Ln, San Jose, CA 95125
  function updateProfile(isZoneUpdated, lat, long) {
    const _userInfo = { ...userInfo };
    _userInfo.latitude = lat.toString();
    _userInfo.longitude = long.toString();
    setIsAddressConfirmed(true);
    store.setProfile(_userInfo);
    setLocError('');
    setLocErrorMessage('');
    if (isZoneUpdated) {
      localStorage.setItem('isProfileUpdated', store.profile.zone);
      console.log('Zone should be updated');
      store.setFarmsClicked(new Set());
      store.setDayClicked('');
      localStorage.removeItem('selectedDay');
      localStorage.removeItem('cartTotal');
      localStorage.removeItem('cartItems');
    }
  }

  const onFieldChange = (event) => {
    const { name, value } = event.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  useEffect(() => {
    setIsAddressConfirmed(
      userInfo.address === store.profile.address &&
        userInfo.city === store.profile.city &&
        userInfo.zip === store.profile.zip &&
        userInfo.state === store.profile.state
    );
  }, [userInfo]);

  const PlainTextField = (props) => {
    return (
      <Box mb={props.spacing || 1}>
        <CssTextField
          value={props.value}
          name={props.name}
          label={props.label}
          type={props.type}
          variant="outlined"
          size="small"
          fullWidth
          onChange={onFieldChange}
        />
      </Box>
    );
  };

  const authFields = () => {
    return (
      <>
        {PlainTextField({
          value: userInfo.email,
          name: 'email',
          label: 'Email',
        })}
        {PlainTextField({
          name: 'password',
          label: 'Password',
          type: 'password',
        })}
        {PlainTextField({
          name: 'password',
          label: 'Password',
          type: 'password',
        })}
        <Box
          display="flex"
          my={3}
          px={1.7}
          style={{ color: appColors.paragraphText, lineHeight: '30px' }}
        >
          Push Notifications
          <Box flexGrow={1} />
          <Switch />
        </Box>
        {paymentProcessing && (
          <p className={classes.notify}>
            Please Confirm your delivery information below.
          </p>
        )}
        {PlainTextField({
          value: userInfo.firstName,
          name: 'firstName',
          label: 'First Name',
        })}
        {PlainTextField({
          value: userInfo.lastName,
          name: 'lastName',
          label: 'Last Name',
        })}
        {PlainTextField({
          value: userInfo.phoneNum,
          name: 'phoneNum',
          label: 'Phone Number',
        })}
        <Box display="flex" mb={1}>
          <CssTextField
            error={locError}
            value={userInfo.address}
            name="address"
            label="Street Address"
            variant="outlined"
            size="small"
            fullWidth
            onChange={onFieldChange}
          />
          <Box ml={1} width="40%">
            <CssTextField
              error={locError}
              value={userInfo.unit}
              name="unit"
              label="Apt Number"
              variant="outlined"
              size="small"
              fullWidth
              onChange={onFieldChange}
            />
          </Box>
        </Box>
        <Box display="flex" mb={1}>
          <Box width="33.3%">
            <CssTextField
              error={locError}
              value={userInfo.city}
              name="city"
              label="City"
              variant="outlined"
              size="small"
              fullWidth
              onChange={onFieldChange}
            />
          </Box>
          <Box width="33.3%" mx={1}>
            <CssTextField
              error={locError}
              value={userInfo.state}
              name="state"
              label="State"
              variant="outlined"
              size="small"
              fullWidth
              onChange={onFieldChange}
            />
          </Box>
          <Box width="33.3%">
            <CssTextField
              error={locError}
              value={userInfo.zip}
              name="zip"
              label="Zip Code"
              variant="outlined"
              size="small"
              fullWidth
              onChange={onFieldChange}
            />
          </Box>
        </Box>
        <FormHelperText error={true} style={{ textAlign: 'center' }}>
          {locErrorMessage}
        </FormHelperText>
        <Box hidden={isAddressConfirmed} mb={3}>
          <Button
            className={classes.button}
            variant="outlined"
            size="small"
            color="paragraphText"
            onClick={onCheckAddressClicked}
          >
            Verify Address
          </Button>
        </Box>
        <Box mt={3}>
          <Button
            className={classes.button}
            variant="outlined"
            size="small"
            color="paragraphText"
            onClick={onSubmit}
          >
            Save Changes
          </Button>
        </Box>
        {/* <LoadScript googleMapsApiKey={process.env.REACT_APP_BING_LOCATION_KEY}>
          <GoogleMap
            mapContainerStyle={{
              width: '100%',
              height: '200px',
            }}
            center={{
              lat: -3.745,
              lng: -38.523,
            }}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            <></>
          </GoogleMap>
        </LoadScript> */}
      </>
    );
  };

  const noAuthFields = (spacing) => {
    return (
      <>
        <Box mb={spacing} color={appColors.paragraphText} fontSize={20}>
          <label> Guest Information</label>
        </Box>
        {PlainTextField({
          value: userInfo.firstName,
          name: 'firstName',
          label: 'First Name',
          spacing: spacing,
        })}
        {PlainTextField({
          value: userInfo.lastName,
          name: 'lastName',
          label: 'Last Name',
          spacing: spacing,
        })}
        {PlainTextField({
          value: userInfo.phoneNum,
          name: 'phoneNum',
          label: 'Phone Number',
          spacing: spacing,
        })}
        {PlainTextField({
          value: userInfo.email,
          name: 'email',
          label: 'Email',
          spacing: spacing,
        })}
        <Box display="flex" mb={spacing}>
          <CssTextField
            error={locError}
            value={userInfo.address}
            name="address"
            label="Street Address"
            variant="outlined"
            size="small"
            fullWidth
            onChange={onFieldChange}
          />
          <Box ml={1} width="40%">
            <CssTextField
              error={locError}
              value={userInfo.unit}
              name="unit"
              label="Apt Number"
              variant="outlined"
              size="small"
              fullWidth
              onChange={onFieldChange}
            />
          </Box>
        </Box>
        <Box display="flex" mb={spacing}>
          <Box width="33.3%">
            <CssTextField
              error={locError}
              value={userInfo.city}
              name="city"
              label="City"
              variant="outlined"
              size="small"
              fullWidth
              onChange={onFieldChange}
            />
          </Box>
          <Box width="33.3%" mx={1}>
            <CssTextField
              error={locError}
              value={userInfo.state}
              name="state"
              label="State"
              variant="outlined"
              size="small"
              fullWidth
              onChange={onFieldChange}
            />
          </Box>
          <Box width="33.3%">
            <CssTextField
              error={locError}
              value={userInfo.zip}
              name="zip"
              label="Zip Code"
              variant="outlined"
              size="small"
              fullWidth
              onChange={onFieldChange}
            />
          </Box>
        </Box>
        <FormHelperText error={true} style={{ textAlign: 'center' }}>
          {locErrorMessage}
        </FormHelperText>
        <Box hidden={isAddressConfirmed} mb={3}>
          <Button
            className={classes.button}
            variant="outlined"
            size="small"
            color="paragraphText"
            onClick={onCheckAddressClicked}
          >
            Verify Address
          </Button>
        </Box>
        <Box mt={spacing + 3}></Box>
        {PlainTextField({
          name: 'password',
          label: 'Password',
          type: 'password',
        })}
        <Box mt={3}>
          <Button
            className={classes.button}
            variant="outlined"
            size="small"
            color="paragraphText"
          >
            Sign Up
          </Button>
        </Box>
        {/* <LoadScript googleMapsApiKey={process.env.REACT_APP_BING_LOCATION_KEY}>
          <GoogleMap
            mapContainerStyle={{
              width: '100%',
              height: '200px',
            }}
            center={{
              lat: -3.745,
              lng: -38.523,
            }}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            <></>
          </GoogleMap>
        </LoadScript> */}
      </>
    );
  };

  return (
    <Paper className={classes.root}>
      <form onSubmit={onSubmit}>
        {Auth.isAuth ? authFields() : noAuthFields(2)}
      </form>
    </Paper>
  );
}
