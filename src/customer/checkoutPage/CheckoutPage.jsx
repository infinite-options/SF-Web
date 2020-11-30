import React, { useContext, useState, useEffect } from 'react';
import { Box } from '@material-ui/core';
import CheckoutLeft from './CheckoutLeft';
import CheckoutRight from './CheckoutRight';
import CheckoutContext from './CheckoutContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import storeContext from 'customer/storeContext';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

export default function CheckoutPage() {
  return (
    <>
      <CheckoutContext.Provider value={{}}>
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
