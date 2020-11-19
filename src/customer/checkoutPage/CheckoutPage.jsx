import React, { useContext, useState, useEffect } from 'react';
import { Box } from '@material-ui/core';
import CheckoutLeft from './CheckoutLeft';
import CheckoutRight from './CheckoutRight';
import CheckoutContext from './CheckoutContext';

export default function CheckoutPage({ ...props }) {
  const [userInfo, setUserInfo] = React.useState({});
  useEffect(() => {
    setUserInfo({
      email: props.profile.customer_email,
      firstName: props.profile.customer_first_name,
      lastName: props.profile.customer_last_name,
      phoneNum: props.profile.customer_phone_num,
      address: props.profile.customer_address,
      unit: props.profile.customer_unit,
      city: props.profile.customer_city,
      state: props.profile.customer_state,
      zip: props.profile.customer_zip,
    });
  }, [props.profile]);

  const [paymentInfo, setPaymentInfo] = useState();

  return (
    <>
      <CheckoutContext.Provider
        value={{ userInfo, setUserInfo, paymentInfo, setPaymentInfo }}
      >
        <Box display="flex">
          <Box width="45%">
            <CheckoutLeft />
          </Box>
          <Box width="55%">
            <CheckoutRight />
          </Box>
        </Box>
      </CheckoutContext.Provider>
    </>
  );
}
