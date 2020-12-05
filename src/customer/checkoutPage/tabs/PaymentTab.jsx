import React, { useMemo, useContext, useState, useEffect } from 'react';

import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
// import {loadStripe} from "@stripe/stripe-js";
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import clsx from 'clsx';
import { useConfirmation } from '../../../services/ConfirmationService';
import appColors from '../../../styles/AppColors';
import useResponsiveFontSize from '../../../utils/useResponsiveFontSize';
import CssTextField from '../../../utils/CssTextField';
import FindLongLatWithAddr from '../../../utils/FindLongLatWithAddr';

import { onPurchaseComplete } from '../utils/onPurchaseComplete';
import checkoutContext from '../CheckoutContext';
import storeContext from '../../storeContext';
import { set } from 'date-fns';

const useStyles = makeStyles({
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
  section: {
    textAlign: 'left',
    borderBottom: '1px solid' + appColors.checkoutSectionBorder,
    marginBottom: '10px',
    paddingBottom: '10px',
  },
  info: {
    width: '400px',
  },
  delivInstr: {
    width: '100%',
    minHeight: '40px',
    maxHeight: '150px',
    backgroundColor: 'white',
    color: 'black',
    fontSize: '15px',
    border: '1px solid ' + appColors.paragraphText,
    outline: appColors.secondary + ' !important',
    borderRadius: '10px',
    textAlign: 'left',
    fontFamily: 'Arial',
    resize: 'vertical',
  },
  button: {
    color: appColors.primary,
    width: '300px',
  },
  notify: {
    fontSize: '18px',
    color: '#fc6f03',
    fontWeight: 'bold',
  },
});

const useOptions = () => {
  const fontSize = useResponsiveFontSize();
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize,
          color: appColors.paragraphText,
          letterSpacing: '0.025em',
          fontFamily: 'Source Code Pro, monospace',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#9e2146',
        },
      },
    }),
    [fontSize]
  );

  return options;
};

