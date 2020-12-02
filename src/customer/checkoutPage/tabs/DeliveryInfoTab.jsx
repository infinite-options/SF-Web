import React, {useContext, useState, useEffect} from "react";
import axios from "axios";
import {GoogleMap, LoadScript} from "@react-google-maps/api";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import {Paper, Box, TextField, Switch, Button} from "@material-ui/core";
import appColors from "../../../styles/AppColors";
import Signup from "../../auth/Signup";
import {AuthContext} from "../../../auth/AuthContext";
import StoreContext from "../../storeContext";
import CssTextField from "../../../utils/CssTextField";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    paddingTop: "20px",
    paddingLeft: "50px",
    paddingRight: "50px"
  },
  button: {
    color: appColors.primary,
    width: "300px"
  }
});

//TODO verification: implement update profile
export default function DeliveryInfoTab() {
  const classes = useStyles();
  const Auth = useContext(AuthContext);
  const store = useContext(StoreContext);

  // Setting so that the store context isn't constantly re-rendered
  const [userInfo, setUserInfo] = useState(store.profile);

  useEffect(() => {
    if (store.profile !== {}) {
      setUserInfo(store.profile);
    }
  }, [store.profile]);

  const [map, setMap] = React.useState(null);

  const {setProfile} = store;

  const onSubmit = () => {
    setProfile({...userInfo});
  };

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const onFieldChange = event => {
    const {name, value} = event.target;
    setUserInfo({...userInfo, [name]: value});
  };

  const onCheckAddressClicked = () => {
    console.log("Verifying longitude and latitude from Delivery Info");
    axios
      .get("https://dev.virtualearth.net/REST/v1/Locations/", {
        params: {
          CountryRegion: "US",
          adminDistrict: userInfo.state,
          locality: userInfo.city,
          postalCode: userInfo.zip,
          addressLine: userInfo.address,
          key: process.env.REACT_APP_BING_LOCATION_KEY
        }
      })
      .then(res => {
        // console.log(res)
        let locationApiResult = res.data;
        if (locationApiResult.statusCode === 200) {
          let locations = locationApiResult.resourceSets[0].resources;
          /* Possible improvement: choose better location in case first one not desired
           */
          let location = locations[0];
          let lat = location.geocodePoints[0].coordinates[0];
          let long = location.geocodePoints[0].coordinates[1];
          if (location.geocodePoints.length === 2) {
            lat = location.geocodePoints[1].coordinates[0];
            long = location.geocodePoints[1].coordinates[1];
          }
        }
      });
  };

  const PlainTextField = props => {
    return (
      <Box mb={props.spacing || 1}>
        <CssTextField
          value={props.value}
          name={props.name}
          label={props.label}
          type={props.type}
          variant='outlined'
          size='small'
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
          name: "email",
          label: "Email"
        })}
        {PlainTextField({
          name: "password",
          label: "Password",
          type: "password"
        })}
        {PlainTextField({
          name: "password",
          label: "Password",
          type: "password"
        })}
        <Box
          display='flex'
          my={3}
          px={1.7}
          style={{color: appColors.paragraphText, lineHeight: "30px"}}
        >
          Push Notifications
          <Box flexGrow={1} />
          <Switch />
        </Box>
        {PlainTextField({
          value: userInfo.firstName,
          name: "firstName",
          label: "First Name"
        })}
        {PlainTextField({
          value: userInfo.lastName,
          name: "lastName",
          label: "Last Name"
        })}
        {PlainTextField({
          value: userInfo.phoneNum,
          name: "phoneNum",
          label: "Phone Number"
        })}
        <Box display='flex' mb={1}>
          <CssTextField
            value={userInfo.address}
            name='address'
            label='Street Address'
            variant='outlined'
            size='small'
            fullWidth
            onChange={onFieldChange}
          />
          <Box ml={1} width='40%'>
            <CssTextField
              value={userInfo.unit}
              name='unit'
              label='Apt Number'
              variant='outlined'
              size='small'
              fullWidth
              onChange={onFieldChange}
            />
          </Box>
        </Box>
        <Box display='flex' mb={1}>
          <Box width='33.3%'>
            <CssTextField
              value={userInfo.city}
              name='city'
              label='City'
              variant='outlined'
              size='small'
              fullWidth
              onChange={onFieldChange}
            />
          </Box>
          <Box width='33.3%' mx={1}>
            <CssTextField
              value={userInfo.state}
              name='state'
              label='State'
              variant='outlined'
              size='small'
              fullWidth
              onChange={onFieldChange}
            />
          </Box>
          <Box width='33.3%'>
            <CssTextField
              value={userInfo.zip}
              name='zip'
              label='Zip Code'
              variant='outlined'
              size='small'
              fullWidth
              onChange={onFieldChange}
            />
          </Box>
        </Box>
        {PlainTextField({
          label: "Delivery Instructions",
          name: "deliveryInstructions",
          value: userInfo.deliveryInstructions
        })}
        <Box mt={3}>
          <Button
            className={classes.button}
            variant='outlined'
            size='small'
            color='paragraphText'
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

  const noAuthFields = spacing => {
    return (
      <>
        <Box mb={spacing} color={appColors.paragraphText} fontSize={20}>
          <label> Guest Information</label>
        </Box>
        {PlainTextField({
          value: userInfo.firstName,
          name: "firstName",
          label: "First Name",
          spacing: spacing
        })}
        {PlainTextField({
          value: userInfo.lastName,
          name: "lastName",
          label: "Last Name",
          spacing: spacing
        })}
        {PlainTextField({
          value: userInfo.phoneNum,
          name: "phoneNum",
          label: "Phone Number",
          spacing: spacing
        })}
        {PlainTextField({
          value: userInfo.email,
          name: "email",
          label: "Email",
          spacing: spacing
        })}
        {PlainTextField({label: "Delivery Instructions", spacing: spacing})}
        <Box display='flex' mb={spacing}>
          <CssTextField
            value={userInfo.address}
            name='address'
            label='Street Address'
            variant='outlined'
            size='small'
            fullWidth
            onChange={onFieldChange}
          />
          <Box ml={1} width='40%'>
            <CssTextField
              value={userInfo.unit}
              name='unit'
              label='Apt Number'
              variant='outlined'
              size='small'
              fullWidth
              onChange={onFieldChange}
            />
          </Box>
        </Box>
        <Box display='flex' mb={spacing + 3}>
          <Box width='33.3%'>
            <CssTextField
              value={userInfo.city}
              name='city'
              label='City'
              variant='outlined'
              size='small'
              fullWidth
              onChange={onFieldChange}
            />
          </Box>
          <Box width='33.3%' mx={1}>
            <CssTextField
              value={userInfo.state}
              name='state'
              label='State'
              variant='outlined'
              size='small'
              fullWidth
              onChange={onFieldChange}
            />
          </Box>
          <Box width='33.3%'>
            <CssTextField
              value={userInfo.zip}
              name='zip'
              label='Zip Code'
              variant='outlined'
              size='small'
              fullWidth
              onChange={onFieldChange}
            />
          </Box>
        </Box>
        {PlainTextField({
          name: "password",
          label: "Password",
          type: "password"
        })}
        <Box mt={3}>
          <Button
            className={classes.button}
            variant='outlined'
            size='small'
            color='paragraphText'
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
