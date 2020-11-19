import React, { useContext, useEffect } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Paper, Box, TextField, Switch, Button } from '@material-ui/core';
import appColors from '../../../styles/AppColors';
import Signup from '../../auth/Signup';
import { AuthContext } from '../../../auth/AuthContext';

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

export default function DeliveryInfoTab({ ...props }) {
  const classes = useStyles();
  const Auth = useContext(AuthContext);

  const [userInfo, setUserInfo] = React.useState({});
  console.log('userInfo: ', userInfo);

  useEffect(() => {
    setUserInfo({
      email: props.profile.customer_email,
      firstName: props.profile.customer_first_name,
      lastName: props.profile.customer_last_name,
      phoneNum: props.profile.customer_phone_num,
      address: props.profile.customer_address,
      unit: props.profile.customer_unit,
      city: props.profile.customer_city,
      state: props.profile.customer_state,
      zip: props.profile.customer_zip,
    });
  }, [props.profile]);

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
    var newInfo = {};
    console.log('event.target.name :', event.target.name);
    switch (event.target.name) {
      case 'email':
        newInfo = { ...userInfo, email: event.target.value };
        break;
      case 'firstName':
        newInfo = { ...userInfo, firstName: event.target.value };
        break;
      case 'lastName':
        newInfo = { ...userInfo, lastName: event.target.value };
        break;
      case 'phoneNum':
        newInfo = { ...userInfo, phoneNum: event.target.value };
        break;
      case 'address':
        newInfo = { ...userInfo, address: event.target.value };
        break;
      case 'unit':
        newInfo = { ...userInfo, unit: event.target.value };
        break;
      case 'city':
        newInfo = { ...userInfo, city: event.target.value };
        break;
      case 'street':
        newInfo = { ...userInfo, street: event.target.value };
        break;
      case 'zip':
        newInfo = { ...userInfo, zip: event.target.value };
        break;
      default:
        newInfo = userInfo;
    }
    setUserInfo(newInfo);
  };

  const PlainTextField = (props) => {
    return (
      <Box mb={1}>
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

  return (
    <Paper className={classes.root}>
      <form onSubmit={onSubmit}>{Auth.isAuth ? authFields() : <></>}</form>
    </Paper>
  );
}
