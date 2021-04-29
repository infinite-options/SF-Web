import React, { useState, useContext } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { useHistory } from 'react-router-dom';
import { Visible, Hidden } from 'react-grid-system';
import {
  Box,
  Button,
  InputAdornment,
  FormHelperText,
  Collapse,
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import appColors from '../styles/AppColors';
import CssTextField from '../utils/CssTextField';
import FindLongLatWithAddr from '../utils/FindLongLatWithAddr';
import { AuthContext } from '../auth/AuthContext';
import { TrendingUpRounded } from '@material-ui/icons';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import BusiApiReqs from '../utils/BusiApiReqs';
import ProductDisplay from './ProductDisplay';
let modalProp=true;
let modalSample="";
const BusiMethods = new BusiApiReqs();
const useStyles = makeStyles((theme) => ({
  authModal: {
    position: 'absolute',
    width: '500px',
  },
  infoSection: {
    width: '33.33%',
    justifyContent: 'center',
    fontSize: '20px',
  },
  infoImg: {
    //: 'flex-end',
    alignItems: 'center',
    height: '150px',
  },
}));

const DeliveryLocationSearch = (props) => {
  const [address, setAddress] = React.useState("");
const [coordinates, setCoordinates] = React.useState({
  lat: null,
  lng: null
});
  // const classes = useStyles();
  const history = useHistory();
  const auth = useContext(AuthContext);

  // // For Guest Procedure
  // const [deliverylocation, setDeliverylocation] = useState('');
  // const [errorValue, setError] = useState('');
  // const [errorMessage, setErrorMessage] = useState('');

  // function createError(message) {
  //   setError('Invalid Input');
  //   setErrorMessage(message);
  // }
  // const onFieldChange = (event) => {
  //   const { value } = event.target;
  //   setDeliverylocation(value);
  // };
  // const onFindProduceClicked = () => {
  //   const formatMessage =
  //     'Please use the following format: Address, City, State Zipcode';
  //   const locationProps = deliverylocation.split(',');
  //   if (locationProps.length !== 3) {
  //     createError(formatMessage);
  //     return;
  //   }
  //   const stateZip = locationProps[2].trim().split(' ');
  //   if (stateZip.length !== 2) {
  //     createError(formatMessage);
  //     return;
  //   }
  //   setError('');
  //   setErrorMessage('');

  //   // DONE: Save for guest checkout
  //   let address = locationProps[0].trim();
  //   let city = locationProps[1].trim();
  //   let state = stateZip[0].trim();
  //   let zip = stateZip[1].trim();

  //   FindLongLatWithAddr(address, city, state, zip).then((res) => {
  //     console.log('res: ', res);
  //     if (res.status === 'found') {
  //       const guestProfile = {
  //         longitude: res.longitude.toString(),
  //         latitude: res.latitude.toString(),
  //         address: address,
  //         city: city,
  //         state: state,
  //         zip: zip,
  //       };
  //       localStorage.setItem('guestProfile', JSON.stringify(guestProfile));
  //       auth.setIsGuest(true);
  //       history.push('/store');
  //     } else {
  //       createError('Sorry, we could not find this location');
  //     }
  //   });
  const handleSelect = async value => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latLng);
  };

  const searchAddress= async()=>{
    const res= await BusiMethods.getLocationBusinessIds(coordinates.lng,coordinates.lat);
    const guestProfile = {
              longitude: coordinates.lng,
              latitude: coordinates.lat,
              // address: address,
              // city: city,
              // state: state,
              // zip: zip,
            };
    modalProp=(!(res.result.length));
    console.log(modalProp)
    if(modalProp){
      prompt("OOPS! We don't deliver at your location, Please enter your email address");
    }
    else{
      alert("We deliver at your location");
      localStorage.setItem('guestProfile', JSON.stringify(guestProfile));
        auth.setIsGuest(true);
        history.push('/store');
    }
    console.log(modalSample)

  }

  return (
    <div style={{backgroundColor:'orange',height:'auto'}}>
    <div style={{width:'49%',float:'left',border:'1px solid blue'}}>
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
          

            <input style={{width:'300px',marginLeft:'auto',marginRight:'auto', display: 'block',height:'40px'}}{...getInputProps({ placeholder: "Search for your address" })} />

            
              {loading ? <div>...loading</div> : null}

              {suggestions.map(suggestion => {
                const style = {
                  
                  backgroundColor: suggestion.active ? "rgb(54,97,102)" : "rgb(226,234,236)",
                  width: suggestion.active ? "300px" : "300px",
                  marginLeft:suggestion.active ? "auto" : "auto",
                  marginRight:suggestion.active ? "auto" : "auto",
                  height: suggestion.active ? "40px" : "40px"
                  // float:suggestion.active ? 'right':'right'

                };

                return (
                  <div {...getSuggestionItemProps(suggestion, { style })}>
                    {suggestion.description}
                  </div>
                );
              })}
            </div>
          
          
        )}
      </PlacesAutocomplete>
      </div>
      <div style={{width:'50%',float:'right',border:'1px solid black'}}>
      <Button
                size="large"
                variant="contained"
                color="secondary"
                onClick={searchAddress}
                style={{
                  width: '300px',
                  textTransform: 'none',
                  float:'left'
                }}
              >
                Find Local Produce
              </Button>
      </div>
      <div>
      {modalSample}
      </div>
    
    </div>
    
    
    
  )
};
export default DeliveryLocationSearch;
