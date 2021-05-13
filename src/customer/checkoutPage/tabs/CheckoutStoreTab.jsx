import React, { useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useElements, CardElement } from '@stripe/react-stripe-js';
import { GoogleMap, LoadScript,useJsApiLoader } from '@react-google-maps/api';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Box, TextField, Button, Paper, Dialog } from '@material-ui/core';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import AddIcon from '@material-ui/icons/Add';
import appColors from '../../../styles/AppColors';
import CartItem from '../items/cartItem';
import storeContext from '../../storeContext';
import checkoutContext from '../CheckoutContext';
import PaymentTab from '../tabs/PaymentTab'
import PlaceOrder from '../PlaceOrder';
import Coupons from '../items/Coupons';
import MapComponent from '../../MapComponent';
import { AuthContext } from 'auth/AuthContext';
import FindLongLatWithAddr from '../../../utils/FindLongLatWithAddr';
import BusiApiReqs from '../../../utils/BusiApiReqs';
import { useConfirmation } from '../../../services/ConfirmationService';

import PayPal from '../utils/Paypal';
import StripeElement from '../utils/StripeElement';

import DeliveryInfoTab from '../tabs/DeliveryInfoTab';
//import TipImage from '../../../images/TipBackground.svg'
import LocationSearchInput from '../../../utils/LocationSearchInput'


//import SignUp from '../SignUp/SignUp';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  tipButton: { color: appColors.buttonText
    ,backgroundColor:" ",
    "&:hover":{
      backgroundColor:"#ff8500",
    },
  },

  section: {
    borderBottom: '1px solid' + appColors.checkoutSectionBorder,
    marginBottom: '10px',
    paddingBottom: '10px',
  },
  button: { color: appColors.buttonText, 
    marginBottom: '10px' },
  driverTipBox: {
   
    marginBottom: '10px',
    paddingBottom: '10px',

    display: 'flex',
    [theme.breakpoints.only('lg')]: {
      flexDirection: 'column',
      justifyContent:'space-between',
    },
  },

 

  label: {
    color: appColors.paragraphText,
    fontWeight: 300,
    letterSpacing: '0.025em',
  },

  element: {
    display: 'block',
    margin: '10px 0 20px 0',
    padding: '10px 14px',
    fontSize: '1em',
    fontFamily: 'Source Code Pro, monospace',
    boxShadow:
      'rgba(50, 50, 93, 0.14902) 0px 1px 3px, rgba(0, 0, 0, 0.0196078) 0px 1px 0px',
    border: 0,
    outline: 0,
    borderRadius: '4px',
    background: 'white',
},

buttonCheckout: { 
  color: appColors.buttonText,
    width:"20rem",
    backgroundColor:"#ff8500",
 
},

delivInstr: {
  width: '100%',
  minHeight: '2rem',
  maxHeight: '3rem',
  backgroundColor: 'white',
  color: 'black',
  fontSize: '15px',
  border: '1px solid ' + appColors.paragraphText,
  outline: appColors.secondary + ' !important',
  borderRadius: '5px',
  textAlign: 'left',
  fontFamily: 'Arial',
  resize: 'vertical',
},

showButton: {
  color: 'white',
},
notify: {
  fontSize: '18px',
  color: '#fc6f03',
  fontWeight: 'bold',
},

}));

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

function calculateSubTotal(items) {
  var result = 0;

  for (const item of items) {
    result += item.count * item.price;
  }

  return result;
}

function listItem(item) {
  return (
    <>
      <CartItem
        name={item.name}
        unit={item.unit}
        price={item.price}
        count={item.count}
        img={item.img}
        isCountChangeable={true}
        business_uid={item.business_uid}
        id={item.id}
        key={item.item_uid}
      />
    </>
  );
}

const containerStyle = {
  width: '300px',
  height: '200px'
};


