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
import Mymodal from './Modal';
import SuccessModal from './SuccessModal';
import TextField from '@material-ui/core/TextField';

import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';




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

// let guestProfile={
//   longitude: '',
//   latitude: '',
//   address: '',
//   city: '',
//   state: '',
//   zip: '',
// }
const DeliveryLocationSearch = (props) => {
  const [address, setAddress] = React.useState("");
const [coordinates, setCoordinates] = React.useState({
  lat: null,
  lng: null
});
const [modalError, setModalErrorMessage] = useState('');
const [modalSuccess, setModalSuccessMessage] = useState('');
let guestProfile={};
  const classes = useStyles();
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
   
    // console.log(coordinates.lat,coordinates.lng);
    // const res= await BusiMethods.getLocationBusinessIds(coordinates.lng,coordinates.lat);
    // console.log(!(res.result.length));
    // modalProp=(!(res.result.length));
    // console.log(modalProp);
    // if(modalProp){
    //   setModalErrorMessage({
    //   title:"Still Growing…",
    //   body:'Sorry, it looks like we don’t deliver to your neighborhood yet. Enter your email address and we will let you know as soon as we come to your neighborhood.'});
    // }
    // else{
    //   setModalSuccessMessage({title:"Hooray!",body:'Looks like we deliver to your address. Click the button below to see the variety of fresh organic fruits and vegetables we offer.'});
    //   localStorage.setItem('guestProfile', JSON.stringify(guestProfile));
    //   auth.setIsGuest(true);
    //   history.push('/store');
      
    //   console.log(guestProfile)
    // }

  };

  const searchAddress= async()=>{
    const res= await BusiMethods.getLocationBusinessIds(coordinates.lng,coordinates.lat);
     guestProfile = {
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
      setModalErrorMessage({
      title:"Still Growing…",
      body:'Sorry, it looks like we don’t deliver to your neighborhood yet. Enter your email address and we will let you know as soon as we come to your neighborhood.'});
    }
    else{
      setModalSuccessMessage({title:"Hooray!",body:'Looks like we deliver to your address. Click the button below to see the variety of fresh organic fruits and vegetables we offer.'});
      
      
      console.log(guestProfile)
    }
    console.log(modalSample)

  }

  const login=async ()=>{
    const res= await BusiMethods.getLocationBusinessIds(coordinates.lng,coordinates.lat);
    guestProfile = {
             longitude: coordinates.lng,
             latitude: coordinates.lat,
             // address: address,
             // city: city,
             // state: state,
             // zip: zip,
           };
    localStorage.setItem('guestProfile', JSON.stringify(guestProfile));
      auth.setIsGuest(true);
      history.push('/store');
      //  localStorage.setItem('guestProfile', JSON.stringify(guestProfile));
      //   auth.setIsGuest(true);
      //   history.push('/store');
      console.log(guestProfile)
  }

  const errorHandleModal=()=>{
    setModalErrorMessage(null);
    setModalSuccessMessage(null);
  }


  return (
    <div style={{backgroundColor:'rgb(236,137,51)',height:'auto'}}>
      
    <div style={{width:'49%',float:'left'}}>
    {modalError && <Mymodal title={modalError.title} body={modalError.body} onConfirm={errorHandleModal}></Mymodal>}
    {modalSuccess && <SuccessModal title={modalSuccess.title} body={modalSuccess.body} onConfirm={login} modalClear={errorHandleModal}></SuccessModal>}
     <div style={{ 
          zIndex:'100',position:'absolute',left:'25%',marginRight:'auto',marginLeft:'auto'
              }}>
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
        
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
          

          <CssTextField className={classes.margin}
            id="input-with-icon-textfield"
            size="small"
            placeholder="Search for your address"
            variant="outlined"
            
            InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon
                          style={{color:"rgb(74,124,133)"}}
                          aria-hidden="false"
                          aria-label="Enter delivery location"
                        />
                      </InputAdornment>
                    ),
                  }}{...getInputProps({ placeholder: "Search for your address" })} 
                  style={{
                    width: '300px',
                    border: '2px solid' + appColors.secondary,
                    borderRadius: '5px',
                    
                  }}
                  />

            
              {loading ? <div>...loading</div> : null}

              {suggestions.map(suggestion => {
                const style = {
                  
                  backgroundColor: suggestion.active ? "rgb(54,97,102)" : "rgb(226,234,236)",
                  width: suggestion.active ? "300px" : "300px",
                  marginLeft:suggestion.active ? "auto" : "auto",
                  marginRight:suggestion.active ? "auto" : "auto",
                  height: suggestion.active ? "50px" : "50px",
                  border:suggestion.active ? '1px solid black':'1px solid black',
                  color:suggestion.active?'white':'black',
                  zIndex:suggestion.active?'1000':'1000',
                  position:suggestion.active?'active':'active',
                  left:suggestion.active?'00%':'0%',
                  // float:suggestion.active?'right':'right'
                  
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
      </div>
      <div style={{width:'50%',float:'right'}}>
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
      
      </div>
    
    </div>
    
    
    
  )
};
export default DeliveryLocationSearch;
