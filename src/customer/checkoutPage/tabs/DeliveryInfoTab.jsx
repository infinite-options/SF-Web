import React, { useContext, useEffect } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Paper, Box, TextField, Switch, Button } from '@material-ui/core';
import appColors from '../../../styles/AppColors';
import Signup from '../../auth/Signup';
import { AuthContext } from '../../../auth/AuthContext';
import CheckoutContext from '../CheckoutContext';
import CssTextField from '../../../utils/CssTextField';

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
});

export default function DeliveryInfoTab() {
  const classes = useStyles();
  const Auth = useContext(AuthContext);
  const Checkout = useContext(CheckoutContext);

  const [map, setMap] = React.useState(null);

  const onSubmit = (event) => {};

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const onFieldChange = (event) => {
    const { name, value } = event.target;
    Checkout.setUserInfo({ ...Checkout.userInfo, [name]: value });
  };

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
          value: Checkout.userInfo.email,
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
        {PlainTextField({
          value: Checkout.userInfo.firstName,
          name: 'firstName',
          label: 'First Name',
        })}
        {PlainTextField({
          value: Checkout.userInfo.lastName,
          name: 'lastName',
          label: 'Last Name',
        })}
        {PlainTextField({
          value: Checkout.userInfo.phoneNum,
          name: 'phoneNum',
          label: 'Phone Number',
        })}
        <Box display="flex" mb={1}>
          <CssTextField
            value={Checkout.userInfo.address}
            name="address"
            label="Street Address"
            variant="outlined"
            size="small"
            fullWidth
            onChange={onFieldChange}
          />
          <Box ml={1} width="40%">
            <CssTextField
              value={Checkout.userInfo.unit}
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
              value={Checkout.userInfo.city}
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
              value={Checkout.userInfo.state}
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
              value={Checkout.userInfo.zip}
              name="zip"
              label="Zip Code"
              variant="outlined"
              size="small"
              fullWidth
              onChange={onFieldChange}
            />
          </Box>
        </Box>
        {PlainTextField({ label: 'Delivery Instructions' })}
        <Box mt={3}>
          <Button
            className={classes.button}
            variant="outlined"
            size="small"
            color="paragraphText"
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
          value: Checkout.userInfo.firstName,
          name: 'firstName',
          label: 'First Name',
          spacing: spacing,
        })}
        {PlainTextField({
          value: Checkout.userInfo.lastName,
          name: 'lastName',
          label: 'Last Name',
          spacing: spacing,
        })}
        {PlainTextField({
          value: Checkout.userInfo.phoneNum,
          name: 'phoneNum',
          label: 'Phone Number',
          spacing: spacing,
        })}
        {PlainTextField({
          value: Checkout.userInfo.email,
          name: 'email',
          label: 'Email',
          spacing: spacing,
        })}
        {PlainTextField({ label: 'Delivery Instructions', spacing: spacing })}
        <Box display="flex" mb={spacing}>
          <CssTextField
            value={Checkout.userInfo.address}
            name="address"
            label="Street Address"
            variant="outlined"
            size="small"
            fullWidth
            onChange={onFieldChange}
          />
          <Box ml={1} width="40%">
            <CssTextField
              value={Checkout.userInfo.unit}
              name="unit"
              label="Apt Number"
              variant="outlined"
              size="small"
              fullWidth
              onChange={onFieldChange}
            />
          </Box>
        </Box>
        <Box display="flex" mb={spacing + 3}>
          <Box width="33.3%">
            <CssTextField
              value={Checkout.userInfo.city}
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
              value={Checkout.userInfo.state}
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
              value={Checkout.userInfo.zip}
              name="zip"
              label="Zip Code"
              variant="outlined"
              size="small"
              fullWidth
              onChange={onFieldChange}
            />
          </Box>
        </Box>
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
