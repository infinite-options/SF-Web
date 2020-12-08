import React, { useMemo, useContext, useState, useEffect } from 'react';
import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormHelperText } from '@material-ui/core';
import clsx from 'clsx';
import { useConfirmation } from '../../../services/ConfirmationService';
import appColors from '../../../styles/AppColors';
import useResponsiveFontSize from '../../../utils/useResponsiveFontSize';
import CssTextField from '../../../utils/CssTextField';
import FindLongLatWithAddr from '../../../utils/FindLongLatWithAddr';
import { onPurchaseComplete } from '../utils/onPurchaseComplete';
import storeContext from '../../storeContext';
import { AuthContext } from '../../../auth/AuthContext';
import checkoutContext from '../CheckoutContext';

const cookies = new Cookies();

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

// DONE: Add textfields for guest to enter in information
// DONE: Add email for guest
// DONE: Send Parva a note about the CORS issue
// TODO: if a guest goes back to the home page, there is (for the most part) no way for them to get back,
//       So, cart needs to be cleared if they try in input a new address and buttons need to show if they
//       entered an address and are in the home page, the menu buttons also need to be enabled for a guest
const PaymentTab = () => {
  const classes = useStyles();
  const store = useContext(storeContext);
  const auth = useContext(AuthContext);
  const checkout = useContext(checkoutContext);
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
    guestInfo,
    setGuestInfo,
  } = useContext(checkoutContext);

  useEffect(() => {
    setProcessing(false);
  }, []);

  const [userInfo, setUserInfo] = useState(store.profile);
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [deliveryInstructions, SetDeliveryInstructions] = useState('');

  function resetError() {
    setNameError('');
    setPhoneError('');
    setEmailError('');
    setErrorMessage('');
  }

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
  }, [
    userInfo.address,
    userInfo.city,
    userInfo.zip,
    userInfo.state,
    store.profile.address,
    store.profile.city,
    store.profile.zip,
    store.profile.state,
  ]);

  const onPay = async (event) => {
    event.preventDefault();
    if (!auth.isAuth) {
      let hasName = true;
      let hasPhone = true;
      let hasEmail = true;
      if (guestInfo.name === '') {
        setNameError('Empty');
        hasName = false;
      }
      if (guestInfo.phoneNumber === '') {
        setPhoneError('Empty');
        hasPhone = false;
      }
      if (guestInfo.email === '') {
        setEmailError('Empty');
        hasEmail = false;
      } else {
        let emailExists = await axios
          .post(process.env.REACT_APP_SERVER_BASE_URI + 'AccountSalt', {
            email: guestInfo.email,
          })
          .then((res) => {
            return res.data.code >= 200 || res.data.code < 300;
          });
        if (emailExists) {
          setEmailError('Exists');
          setErrorMessage(
            'This email is already associated with an account, please log in or use a different email.'
          );
          return;
        }
      }
      if (!hasName || !hasPhone || !hasEmail) {
        setErrorMessage(
          'Please provide all contact information to complete purchase'
        );
        return;
      }
      resetError();
      const updatedProfile = { ...profile };
      updatedProfile.firstName = guestInfo.name;
      updatedProfile.phoneNum = guestInfo.phoneNumber;
      updatedProfile.email = guestInfo.email;
      store.setProfile(updatedProfile);
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

      console.log('purchase data: ', JSON.stringify(data));

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

  const onFieldChange = (event) => {
    if (errorMessage !== '') resetError();
    const { name, value } = event.target;
    const cal = guestInfo;
    setGuestInfo({ ...guestInfo, [name]: value });
  };

  const SectionLabel = (labelText) => {
    return (
      <Box
        width="200px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        className={classes.label}
      >
        {labelText}
      </Box>
    );
  };

  const SectionContent = (contentProps) => {
    return auth.isAuth ? (
      <Box className={classes.info}>{contentProps.text}</Box>
    ) : (
      <CssTextField
        error={contentProps.error}
        name={contentProps.name}
        size="small"
        variant="standard"
        fullWidth
        onChange={onFieldChange}
        style={{
          marginLeft: '30px',
          height: '18px',
        }}
      />
    );
  };

  return (
    <Box pt={3} px={10}>
      {paymentProcessing && (
        <p className={classes.notify}>
          Please Enter Your {auth.isAuth ? '' : 'Contact and'} Credit Card
          Information.
        </p>
      )}
      <form>
        <FormHelperText error={true} style={{ textAlign: 'center' }}>
          {errorMessage}
        </FormHelperText>
        <Box className={classes.section} display="flex">
          {SectionLabel('Contact Name:')}
          <Box flexGrow={1} />
          {SectionContent({
            text: userInfo.firstName + ' ' + userInfo.lastName,
            name: 'name',
            error: nameError,
          })}
        </Box>
        <Box className={classes.section} display="flex">
          {SectionLabel('Contact Phone:')}
          <Box flexGrow={1} />
          {SectionContent({
            text: userInfo.phoneNum,
            name: 'phoneNumber',
            error: phoneError,
          })}
        </Box>
        <Box className={classes.section} display="flex">
          {SectionLabel('Contact Email:')}
          <Box flexGrow={1} />
          {SectionContent({
            text: userInfo.email,
            name: 'email',
            error: emailError,
          })}
        </Box>
      </form>
      <Box className={classes.section} display="flex">
        {SectionLabel('Delivery Address:')}
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
      <label value={profile.deliveryInstructions} className={classes.label}>
        Enter Delivery Instructions Below:
      </label>
      <Box mb={1} mt={0.5} justifyContent="center">
        <textarea
          onChange={onDeliveryInstructionsChange}
          className={classes.delivInstr}
          type=""
        />
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
