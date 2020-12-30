import React, { useContext, useState, useEffect } from 'react';
import { Box } from '@material-ui/core';
import { Elements, CardElement, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeCheckout from './StripeCheckout';

export default function StripeElement(props) {
  const stripePromise = loadStripe(
    process.env.NODE_ENV === 'production' &&
      props.deliveryInstructions !== 'SFTEST'
      ? process.env.REACT_APP_STRIPE_PUBLIC_KEY_LIVE
      : process.env.REACT_APP_STRIPE_PUBLIC_KEY
  );

  return (
    <Elements stripe={stripePromise}>
      <StripeCheckout
        deliveryInstructions={props.deliveryInstructions}
        setPaymentType={props.setPaymentType}
        classes={props.classes}
      />
    </Elements>
  );
}
