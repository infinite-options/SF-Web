import React, { useMemo, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormHelperText } from '@material-ui/core';
import clsx from 'clsx';

import appColors from '../../../styles/AppColors';
import AuthUtils from '../../../utils/AuthUtils';
import CssTextField from '../../../utils/CssTextField';
import FindLongLatWithAddr from '../../../utils/FindLongLatWithAddr';
import storeContext from '../../storeContext';
import { AuthContext } from '../../../auth/AuthContext';
import checkoutContext from '../CheckoutContext';
import PayPal from '../utils/Paypal';
import StripeElement from '../utils/StripeElement';

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
  showButton: {
    color: 'white',
  },
  notify: {
    fontSize: '18px',
    color: '#fc6f03',
    fontWeight: 'bold',
  },
});

const PaymentTab = () => {
  const classes = useStyles();
  const store = useContext(storeContext);
  const auth = useContext(AuthContext);
  const [paymentType, setPaymentType] = useState('NONE');
  const {
    profile,
    cartItems,
    setCartItems,
    startDeliveryDate,
    setCartTotal,
  } = useContext(storeContext);

  const {
    paymentDetails,
    paymentProcessing,
    setPaymentProcessing,
    setLeftTabChosen,
    guestInfo,
    setGuestInfo,
  } = useContext(checkoutContext);

  const [userInfo, setUserInfo] = useState(store.profile);
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [deliveryInstructions, SetDeliveryInstructions] = useState(
    localStorage.getItem('deliveryInstructions') || ''
  );

  function resetError() {
    setFirstNameError('');
    setLastNameError('');
    setPhoneError('');
    setEmailError('');
    setErrorMessage('');
  }

  const onDeliveryInstructionsChange = (event) => {
    const { value } = event.target;
    SetDeliveryInstructions(value);
    localStorage.setItem('deliveryInstructions', value);
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
  }, [userInfo.address]);

  async function onPayWithClicked(type) {
    if (paymentDetails.amountDue > 0) {
      // check guest fields to make sure they are not empty
      if (!auth.isAuth) {
        let hasFirstName = true;
        let hasLastName = true;
        let hasPhone = true;
        let hasEmail = true;
        if (guestInfo.firstName === '') {
          setFirstNameError('Empty');
          hasFirstName = false;
        }
        if (guestInfo.lastName === '') {
          setLastNameError('Empty');
          hasLastName = false;
        }
        if (guestInfo.phoneNumber === '') {
          setPhoneError('Empty');
          hasPhone = false;
        }
        if (guestInfo.email === '') {
          setEmailError('Empty');
          hasEmail = false;
        }
        if (!hasFirstName || !hasLastName || !hasPhone || !hasEmail) {
          setErrorMessage(
            'Please provide all contact information to complete purchase'
          );
          return;
        }

        resetError();
        const updatedProfile = { ...profile };
        updatedProfile.firstName = guestInfo.firstName;
        updatedProfile.lastName = guestInfo.lastName;
        updatedProfile.phoneNum = guestInfo.phoneNumber;
        updatedProfile.email = guestInfo.email;
        store.setProfile(updatedProfile);
      }
      setPaymentType(type);
    } else {
      alert('Please add items to your card before processing payment');
    }
  }

  const onFieldChange = (event) => {
    if (errorMessage !== '') resetError();
    const { name, value } = event.target;
    if (value === '') setPaymentType('NONE');
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

  //TODO: Add recipient label
  //TODO: If guest, give message: 'enter a password and sign up to be eligible for history and additional coupons press continue to create your account or cancel to skip'
  return (
    <Box pt={3} 
    // px={10}
    className="responsive-payment-tab"
    >
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
          {SectionLabel('First Name:')}
          <Box flexGrow={1} />
          {SectionContent({
            text: userInfo.firstName,
            name: 'firstName',
            error: firstNameError,
          })}
        </Box>
        <Box className={classes.section} display="flex">
          {SectionLabel('Last Name:')}
          <Box flexGrow={1} />
          {SectionContent({
            text: userInfo.lastName,
            name: 'lastName',
            error: lastNameError,
          })}
        </Box>
        <Box className={classes.section} display="flex">
          {SectionLabel('Phone:')}
          <Box flexGrow={1} />
          {SectionContent({
            text: userInfo.phoneNum,
            name: 'phoneNumber',
            error: phoneError,
          })}
        </Box>
        <Box className={classes.section} display="flex">
          {SectionLabel('Email:')}
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
          textAlign="Left"
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
      <label className={classes.label}>
        Enter Delivery Instructions Below:
      </label>
      <Box mb={1} mt={0.5} justifyContent="center">
        <textarea
          value={deliveryInstructions}
          onChange={onDeliveryInstructionsChange}
          className={classes.delivInstr}
          type=""
        />
      </Box>
      {/* START: Payment Buttons */}
      <Box mb={3}>
        <Box hidden={paymentType !== 'PAYPAL' && paymentType !== 'NONE'}>
          <Box display="flex" flexDirection="column" px="20%" mb={1}>
            <Button
              className={classes.showButton}
              size="small"
              variant="contained"
              color="primary"
              onClick={() => onPayWithClicked('STRIPE')}
            >
              Pay with Stripe {paymentType !== 'NONE' ? 'Instead?' : ''}
            </Button>
          </Box>
        </Box>
        <Box hidden={paymentType !== 'STRIPE' && paymentType !== 'NONE'}>
          <Box display="flex" flexDirection="column" px="20%">
            <Button
              className={classes.showButton}
              size="small"
              variant="contained"
              color="primary"
              onClick={() => onPayWithClicked('PAYPAL')}
            >
              Pay with PayPal {paymentType !== 'NONE' ? 'Instead?' : ''}
            </Button>
          </Box>
        </Box>
      </Box>
      <Box hidden={paymentType !== 'PAYPAL'}>
        <PayPal
          value={paymentDetails.amountDue}
          deliveryInstructions={deliveryInstructions}
        />
      </Box>
      {paymentType === 'STRIPE' && (
        <StripeElement
          deliveryInstructions={deliveryInstructions}
          setPaymentType={setPaymentType}
          classes={classes}
        />
      )}
      {/* END: Payment Buttons */}
    </Box>
  );
};

export default PaymentTab;
