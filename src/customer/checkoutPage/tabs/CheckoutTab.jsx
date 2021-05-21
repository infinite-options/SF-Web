import React, { useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useElements, CardElement } from '@stripe/react-stripe-js';
import { GoogleMap, LoadScript, useJsApiLoader } from '@react-google-maps/api';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Box, TextField, Button, Paper, Dialog } from '@material-ui/core';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import AddIcon from '@material-ui/icons/Add';
import appColors from '../../../styles/AppColors';
import CartItem from '../items/cartItem';
import storeContext from '../../storeContext';
import checkoutContext from '../CheckoutContext';
import PaymentTab from '../tabs/PaymentTab';
import PlaceOrder from '../PlaceOrder';
import Coupons from '../items/Coupons';
import MapComponent from '../../MapComponent';
//import TipImage from '../../../images/TipBackground.svg'
import LocationSearchInput from '../../../utils/LocationSearchInput';

//import SignUp from '../SignUp/SignUp';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  section: {
    borderBottom: '1px solid' + appColors.checkoutSectionBorder,
    marginBottom: '10px',
    paddingBottom: '10px',
  },
  button: { color: appColors.buttonText, marginBottom: '10px' },
  driverTipBox: {
    marginBottom: '10px',
    paddingBottom: '10px',

    display: 'flex',
    [theme.breakpoints.only('lg')]: {
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
  },
  button: {
    color: appColors.buttonText,
    backgroundColor: ' ',
    '&:hover': {
      backgroundColor: '#ff8500',
    },
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

// TEST: Order confirmation for completed purchase
// TODO: Get Delivery and service fee from zone
// TODO: Add button to get to tab 4 of left side
export default function CheckoutTab() {
  const classes = useStyles();
  const store = useContext(storeContext);
  //  const checkout = useContext(checkoutContext);

  const { loggingIn, setLoggingIn, signingUp, setSigningUp } =
    useContext(storeContext);
  const checkout = useContext(checkoutContext);

  const {
    setPaymentProcessing,
    setLeftTabChosen,
    paymentDetails,
    setPaymentDetails,
  } = checkout;
  // Retrieve items from store context

  // cartItems is a dictonary, need to convert it into an array
  const [cartItems, setCartItems] = useState(getItemsCart());
  const [background, setBackground] = useState();

  const [userInfo, setUserInfo] = useState(store.profile);

  const [map, setMap] = React.useState(null);

  const [paymentDisplayType, setPaymentDisplayType] = useState(true);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyBLoal-kZlb6tO5aDvkJTFC0a4WMp7oHUM',
  });

  useEffect(() => {
    if (store.profile !== {}) {
      setUserInfo(store.profile);
    }
  }, [store.profile]);

  useEffect(() => {
    setCartItems(getItemsCart());
  }, [store.cartItems]);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

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
    // console.log('items: ', items);
  }
  // console.log('cartitems####333', cartItems);
  return (
    <Box
      className="responsive-checkout-tab"
      display="flex"
      flexDirection="column"
    >
      {/* START: Expected Delivery */}
      <Box hidden={store.expectedDelivery !== ''} m={2} />
      <Box hidden={store.expectedDelivery === ''}>
        <Box
          className={classes.section}
          // height="100px"
          display="inline"
          // lineHeight="100px"
          id="responsiveExpectedDelivery"
        >
          <Box
            color={appColors.primary}
            fontSize="18px"
            textAlign="left"
            fontWeight="700"
            paddingTop="20px"
            paddingBottom="10px"
          >
            Expected Delivery:
          </Box>
          <Box flexGrow={1} />

          <Box
            fontSize="14px"
            fontWeight="bold"
            textAlign="left"
            paddingBottom="10px"
          >
            {store.expectedDelivery}
          </Box>

          <textarea
            style={{
              display: 'flex',
              type: 'text',
              value: 'text',
              width: '355px',
              height: '51px',
            }}
            placeholder="Delivery Instructions (ex: gate code, leave on porch)"
            autoComplete="on"
            maxLength="100"
            cols="20"
            row="5"
            borderRadius="2rem"
          ></textarea>
        </Box>
      </Box>
      {/* END: Expected Delivery */}

      <Box display="flex" fontWeight="700" fontSize="16px" paddingBottom="1rem">
        Enter Full Address
        <Box>{/* <MapComponent/> */}</Box>
      </Box>

      <Box display="flex" mb={1}>
        <CssTextField
          //  error={locError}
          value={userInfo.address}
          name="address"
          label="Street Address"
          variant="outlined"
          size="small"
          fullWidth
          // onChange={onFieldChange}
        />

        <Box ml={1} width="40%">
          <CssTextField
            value={userInfo.unit}
            name="unit"
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
            value={userInfo.city}
            name="city"
            label="City"
            variant="outlined"
            size="small"
            fullWidth
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
          />
        </Box>
      </Box>

      <LoadScript googleMapsApiKey={process.env.REACT_APP_BING_LOCATION_KEY}>
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
      </LoadScript>

      <Box>
        <input
          style={{
            display: 'flex',
            type: 'text',
            value: 'text',
            width: '100%',
            height: '2rem',
          }}
          placeholder="Delivery Instructions (ex: gate code, leave on porch)"
          autoComplete="on"
          maxLength="100"
          cols="20"
          row="5"
          borderRadius="2rem"
        ></input>
      </Box>

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

        <Box display="flex" paddingTop="2rem">
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
      <Box>
        <MapComponent />
      </Box>

      {/* START: Coupons */}
      <Box>
        <Coupons
          setPromoApplied={setPromoApplied}
          originalDeliveryFee={origDeliveryFee}
          setDeliveryFee={setDeliveryFee}
          subtotal={subtotal}
          classes={classes}
        />
      </Box>
      {/* END: Coupons */}

      {/* START: Pricing */}
      {/* <Box className={classes.section} display="flex">
        <Box>Subtotal</Box>
        <Box flexGrow={1} />
        <Box>${subtotal.toFixed(2)}</Box>
      </Box> */}
      <Box className={classes.section} display="flex">
        <Box>Delivery Fee</Box>
        <Box flexGrow={1} />
        <Box>${deliveryFee.toFixed(2)}</Box>
      </Box>
      <Box className={classes.section} display="flex">
        <Box>Service Fee</Box>
        <Box flexGrow={1} />
        <Box>${serviceFee.toFixed(2)}</Box>
      </Box>
      <Box
        style={{ marginBottom: '10px', paddingBottom: '10px' }}
        display="flex"
      >
        Driver Tip:
      </Box>

      <Box className={classes.driverTipBox}>
        <Box display="flex" fontWeight="700" marginBottom="1rem">
          {' '}
          Driver Tip{' '}
        </Box>
        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            className={classes.button}
            size="small"
            variant="outlined"
            color="secondary"
            onClick={() => setDriverTip(0)}
            style={{
              borderRadius: '5px',
              textTransform: 'none',
              color: '#000000',
            }}
          >
            No Tip
          </Button>
          <Button
            className={classes.button}
            size="small"
            variant="outlined"
            color="secondary"
            onClick={() => setDriverTip(2)}
            style={{
              borderRadius: '5px',
              color: '#000000',
              backgroundColor: ' ',
            }}
          >
            $2
          </Button>
          <Button
            className={classes.button}
            size="small"
            variant="outlined"
            color="secondary"
            onClick={() => setDriverTip(3)}
            style={{ borderRadius: '5px', color: '#000000' }}
          >
            $3
          </Button>
          <Button
            className={classes.button}
            size="small"
            variant="outlined"
            color="secondary"
            onClick={() => setDriverTip(5)}
            style={{ borderRadius: '5px', color: '#000000' }}
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

      <Box
        display="flex"
        width="100%"
        height="2rem"
        marginTop="1rem"
        marginBottom="1rem"
      >
        <Button
          variant="outlined"
          color="secondary"
          className={classes.button}
          style={{ color: '#000000' }}
        >
          {' '}
          Enter Ambassador Code{' '}
        </Button>
        <Button
          variant="outlined"
          style={{
            backgroundImage: `url(${'./info_icon.png'})`,
            backgroundSize: '75% 100%',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            marginLeft: '1rem',
          }}
        >
          {' '}
        </Button>
      </Box>
      <Box className={classes.section} fontWeight="bold" display="flex">
        <Box>Total</Box>
        <Box flexGrow={1} />
        <Box>{total.toFixed(2)}</Box>
      </Box>
      {/* END: Pricing */}
      <Box display="flex" my={2} flexDirection="column" px="2%">
        <Button
          className={classes.button}
          size="small"
          variant="contained"
          color="primary"
          onClick={() => {
            setLeftTabChosen(4);
            setPaymentDisplayType(!paymentDisplayType);
          }}
          style={{ textTransform: 'none' }}
        >
          Proceed as guest
        </Button>
      </Box>
      <Box display="flex" flexDirection="column" px="2%">
        <p style={{ color: appColors.secondary, fontWeight: 500 }}>
          Already have an account?
        </p>
        <Button
          className={classes.button}
          size="small"
          variant="contained"
          color="primary"
          onClick={() => {
            setLeftTabChosen(4);
            setLoggingIn(true);
          }}
          style={{ textTransform: 'none' }}
        >
          Login
        </Button>
      </Box>
      <Box display="flex" flexDirection="column" px="2%">
        <p style={{ color: appColors.secondary, fontWeight: 500 }}>
          Save time and create an account?
        </p>
        <Button
          className={classes.button}
          size="small"
          variant="contained"
          color="primary"
          onClick={() => {
            setLeftTabChosen(4);
            setSigningUp(true);
          }}
          style={{ textTransform: 'none' }}
        >
          Sign Up
        </Button>
      </Box>

      {/* <Box hidden =  {loggingIn}>
        <SignUp />
      </Box> */}

      {/* Login dialog opens here based on login state */}
      <Dialog
        fullScreen
        open={loggingIn}
        onClose={() => setLoggingIn(false)}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <Box
          mt={1}
          style={{
            justifyContent: 'center',
            display: 'flex',
            height: '100%',
            alignItems: 'center',
          }}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={() => setLoggingIn(false)}
            style={{
              width: '120px',
            }}
          >
            Close
          </Button>
        </Box>
      </Dialog>

      {/* Sign up dialog opens here based on signUp state */}
      <Dialog
        fullScreen
        open={signingUp}
        onClose={() => setSigningUp(false)}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <Box
          mt={1}
          style={{
            justifyContent: 'center',
            display: 'flex',
            height: '100%',
            alignItems: 'center',
          }}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={() => setSigningUp(false)}
            style={{
              width: '120px',
            }}
          >
            Close
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
