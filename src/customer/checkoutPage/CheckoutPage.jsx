import React, { useContext, useState, useEffect } from 'react';
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
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

export default function CheckoutPage() {
  const [amountPaid, setAmountPaid] = useState(0);
  const [amountDue, setAmountDue] = useState(0);
  const [discount, setDiscount] = useState(0);

  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [leftTabChosen, setLeftTabChosen] = useState(4);

  const [guestInfo, setGuestInfo] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    addressVerified: true,
  });

  return (
    <>
      <CheckoutContext.Provider
        value={{
          amountPaid,
          amountDue,
          discount,
          paymentProcessing,
          setPaymentProcessing,
          setAmountPaid,
          setAmountDue,
          setDiscount,
          leftTabChosen,
          setLeftTabChosen,
          guestInfo,
          setGuestInfo,
        }}
      >
        <Elements stripe={stripePromise}>
          <Box display="flex">
            <Box width="45%">
              <CheckoutLeft />
            </Box>
            <Box width="55%">
              <CheckoutRight />
            </Box>
          </Box>
        </Elements>
      </CheckoutContext.Provider>
    </>
  );
}
