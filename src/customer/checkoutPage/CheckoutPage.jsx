import React, { useContext, useState, useEffect } from 'react';
import { Box } from '@material-ui/core';
import CheckoutLeft from './CheckoutLeft';
import CheckoutRight from './CheckoutRight';
import CheckoutContext from './CheckoutContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

export default function CheckoutPage({ ...props }) {
  const [userInfo, setUserInfo] = React.useState({});
  useEffect(() => {
    setUserInfo({
      email: props.profile.customer_email || '',
      firstName: props.profile.customer_first_name || '',
      lastName: props.profile.customer_last_name || '',
      phoneNum: props.profile.customer_phone_num || '',
      address: props.profile.customer_address || '',
      unit: props.profile.customer_unit || '',
      city: props.profile.customer_city || '',
      state: props.profile.customer_state || '',
      zip: props.profile.customer_zip || '',
      deliveryInstructions: '',
      latitude: props.profile.customer_lat || '',
      longitude: props.profile.customer_long || '',
    });
  }, [props.profile]);

  const [paymentInfo, setPaymentInfo] = useState();
  return (
    <>
      <CheckoutContext.Provider
        value={{ userInfo, setUserInfo, paymentInfo, setPaymentInfo }}
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
