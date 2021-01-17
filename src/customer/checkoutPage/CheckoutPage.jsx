import React, { useContext, useState, useEffect } from 'react';
import LoadingOverlay from 'react-loading-overlay';

import { Box } from '@material-ui/core';
import CheckoutLeft from './CheckoutLeft';
import CheckoutRight from './CheckoutRight';
import CheckoutContext from './CheckoutContext';
import { Elements, CardElement, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
// import storeContext from "customer/storeContext";
// import axios from "axios";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_STRIPE_PUBLIC_KEY_LIVE
    : process.env.REACT_APP_STRIPE_PUBLIC_KEY
);

export default function CheckoutPage() {
  const [paymentDetails, setPaymentDetails] = useState({
    amountPaid: 0,
    amountDue: 0,
    discount: 0,
    subtotal: 0,
    serviceFee: 1.5,
    deliveryFee: 5,
    driverTip: 0,
    taxes: 0,
  });
  const [purchaseMade, setPurchaseMade] = useState(0);
  console.log(
    'In Checkout Page Production: ',
    process.env.NODE_ENV === 'production'
  );
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [chosenCoupon, setChosenCoupon] = useState('');
  const [leftTabChosen, setLeftTabChosen] = useState(4);

  useEffect(() => {
    console.log(chosenCoupon);
  }, [chosenCoupon]);

  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    addressVerified: true,
  });

  return (
    <>
      <CheckoutContext.Provider
        value={{
          paymentDetails,
          setPaymentDetails,
          paymentProcessing,
          setPaymentProcessing,
          leftTabChosen,
          setLeftTabChosen,
          guestInfo,
          setGuestInfo,
          purchaseMade,
          setPurchaseMade,
          chosenCoupon,
          setChosenCoupon,
        }}
      >
        <Elements stripe={stripePromise}>
          <LoadingOverlay
            active={paymentProcessing}
            spinner
            text="Processing Payment"
          />

          <Box 
          // display="flex"
          className="checkout-container"
          >
            
            <Box 
            // width="55%"
            className="checkout-right"
            >
              <CheckoutRight />
            </Box>
            <Box 
            // width="45%"
            className="checkout-left"
            >
              <CheckoutLeft />
            </Box>
            
          </Box>
        </Elements>
      </CheckoutContext.Provider>
    </>
  );
}
