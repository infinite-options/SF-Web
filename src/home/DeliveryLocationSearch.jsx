import React, { useState, useContext } from 'react';
// import { Container, Row, Col } from 'react-grid-system';
import { useHistory } from 'react-router-dom';
// import { Visible, Hidden } from 'react-grid-system';
import {
  // Box,
  Button,
  InputAdornment,
  // FormHelperText,
  // Collapse,
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import appColors from '../styles/AppColors';
import CssTextField from '../utils/CssTextField';
// import FindLongLatWithAddr from '../utils/FindLongLatWithAddr';
import { AuthContext } from '../auth/AuthContext';
// import { TrendingUpRounded } from '@material-ui/icons';
import PlacesAutocomplete, {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng
} from "react-places-autocomplete";
import BusiApiReqs from '../utils/BusiApiReqs';

import Mymodal from './Modal';
import SuccessModal from './SuccessModal';
// import TextField from '@material-ui/core/TextField';




// let google1=new google.maps;

let modalProp=true;
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
// const [coordinates, setCoordinates] = React.useState({
//   lat: null,
//   lng: null
// });
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
    // setCoordinates(latLng);
    let addr=value.split(',');
    console.log(results[0].place_id);
    const results1 = await geocodeByPlaceId(results[0].place_id);
    const array_fragment=(results1.[0].address_components);
    const zipCode1 = array_fragment[array_fragment.length - 1];
    const zipCode2 = array_fragment[array_fragment.length - 2];
    console.log(zipCode1,zipCode2);
    console.log(array_fragment);
    
    // const google_pack=new window.google.maps.places.Autocomplete(value);
    // const zipResult= await (google_pack);

    // =await fetch("api.postcodes.io/postcodes?lon="+latLng.lng+"&lat="+latLng.lat,
    // {
    //   "method":"GET"
    // }
    // );
    // console.log(zipResult.getPlace());
    guestProfile = {
                  longitude: latLng.lng,
                  latitude: latLng.lat,
                  address: addr[0],
                  city: addr[1],
                  state: addr[2],
                  zip: (zipCode1.length==5)?zipCode1.long_name:zipCode2.long_name ,
                };
    console.log(latLng);
    const res= await BusiMethods.getLocationBusinessIds(latLng.lng,latLng.lat);
    console.log(res.result);
    console.log(!(res.result.length));
  
    modalProp=(!(res.result.length));
    console.log(modalProp);
    if(modalProp){
      console.log(guestProfile);
      setModalErrorMessage({
      title:"Still Growing…",
      body:'Sorry, it looks like we don’t deliver to your neighborhood yet. Enter your email address and we will let you know as soon as we come to your neighborhood.'});
    }
    else{
      setModalSuccessMessage({title:"Hooray!",body:'Looks like we deliver to your address. Click the button below to see the variety of fresh organic fruits and vegetables we offer.'});
      localStorage.setItem('guestProfile', JSON.stringify(guestProfile));
      auth.setIsGuest(true);
      // history.push('/store');
      
      console.log(guestProfile);
    }

  };

  // const searchAddress= async value=>{
  //   // const results = await geocodeByAddress(value);
  //   // const latLng = await getLatLng(results[0]);
  //   // setAddress(value);
  //   // setCoordinates(latLng);
  //   let addr=this.setAddress;
  //   console.log(addr);

  //   guestProfile = {
  //                 longitude: coordinates.lng,
  //                 latitude: coordinates.lat,
  //   //               address: addr[0],
  //   //               city: addr[1],
  //   //               state: addr[2],
  //   //               zip: "",
  //               };
  //   console.log(setAddress);
  //   const res= await BusiMethods.getLocationBusinessIds(coordinates.lng,coordinates.lat);
  //   console.log(res.result);
  //   console.log(!(res.result.length));
  
  //   modalProp=(!(res.result.length));
  //   console.log(modalProp);
  //   if(modalProp){
  //     console.log(guestProfile);
  //     setModalErrorMessage({
  //     title:"Still Growing…",
  //     body:'Sorry, it looks like we don’t deliver to your neighborhood yet. Enter your email address and we will let you know as soon as we come to your neighborhood.'});
  //   }
  //   else{
  //     setModalSuccessMessage({title:"Hooray!",body:'Looks like we deliver to your address. Click the button below to see the variety of fresh organic fruits and vegetables we offer.'});
  //     localStorage.setItem('guestProfile', JSON.stringify(guestProfile));
  //     auth.setIsGuest(true);
  //     // history.push('/store');
      
  //     console.log(guestProfile);
  //   }
  
  // }
  // }

  const login=async ()=>{
    // const res= await BusiMethods.getLocationBusinessIds(coordinates.lng,coordinates.lat);
    // guestProfile = {
    //          longitude: coordinates.lng,
    //          latitude: coordinates.lat,
    //          // address: address,
    //          // city: city,
    //          // state: state,
    //          // zip: zip,
    //        };
    // localStorage.setItem('guestProfile', JSON.stringify(guestProfile));
      // auth.setIsGuest(true);
      history.push('/store');
      //  localStorage.setItem('guestProfile', JSON.stringify(guestProfile));
      //   auth.setIsGuest(true);
      //   history.push('/store');
      console.log(guestProfile)
  }
  const google = window.google;
  const searchOptions = {
    location: new google.maps.LatLng(37 , -121),
    radius: 15,
    types: ['address']
  }

  const errorHandleModal=()=>{
    setModalErrorMessage(null);
    setModalSuccessMessage(null);
  }


  // const options = {
  //   location: google1.LatLng(-34, 151),
  //   radius: 2000,
  //   types: ['address']
  
  // }
  return (
    <div style={{height:'auto',zIndex:'100',position:'absolute',width:'100%'}}>
      {modalError && <Mymodal title={modalError.title} body={modalError.body} onConfirm={errorHandleModal}></Mymodal>}
   {modalSuccess && <SuccessModal title={modalSuccess.title} body={modalSuccess.body} onConfirm={login} modalClear={errorHandleModal}></SuccessModal>}
    <div style={{width:'50%',float:'left'}}>
    
     <div style={{
                  width: '300px',
                  textTransform: 'none',
                  float:'right',
                  marginRight:'50px'
                }}>
     <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
        style={{}}
        // options={options}
        searchOptions={searchOptions}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
          

          <CssTextField className={classes.margin}
            id="input-with-icon-textfield_top"
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
                  <div  {...getSuggestionItemProps(suggestion, { style })}>
                    {suggestion.description}
                  </div>
                );
              })}
            </div>
          
          
        )}
      </PlacesAutocomplete>





    </div>
      </div>
      <div style={{width:'49%',float:'left'}}>
      <Button
                value={address}
                size="large"
                variant="contained"
                color="secondary"
                onClick={handleSelect}
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






