import React, { useContext, useState, useEffect } from 'react';
import { Box } from '@material-ui/core';
import CheckoutLeft from './CheckoutLeft';
import CheckoutRight from './CheckoutRight';

export default function Checkout() {
  return (
    <>
      <Box display="flex">
        <Box width="45%">
          <CheckoutLeft />
        </Box>
        <Box width="55%">
          <CheckoutRight />
        </Box>
      </Box>
    </>
  );
}