// TEST: Order confirmation for completed purchase
// TODO: Get Delivery and service fee from zone
// TODO: Add button to get to tab 4 of left side
export default function CheckoutTab(props) {
  const classes = useStyles();
  const store = useContext(storeContext);
  const auth = useContext(AuthContext);
  const confirm = useConfirmation();
  const BusiApiMethods = new BusiApiReqs();
  const checkout = useContext(checkoutContext);

  
  const {
    loggingIn, setLoggingIn,
    signingUp, setSigningUp,
  } = useContext(storeContext);

  const {
    setPaymentProcessing,
    setLeftTabChosen,
    paymentDetails,
    setPaymentDetails,
    
  } = checkout;
  // Retrieve items from store context

  // cartItems is a dictonary, need to convert it into an array
  const [cartItems, setCartItems] = useState(getItemsCart());

  const [userInfo, setUserInfo] = useState(store.profile);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');

  const [map, setMap] = React.useState(null);

  const [detailsDisplayType, setDetailsDisplayType] = useState(true); 
  const [paymentDisplayType, setPaymentDisplayType] = useState(true); 
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(true);
  const [addressDisplayType, setAddressDisplayType] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [deliveryInstructions, SetDeliveryInstructions] = useState(
    localStorage.getItem('deliveryInstructions') || ''
  ); 

  const [locError, setLocError] = useState('');
  const [locErrorMessage, setLocErrorMessage] = useState('');

  const [paymentType, setPaymentType] = useState('NONE');


  function createLocError(message) {
    setLocError('Invalid Input');
    setLocErrorMessage(message);
  }

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

  useEffect(() => {
    setIsAddressConfirmed(
      userInfo.address === store.profile.address &&
        userInfo.city === store.profile.city &&
        userInfo.zip === store.profile.zip &&
        userInfo.state === store.profile.state
    );
  }, [userInfo]);

  const onFieldChange = (event) => {
    const { name, value } = event.target;
    if (name === 'email' && emailError !== '') {
      setEmailError('');
      setEmailErrorMessage('');
    }
    setUserInfo({ ...userInfo, [name]: value });
  };

  const onFieldGuestChange = (event) => {
    if (errorMessage !== '') resetError();
    const { name, value } = event.target;
    if (value === '') setPaymentType('NONE');
    setGuestInfo({ ...guestInfo, [name]: value });
  };

  function resetError() {
    setFirstNameError('');
    setLastNameError('');
    setPhoneError('');
    setEmailError('');
    setErrorMessage('');
  }

  const SectionContent = (contentProps) => {
    return auth.isAuth ? (
      <Box className={classes.info}>{contentProps.text}</Box>
    ) : (
      <CssTextField
        error={contentProps.error}
        name={contentProps.name}
        size="small"
        variant="standard"
        fullWidth
        onChange={onFieldGuestChange}
        style={{
          marginLeft: '30px',
          height: '18px',
        }}
      />
    );
  };

const PlainTextField = (props) => {
    return (
      <Box mb={props.spacing || 1}>
        <CssTextField
          error={props.error || ''}
          value={props.value}
          name={props.name}
          label={props.label}
          type={props.type}
          disabled={props.disabled}
          variant="outlined"
          size="small"
          fullWidth
          onChange={props.onChange || onFieldChange}
        />
      </Box>
    );
  };

  useEffect(() => {
    if (store.profile !== {}) {
      setUserInfo(store.profile);
    }
  }, [store.profile]);

  //console.log("lat and long",userInfo.latitude)

  useEffect(() => {
    setCartItems(getItemsCart());
  }, [store.cartItems]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBGgoTWGX2mt4Sp8BDZZntpgxW8Cq7Qq90"
  })

  
  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);
  
  //console.log("this is lat and long", userInfo.latitude, userInfo.longitude)
  var days = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ];
  // TODO: Fee based on expected delivery day
  const loadFees = async () => {
    if (store.expectedDelivery !== '') {
      const deliveryDay = store.expectedDelivery.split(',')[0];
      if (store.profile.zone !== '')
        axios
          .get(
            process.env.REACT_APP_SERVER_BASE_URI +
              'get_Fee_Tax/' +
              store.profile.zone +
              ',' +
              deliveryDay.toUpperCase()
          )
          .then((res) => {
            try {
              const deliveryFee =
                (parseFloat(res.data.result.delivery_fee) * 100) / 100;
              const serviceFee =
                (parseFloat(res.data.result.service_fee) * 100) / 100;
              if (deliveryFee !== undefined && serviceFee !== undefined) {
              }
              setOrigDeliveryFee(deliveryFee);
              setOrigServiceFee(serviceFee);
            } catch {}
          })
          .catch((err) => {
            console.log(err);
            setOrigDeliveryFee(5);
            setOrigServiceFee(1.5);
          });
    }
  };

  useMemo(() => {
    loadFees();
  }, [store.profile.zone, store.expectedDelivery]);

  function getItemsCart() {
    var result = [];
    for (const itemId in store.cartItems) {
      result.push(store.cartItems[itemId]);
    }
    return result;
  }

  const [origDeliveryFee, setOrigDeliveryFee] = useState(5);
  const [origServiceFee, setOrigServiceFee] = useState(1.5);

  // DONE: Add service fee
  // DONE: Add Delivery tip
  // DONE: apply promo to subtotal
  // DONE: make taxes not applied to the delivery fee
  const [subtotal, setSubtotal] = useState(calculateSubTotal(cartItems));
  const [promoApplied, setPromoApplied] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(
    cartItems.length > 0 ? origDeliveryFee : 0
  );
  const [serviceFee, setServiceFee] = useState(
    cartItems.length > 0 ? origServiceFee : 0
  );
  const [driverTip, setDriverTip] = useState(2);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(
    subtotal -
      promoApplied +
      deliveryFee +
      serviceFee +
      parseFloat(driverTip !== '' ? driverTip : 0) +
      tax
  );
  useEffect(() => {
    const total =
      subtotal > 0
        ? parseFloat(
            (
              subtotal -
              promoApplied +
              deliveryFee +
              serviceFee +
              tax +
              parseFloat(driverTip !== '' ? driverTip : 0)
            ).toFixed(2)
          )
        : 0;
    setTotal(total);
    setPaymentDetails((prev) => ({
      ...prev,
      discount: promoApplied,
    }));
  }, [subtotal, promoApplied, deliveryFee, driverTip]);

  useEffect(() => {
    setPaymentDetails((prev) => ({
      ...prev,
      amountDue: total,
    }));
  }, [total]);

  useEffect(() => {
    setSubtotal(calculateSubTotal(cartItems));
  }, [cartItems]);

  useEffect(() => {
    setTax(0);
    setServiceFee(subtotal > 0 ? origServiceFee : 0);
    setPaymentDetails((prev) => ({
      ...prev,
      subtotal: subtotal,
    }));
  }, [subtotal]);

  useEffect(() => {
    setPaymentDetails((prev) => ({
      ...prev,
      deliveryFee: deliveryFee,
    }));
  }, [deliveryFee]);

  useEffect(() => {
    setPaymentDetails((prev) => ({
      ...prev,
      serviceFee: serviceFee,
    }));
  }, [serviceFee]);

  useEffect(() => {
    setPaymentDetails((prev) => ({
      ...prev,
      driverTip: parseFloat(driverTip),
    }));
  }, [driverTip]);

  useEffect(() => {
    setPaymentDetails((prev) => ({
      ...prev,
      taxes: tax,
    }));
  }, [tax]);

  function onAddItemsClicked() {
    store.setStorePage(0);
    const items = Object.values(store.cartItems).map((item) => {
      return {
        qty: item.count,
        name: item.name,
        price: item.price,
        item_uid: item.id,
        itm_business_uid: item.business_uid,
      };
    });
    console.log('items: ', items);

   
    
  }


  function handleChangeAddress(){
    setAddressDisplayType(!addressDisplayType)
  }

  const onDeliveryInstructionsChange = (event) => {
    const { value } = event.target;
    SetDeliveryInstructions(value);
    localStorage.setItem('deliveryInstructions', value);
  };

  const {
    guestInfo,
    setGuestInfo,
  } = useContext(checkoutContext);

  const {
    profile,
   
  } = useContext(storeContext);

  async function onPayWithClicked(type) {
    if (paymentDetails.amountDue > 0) {
      // check guest fields to make sure they are not empty
      if (!auth.isAuth) {
        let hasFirstName = true;
        let hasLastName = true;
        let hasPhone = true;
        let hasEmail = true;
        if (guestInfo.firstName === '') {
          setFirstNameError('Empty');
          hasFirstName = false;
        }
        if (guestInfo.lastName === '') {
          setLastNameError('Empty');
          hasLastName = false;
        }
        if (guestInfo.phoneNumber === '') {
          setPhoneError('Empty');
          hasPhone = false;
        }
        if (guestInfo.email === '') {
          setEmailError('Empty');
          hasEmail = false;
        }
        if (!hasFirstName || !hasLastName || !hasPhone || !hasEmail) {
          setErrorMessage(
            'Please provide all contact information to complete purchase'
          );
          return;
        }

        resetError();
        const updatedProfile = { ...profile };
        updatedProfile.firstName = guestInfo.firstName;
        updatedProfile.lastName = guestInfo.lastName;
        updatedProfile.phoneNum = guestInfo.phoneNumber;
        updatedProfile.email = guestInfo.email;
        store.setProfile(updatedProfile);
      }
      setPaymentType(type);
    } else {
      alert('Please add items to your card before processing payment');
    }
  }

  return (
    <Box 
    className="responsive-checkout-tab"
    display="flex" flexDirection="column" 
    // height="90%"
    // px={8}
     >
      {/* START: Expected Delivery */}
      <Box hidden={store.expectedDelivery !== ''} m={2} />
      <Box hidden={store.expectedDelivery === ''}>
        <Box
          className={classes.section}
          display="flex"
          flexDirection="column"
          // lineHeight="100px"
          id="responsiveExpectedDelivery"
        >
          <Box  color={appColors.primary}
            fontSize="18px"
            textAlign="left"
            fontWeight="700"
           >Expected Delivery</Box>
         
          <Box fontSize="14px" fontWeight="bold"  textAlign="left" >
            {store.expectedDelivery}
          </Box>
        </Box>
      </Box>
      {/* END: Expected Delivery */}


      <Box display="flex" justifyContent="space-between" fontWeight="700" fontSize="16px" paddingBottom='1rem'>
            <Box>
            Delivery Address 
            </Box>
            <Box hidden={!(auth.isAuth)}>
            <Button style={{color:"#ff8500" , fontSize:"12px"}}  onClick = {handleChangeAddress}> Change delivery Address </Button>  
            </Box> 
          
      </Box>

      <Box hidden={!(addressDisplayType) || !(auth.isAuth)}>
    
      <Box
          marginBottom="1rem"
          className={classes.info}
          textAlign="Left"
          hidden={
            
            userInfo.address == '' &&
            userInfo.unit == '' &&
            userInfo.city == '' &&
            userInfo.state == '' &&
            userInfo.zip == ''
          }
        >
          {userInfo.address}
          {userInfo.unit === '' ? ' ' : ''}
          {userInfo.unit}, {userInfo.city}, {userInfo.state} {userInfo.zip}
        </Box>
    </Box>  

      
      <Box  hidden={ (addressDisplayType) && (auth.isAuth) }>
      <Box display="flex" mb={1}>
          <CssTextField
          //  error={locError}
            value={userInfo.address}
            name="address"
            label="Street Address"
            variant="outlined"
            size="small"
            fullWidth
            onChange={onFieldChange}
          />
        </Box>
        <Box mb={1}>
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

        <MapComponent
latitude={userInfo.latitude}
longitude={userInfo.longitude}
/>
        </Box>

        <Box>

     
      <Box mb={1} mt={0.5} justifyContent="center">
        <textarea
          value={deliveryInstructions}
          onChange={onDeliveryInstructionsChange}
          className={classes.delivInstr}
          type=" "
          placeholder="Delivery instructions (ex: gate code. leave on porch)"
        />
      </Box>
        </Box>
        {/* <Box mt={spacing + 3} />
        <FormHelperText error={true} style={{ textAlign: 'center' }}>
          {passwordErrorMessage}
        </FormHelperText> */}
        {/* <FormHelperText style={{ textAlign: 'center' }}>
          Minimum eight and maximum thirty-two characters, at least one letter
          and one number:
        </FormHelperText> */}
        {/* <Box mb={0.5} />
        <Box mb={spacing || 1}>
          <CssTextField
            error={passwordError}
            label="Password"
            type="password"
            variant="outlined"
            size="small"
            fullWidth
            onChange={onPasswordChange}
          />
        </Box>
        <Box mb={spacing || 1}>
          <CssTextField
            error={confirmPasswordError}
            name="confirm"
            label="Confirm Password"
            type="password"
            variant="outlined"
            size="small"
            fullWidth
            onChange={onPasswordChange}
          />
        </Box> */}

          {/* <LoadScript googleMapsApiKey={'AIzaSyBGgoTWGX2mt4Sp8BDZZntpgxW8Cq7Qq90'}>
          <GoogleMap
            mapContainerStyle={{
              width: '100%',
              height: '200px',
            }}
            center={{
              lat: userInfo.lat,
              lng: userInfo.long,
            }}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            <></>
          </GoogleMap>
        </LoadScript> */}
          
          {/* <DeliveryInfoTab/> */}



      {/* <Box>
        <input style={{ display:"flex", type:"text", value:"text", width:"100%", height:"2rem"}}  placeholder= "Delivery Instructions (ex: gate code, leave on porch)"
          autoComplete="on" maxLength="100" cols="20" row="5" borderRadius="2rem">
           
          </input>
        </Box> */}
    

      {/* START: Order Items */}
      <Box className={classes.section}>
        <Box display="flex" paddingTop="2rem">
          <Box fontWeight="bold" lineHeight={1.8} fontSize="20px">
            Your Order:
          </Box>
          <Box flexGrow={1} />
          <Button
            className={classes.button}
            size="small"
            variant="contained"
            color="primary"
            onClick={onAddItemsClicked}
            style={{ borderRadius: '24px' }}

          >
            <AddIcon fontSize="small" />
            Add Items
          </Button>
        </Box>

        {/* {cartItems.length > 0 && (
          <Box className={classes.section} display="flex"> */}
            {/* <Box width="130px"></Box> */}
            {/* <Box width="52%" textAlign="left">
              Name
            </Box>
            <Box width="38%" textAlign="center">
              Quantity
            </Box>
            <Box width="10%" textAlign="left">
              Price
            </Box>
          </Box>
        )} */}
        <Box my={1} px={1}>
          {cartItems.map(listItem)}
        </Box>
        
        <Box  display="flex" paddingTop="2rem">
        <Box fontWeight="700" fontSize="22px">
          Subtotal
        </Box>
        <Box flexGrow={1} />
        <Box>${subtotal.toFixed(2)}</Box>
      </Box>

    
     
      <Box flexGrow={1} />
      </Box>
      
     
      {/* <Box flexGrow={1} /> */}
      {/* END: Order Items */}

      {/* START: Coupons */}
      <Coupons
        setDeliveryFee={setDeliveryFee}
        setPromoApplied={setPromoApplied}
        subtotal={subtotal}
        originalDeliveryFee={origDeliveryFee}
        classes={classes}
      />
      {/* END: Coupons */}

      {/* START: Pricing */}
      {/* <Box className={classes.section} display="flex">
        <Box>Subtotal</Box>
        <Box flexGrow={1} />
        <Box>${subtotal.toFixed(2)}</Box>
      </Box> */}
      <Box className={classes.section} display="flex">
        <Box color={appColors.secondary}>Promo Applied</Box>
        <Box flexGrow={1} />
        <Box>-${promoApplied.toFixed(2)}</Box>
      </Box>
      <Box className={classes.section} display="flex">
        <Box>Service Fee</Box>
        <Box flexGrow={1} />
        <Box>${serviceFee.toFixed(2)}</Box>
      </Box>
      <Box className={classes.section} display="flex">
        <Box>Delivery Fee</Box>
        <Box flexGrow={1} />
        <Box>${deliveryFee.toFixed(2)}</Box>
      </Box>

      <Box className={classes.driverTipBox}>
        <Box display="flex" fontWeight="700" marginBottom='1rem' > Driver Tip </Box>
        <Box style={{display:"flex" , justifyContent:'space-between'}}>
          <Button
            className={classes.tipButton}
            size="small"
            variant="outlined"
            color="secondary"
            onClick={() => setDriverTip(0)}
            style={{ borderRadius: '5px', textTransform: 'none', color:"#000000"}}
          >
            No Tip
          </Button>
          <Button
            className={classes.tipButton}
            size="small"
            variant="outlined"
            color="secondary"
            onClick={() => setDriverTip(2) }
            style={{ borderRadius: '5px', color:"#000000",  backgroundColor: "primary"}}
          >
            $2
          </Button>
          <Button
            className={classes.tipButton}
            size="small"
            variant="outlined"
            color="secondary"
            onClick={() => setDriverTip(3)}
            style={{ borderRadius: '5px', color:"#000000"}}
          >
            $3
          </Button>
          <Button
            className={classes.tipButton}
            size="small"
            variant="outlined"
            color="secondary"
            onClick={() => setDriverTip(5)}
            style={{ borderRadius: '5px', color:"#000000" }}
          >
            $5
          </Button>

          <Box width="70px">
          <CurrencyTextField
            
            disabled={true}
            variant="standard"
            modifyValueOnWheel={false}
            value={driverTip}
            currencySymbol="$"
            minimumValue="0"
            outputFormat="string"
            decimalCharacter="."
            digitGroupSeparator=","
            onChange={(event, value) => {
              setDriverTip(value);
            }}
          ></CurrencyTextField>
        
        
        </Box>
          </Box>
          
        
        <Box flexGrow={1} />
   
      </Box>
      {/* <Box className={classes.section} display="flex">
        <Box>Driver Tip (Optional - Click to edit)</Box>
        <Box flexGrow={1} />
        <Box width="70px">
          <CurrencyTextField
            variant="standard"
            modifyValueOnWheel={false}
            value={driverTip}
            currencySymbol="$"
            minimumValue="0"
            outputFormat="string"
            decimalCharacter="."
            digitGroupSeparator=","
            onChange={(event, value) => {
              setDriverTip(value);
            }}
          ></CurrencyTextField>
        </Box>
      </Box> */}
      <Box className={classes.section} display="flex">
        <Box>Taxes</Box>
        <Box flexGrow={1} />
        <Box>${tax.toFixed(2)}</Box>
      </Box>
      <Box className={classes.section} fontWeight="bold" display="flex">
        <Box>Total</Box>
        <Box flexGrow={1} />
        <Box>{total.toFixed(2)}</Box>
      </Box>
      {/* END: Pricing */}
      
      <Box hidden={(auth.isAuth)} style = {{marginBottom:"1rem"}}>
      <Button
          className={classes.buttonCheckout}
          size="small"
          variant="contained"
          color="primary"
          onClick={() => {
         //   setLeftTabChosen(4);
            setDetailsDisplayType(!detailsDisplayType)
          }}
        >
         Proceed as Guest
        </Button>
      
      </Box>  

      <Box hidden={(auth.isAuth)} >
      <p style={{ color: appColors.secondary, fontWeight: 500, fontSize:12 }}>
         Already have an account?
        </p>
      <Button
          className={classes.buttonCheckout}
          size="small"
          variant="contained"
          color="primary"
          onClick={() => {
        //    setLeftTabChosen(4);
            setDetailsDisplayType(!detailsDisplayType)
          }}
        >
         Login
        </Button>
      
      </Box>  


      <Box  hidden={(auth.isAuth)}  style = {{marginBottom:"1rem"}} >
      <p style={{ color: appColors.secondary, fontWeight: 500 , fontSize:12}}>
          Save time and create an account?
        </p>
      <Button
          className={classes.buttonCheckout}
          size="small"
          variant="contained"
          color="primary"
          onClick={() => {
       //     setLeftTabChosen(4);
            setDetailsDisplayType(!detailsDisplayType)
          }}
        >
        SignUp
        </Button>
      
      </Box>  

      {/* <Box  hidden={!(auth.isAuth)} style = {{marginBottom:"1rem"}}>
        <Button
          className={classes.buttonCheckout}
          size="small"
          variant="contained"
          color="primary"
          onClick={() => {
            setLeftTabChosen(4);
            setDetailsDisplayType(!detailsDisplayType)
          }}
        >
          Click to pay with Stripe or PayPal on the Payments Details page
        </Button>
      </Box> */}


      
    <Box hidden = {detailsDisplayType} marginBottom="2rem">
    {/* <PaymentTab/> */}

      <Box marginBottom="1rem">
            {/* <PaymentTab/> */}
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
       //   error: emailError,
          value: userInfo.email,
          name: 'email',
          label: 'Email',
       //   spacing: spacing,
        })}
        {PlainTextField({
          value: userInfo.phoneNum,
          name: 'phoneNum',
          label: 'Phone Number',
        })}

      </Box>
      </Box> 

      <Box hidden={detailsDisplayType && !(auth.isAuth)} mb={3} >
        <Box hidden={paymentType !== 'PAYPAL' && paymentType !== 'NONE'}>
          <Box display="flex" flexDirection="column" px="9%" mb={1}>
            <Button
              className={classes.buttonCheckout}
              size="small"
              variant="contained"
              color="primary"
              onClick={() => onPayWithClicked('STRIPE')}
            >
              Pay with Stripe {paymentType !== 'NONE' ? 'Instead?' : ''}
            </Button>
          </Box>
        </Box>
        <Box hidden={paymentType !== 'STRIPE' && paymentType !== 'NONE'}>
          <Box display="flex" flexDirection="column" px="9%">
            <Button
              className={classes.buttonCheckout}
              size="small"
              variant="contained"
              color="primary"
              onClick={() => onPayWithClicked('PAYPAL')}
            >
              Pay with PayPal {paymentType !== 'NONE' ? 'Instead?' : ''}
            </Button>
          </Box>
        </Box>
      </Box>
      <Box hidden={paymentType !== 'PAYPAL' } marginBottom="2rem">
        <PayPal
          value={paymentDetails.amountDue}
          deliveryInstructions={deliveryInstructions}
        />
      </Box >
      <Box hidden={paymentType !== 'STRIPE'} >
        {paymentType === 'STRIPE' && (
        <StripeElement
          deliveryInstructions={deliveryInstructions}
          setPaymentType={setPaymentType}
          classes={classes}
        />
      )}
      </Box>



  


       
{/* 
        <Box display="flex" my={2} flexDirection="column" px="2%">
        <Button
          className={classes.button}
          size="small"
          variant="contained"
          color="primary"
          onClick={() => {
            setLeftTabChosen(4);
            setPaymentDisplayType(!paymentDisplayType)
          }}
        >
          Click to pay with Stripe or PayPal on the Payments Details page
        </Button>
      </Box> */}
{/* 
      <Box hidden = {paymentDisplayType}>
            <PaymentTab/>
      </Box> */}
    </Box>
    
  );
}
