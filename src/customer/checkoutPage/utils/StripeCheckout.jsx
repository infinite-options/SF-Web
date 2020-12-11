import React, { useMemo, useContext, useState, useEffect } from 'react';
import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import Cookies from 'universal-cookie';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import appColors from '../../../styles/AppColors';
import { onPurchaseComplete } from './onPurchaseComplete';
import useResponsiveFontSize from '../../../utils/useResponsiveFontSize';
import { useConfirmation } from '../../../services/ConfirmationService';
import CssTextField from '../../../utils/CssTextField';
import { AuthContext } from '../../../auth/AuthContext';
import storeContext from '../../storeContext';
import checkoutContext from '../CheckoutContext';

const cookies = new Cookies();
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
const StripeCheckout = (props) => {
  const auth = useContext(AuthContext);

  const store = useContext(storeContext);
  const checkout = useContext(checkoutContext);
  const confirm = useConfirmation();

  const elements = useElements();
  const stripe = useStripe();
  const options = useOptions();
  const [processing, setProcessing] = useState(false);
  const {
    profile,
    setProfile,
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
    guestInfo,
    setGuestInfo,
  } = useContext(checkoutContext);

  const onPay = async (event) => {
    event.preventDefault();
    if (!auth.isAuth) {
      let hasName = true;
      let hasPhone = true;
      let hasEmail = true;
      if (guestInfo.name === '') {
        props.errors.setNameError('Empty');
        hasName = false;
      }
      if (guestInfo.phoneNumber === '') {
        props.errors.setPhoneError('Empty');
        hasPhone = false;
      }
      if (guestInfo.email === '') {
        props.errors.setEmailError('Empty');
        hasEmail = false;
      } else {
        let emailExists = await axios
          .post(process.env.REACT_APP_SERVER_BASE_URI + 'AccountSalt', {
            email: guestInfo.email,
          })
          .then((res) => {
            return res.data.code >= 200 && res.data.code < 300;
          });
        if (emailExists) {
          props.errors.setEmailError('Exists');
          props.errors.setErrorMessage(
            'This email is already associated with an account, please log in or use a different email.'
          );
          return;
        }
      }
      if (!hasName || !hasPhone || !hasEmail) {
        props.errors.setErrorMessage(
          'Please provide all contact information to complete purchase'
        );
        return;
      }
      props.errors.resetError();
      const updatedProfile = { ...profile };
      updatedProfile.firstName = guestInfo.name;
      updatedProfile.phoneNum = guestInfo.phoneNumber;
      updatedProfile.email = guestInfo.email;
      setProfile(updatedProfile);
    }

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
          unit: item.unit,
          price: item.price,
          item_uid: item.id,
          itm_business_uid: item.business_uid,
          description: item.desc,
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
      //gathering data to send back our server
      //set start_delivery_date

      // DONE: for Guest, put 'guest' in uid
      // TODO: Add Pay coupon ID
      const data = {
        // pur_customer_uid: profile.customer_uid,
        pur_customer_uid: auth.isAuth ? cookies.get('customer_uid') : 'guest',
        pur_business_uid: cartItems[Object.keys(cartItems)[0]].business_uid,
        items,
        order_instructions: 'fast',
        delivery_instructions: props.deliveryInstructions,
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
        amount_due: amountDue.toString(),
        amount_discount: discount.toString(),
        amount_paid: amountPaid.toString(),
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
        delivery_status: 'FALSE',
      };

      let res = axios
        .post(
          process.env.REACT_APP_SERVER_BASE_URI + 'purchase_Data_SF',
          data,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then((res) => {
          cardElement.clear();
          setProcessing(false);
          setPaymentProcessing(false);
          onPurchaseComplete({
            store: store,
            checkout: checkout,
            confirm: confirm,
          });
        })
        .catch((err) => {
          setProcessing(false);
          setPaymentProcessing(false);
          console.log(
            'error happened while posting to purchase_Data_SF api',
            err
          );
        });
    } catch (err) {
      setProcessing(false);
      setPaymentProcessing(false);
      console.log('error happened while posting to Stripe_Intent api', err);
    }
  };

  return (
    <>
      <label className={props.classes.label}>
        Enter Cardholder Name Below:
      </label>
      <Box mt={1}>
        <CssTextField variant="outlined" size="small" fullWidth />
      </Box>
      <Box mt={1}>
        <label className={props.classes.label}>
          Enter Card details Below:
          <CardElement className={props.classes.element} options={options} />
        </label>
      </Box>

      <Button
        className={props.classes.button}
        variant="outlined"
        size="small"
        color="paragraphText"
        onClick={onPay}
        disabled={processing}
      >
        Pay With Stripe
      </Button>
    </>
  );
};
export default StripeCheckout;
