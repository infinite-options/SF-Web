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
let guestProfile = {
  longitude: '',
  latitude: '',
  address: '',
  city: '',
  state: '',
  zip: '',
}

const Order = (props) => {
  const [address, setAddress] = React.useState("");
const [coordinates, setCoordinates] = React.useState({
  lat: null,
  lng: null
});
const [modalError, setModalErrorMessage] = useState('');
const [modalSuccess, setModalSuccessMessage] = useState('');
  // const classes = useStyles();
  const history = useHistory();
  const auth = useContext(AuthContext);

  // // For Guest Procedure
  // const [deliverylocation, setDeliverylocation] = useState('');
  const [errorValue, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function createError(message) {
    setError('Invalid Input');
    setErrorMessage(message);
  }
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
    let addr=(value.split(','));
    
   
    guestProfile.city=addr[1];
    guestProfile.state=addr[2];
    guestProfile.address=addr[1];
    guestProfile.longitude=coordinates.lng;
    guestProfile.latitude=coordinates.lat;


  };

  const searchAddress= async ()=>{
    if (!(coordinates.lng) ) {
      alert('Please Enter full address')
      return;
    }
    const res= await BusiMethods.getLocationBusinessIds(coordinates.lng,coordinates.lat);
    const formatMessage =
      'Please use the following format: Address, City, State Zipcode';
    // const locationProps = value.split(',');
    // if (locationProps.length !== 3) {
    //   createError(formatMessage);
    //   return;
    // }
    guestProfile = {
      longitude: coordinates.lng,
      latitude: coordinates.lat,
      // address: address,
      // city: city,
      // state: state,
      // zip: zip,
    };
    console.log(guestProfile);
    console.log(res)
    modalProp=(!(res.result.length));
    console.log(modalProp)
    if(modalProp){
      setModalErrorMessage({
        title:"Still Growing…",
        body:'Sorry, it looks like we don’t deliver to your neighborhood yet. Enter your email address and we will let you know as soon as we come to your neighborhood.'});
    }
    else{
      alert("We deliver at your location");
      localStorage.setItem('guestProfile', JSON.stringify(guestProfile));
        auth.setIsGuest(true);
        history.push('/store');
    }
    console.log(modalSample)

  }
  const errorHandleModal=()=>{
    setModalErrorMessage(null);
  }
  return (
    <div style={{backgroundColor:'white',height:'auto',marginTop:'30px',width:'100%',marginBottom:'30px'}}>
      {modalError && <Mymodal title={modalError.title} body={modalError.body} onConfirm={errorHandleModal}></Mymodal>}
      <div style={{marginRight:'auto',marginLeft:'auto'}}><h1 style={{color:'rgb(54,97,102)',float:'center',marginLeft:'auto',marginRight:'auto',marginBottom:'5px',fontSize:'42px',fontWeight:'bold'}}>Ready to Order</h1></div>
      <div style={{marginRight:'auto',marginLeft:'auto'}}><h3 style={{color:'rgb(251,132,0)',float:'center',marginLeft:'auto',marginRight:'auto',marginBottom:'35px',fontSize:'24px'}}>Fresh Organic Produce Delivered</h3></div>
        <div style={{width:'100%',marginLeft:'auto',marginRight:'auto',marginBottom:'25px',marginTop:'30px'}}>
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
                  height: suggestion.active ? "50px" : "50px",
                  border:suggestion.active ? '1px solid black':'1px solid black',
                  color:suggestion.active?'white':'black',

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
      <Button
                size="large"
                variant="contained"
                color="secondary"
                onClick={searchAddress}
                style={{
                  width: '300px',
                  textTransform: 'none',
                  float:'center'
                }}
              >
                Find Local Produce
              </Button>
      <div style={{width:'100%',float:'right',marginLeft:'auto',marginRight:'auto',marginBottom:'25px'}}>
      
      </div>
      <div>
      {modalSample}
      </div>
    
    </div>
    
    
    
  )
};
export default Order;