import React, { useContext } from 'react';
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

export default function DeliveryInfoTab() {
  const classes = useStyles();
  const Auth = useContext(AuthContext);

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

  const PlainTextField = (label) => {
    return (
      <Box mb={1}>
        <CssTextField label={label} variant="outlined" size="small" fullWidth />
      </Box>
    );
  };

  return (
    <Paper className={classes.root}>
      <form onSubmit={onSubmit}>
        {PlainTextField('Email')}
        {PlainTextField('Enter Password')}
        {PlainTextField('Confirm Password')}
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
        {PlainTextField('First Name')}
        {PlainTextField('Last Name')}
        {PlainTextField('Phone Number')}
        <Box display="flex" mb={1}>
          <CssTextField
            label="Street Address"
            variant="outlined"
            size="small"
            fullWidth
          />
          <Box ml={1} width="40%">
            <CssTextField
              label="Apt Number"
              variant="outlined"
              size="small"
              fullWidth
            />
          </Box>
        </Box>
        <Box display="flex" mb={1}>
          <Box width="33.3%">
            <CssTextField
              label="City"
              variant="outlined"
              size="small"
              fullWidth
            />
          </Box>
          <Box width="33.3%" mx={1}>
            <CssTextField
              label="State"
              variant="outlined"
              size="small"
              fullWidth
            />
          </Box>
          <Box width="33.3%">
            <CssTextField
              label="Zip Code"
              variant="outlined"
              size="small"
              fullWidth
            />
          </Box>
        </Box>
        {PlainTextField('Delivery Instructions')}
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
        {Auth.isAuth ? <></> : <></>}
      </form>
    </Paper>
  );
}
