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

export default function CheckoutPage({ ...props }) {
  const store = useContext(storeContext);
  const [userInfo, setUserInfo] = React.useState({});
  useEffect(() => {
    setUserInfo({
      email: store.profile.customer_email || '',
      firstName: store.profile.customer_first_name || '',
      lastName: store.profile.customer_last_name || '',
      phoneNum: store.profile.customer_phone_num || '',
      address: store.profile.customer_address || '',
      unit: store.profile.customer_unit || '',
      city: store.profile.customer_city || '',
      state: store.profile.customer_state || '',
      zip: store.profile.customer_zip || '',
      deliveryInstructions: '',
      latitude: store.profile.customer_lat || '',
      longitude: store.profile.customer_long || '',
    });
  }, [store.profile]);

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