// TODO: Ask about payment details for guest
const PaymentTab = () => {
  const classes = useStyles();
  const store = useContext(storeContext);
  const confirm = useConfirmation();

  const elements = useElements();
  const stripe = useStripe();
  const options = useOptions();
  const [processing, setProcessing] = useState('false');
  const {
    profile,
    cartItems,
    setCartItems,
    startDeliveryDate,
    setCartTotal,
  } = useContext(storeContext);

  const {
    amountPaid,
    amountDue,
    discount,
    paymentProcessing,
    setPaymentProcessing,
    setLeftTabChosen,
  } = useContext(checkoutContext);

  useEffect(() => {
    setProcessing(false);
  }, []);

  const [userInfo, setUserInfo] = useState(store.profile);
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(true);
  const [deliveryInstructions, SetDeliveryInstructions] = useState('');

  const onDeliveryInstructionsChange = (event) => {
    const { value } = event.target;
    SetDeliveryInstructions(value);
  };
  useEffect(() => {
    if (store.profile !== {}) {
      setUserInfo(store.profile);
    }
  }, [store.profile]);

  useEffect(() => {
    setIsAddressConfirmed(
      userInfo.address === store.profile.address &&
        userInfo.city === store.profile.city &&
        userInfo.zip === store.profile.zip &&
        userInfo.state === store.profile.state
    );
  }, [userInfo]);

  const onPay = async (event) => {
    event.preventDefault();
    console.log('important: ');
    setProcessing(true);

    const billingDetails = {
      name: profile.firstName + ' ' + profile.lastName,
      email: profile.email,
      address: {
        line1: profile.address,
        city: profile.city,
        state: profile.state,
        postal_code: profile.zip,
      },
    };
    let formSending = new FormData();
    formSending.append('amount', amountPaid);
    try {
      const {
        data: { client_secret },
      } = await axios.post(
        process.env.REACT_APP_SERVER_BASE_URI + 'Stripe_Intent',
        formSending,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const items = Object.values(cartItems).map((item) => {
        return {
          qty: item.count,
          name: item.name,
          price: item.price,
          item_uid: item.id,
          itm_business_uid: item.business_uid,
          img: item.img,
        };
      });

      const cardElement = await elements.getElement(CardElement);

      const paymentMethod = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingDetails,
      });

      const confirmed = await stripe.confirmCardPayment(client_secret, {
        payment_method: paymentMethod.paymentMethod.id,
      });

      console.log('confirm Paid: ', confirmed);
      //gathering data to send back our server
      //set start_delivery_date

      const data = {
        pur_customer_uid: profile.customer_uid,
        pur_business_uid: cartItems[Object.keys(cartItems)[0]].business_uid,
        items,
        order_instructions: 'fast',
        delivery_instructions: deliveryInstructions,
        order_type: 'meal',
        delivery_first_name: profile.firstName,
        delivery_last_name: profile.lastName,
        delivery_phone_num: profile.phoneNum,
        delivery_email: profile.email,
        delivery_address: profile.address,
        delivery_unit: profile.unit,
        delivery_city: profile.city,
        delivery_state: profile.state,
        delivery_zip: profile.zip,
        delivery_latitude: profile.latitude,
        delivery_longitude: profile.longitude,
        purchase_notes: 'purchase_notes',
        start_delivery_date: startDeliveryDate,
        pay_coupon_id: '',
        amount_due: amountDue,
        amount_discount: discount,
        amount_paid: amountPaid,
        info_is_Addon: 'FALSE',
        cc_num: paymentMethod.paymentMethod.card.last4,
        cc_exp_date:
          paymentMethod.paymentMethod.card.exp_year +
          '-' +
          paymentMethod.paymentMethod.card.exp_month +
          '-01 00:00:00',
        cc_cvv: 'NULL',
        cc_zip: 'NULL',
        charge_id: confirmed.paymentIntent.id,
        payment_type: 'STRIPE',
      };

      console.log('data sending: ', data);
      let res = axios
        .post(process.env.REACT_APP_SERVER_BASE_URI + 'checkout', data)
        .then((res) => {
          cardElement.clear();
          setProcessing(false);
          setPaymentProcessing(false);
          onPurchaseComplete({ store: store, confirm: confirm });
        });
    } catch (err) {
      setProcessing(false);
      setPaymentProcessing(false);
      console.log('error happened while posting to Stripe_Intent api', err);
    }
  };

  const onFieldChange = (event) => {
    const { name, value } = event.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const PlainTextField = (props) => {
    return (
      <Box mb={props.spacing || 1}>
        <CssTextField
          value={props.value}
          name={props.name}
          label={props.label}
          type={props.type}
          variant="outlined"
          size="small"
          fullWidth
          onChange={onFieldChange}
        />
      </Box>
    );
  };

  return (
    <Box pt={3} px={10}>
      {paymentProcessing && (
        <p className={classes.notify}>
          Please Enter Your Credit Card Information.
        </p>
      )}
      <Box className={classes.section} display="flex">
        <Box width="200px" className={classes.label}>
          Contact Name:
        </Box>
        <Box flexGrow={1} />
        <Box className={classes.info}>
          {userInfo.firstName} {userInfo.lastName}
        </Box>
      </Box>
      <Box className={classes.section} display="flex">
        <Box width="200px" className={classes.label}>
          Contact Phone:
        </Box>
        <Box flexGrow={1} />
        <Box className={classes.info}>{userInfo.phoneNum}</Box>
      </Box>
      <Box className={classes.section} display="flex">
        <Box width="200px" className={classes.label}>
          Delivery Address:
        </Box>
        <Box flexGrow={1} />
        <Box
          className={classes.info}
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
      <label
        value={profile.deliveryInstructions}
        onChange={onDeliveryInstructionsChange}
        className={classes.label}
      >
        Enter Delivery Instructions Below:
      </label>
      <Box mb={1} mt={0.5} justifyContent="center">
        <textarea className={classes.delivInstr} type="" />
      </Box>
      <label className={classes.label}>Enter Cardholder Name Below:</label>
      <Box mt={1}>
        <CssTextField variant="outlined" size="small" fullWidth />
      </Box>
      <Box mt={1}>
        <label className={classes.label}>
          Enter Card details Below:
          <CardElement className={classes.element} options={options} />
        </label>
      </Box>
      <Button
        className={classes.button}
        variant="outlined"
        size="small"
        color="paragraphText"
        onClick={onPay}
        disabled={processing}
      >
        PAY
      </Button>
    </Box>
  );
};

export default PaymentTab;
