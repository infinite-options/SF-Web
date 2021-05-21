import React, { useMemo, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormHelperText,  Typography } from '@material-ui/core';
import clsx from 'clsx';
import {useHistory} from 'react-router-dom';

import appColors from '../../../styles/AppColors';
import AuthUtils from '../../../utils/AuthUtils';
import CssTextField from '../../../utils/CssTextField';
import FindLongLatWithAddr from '../../../utils/FindLongLatWithAddr';
import storeContext from '../../storeContext';
import { AuthContext } from '../../../auth/AuthContext';
import checkoutContext from '../CheckoutContext';
import PayPal from '../utils/Paypal';
import StripeElement from '../utils/StripeElement';
import DeliveryInfoTab from '../tabs/DeliveryInfoTab';

import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import TermsAndConditions from './TermsAndConditions';



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
    width: '300px',

  },
  notify: {
    fontSize: '18px',
    color: '#fc6f03',
    fontWeight: 'bold',
  },

  termsAndConditions: {
    fontSize: '14px',
  },

  termsAndConditionsLink: {
    textDecoration: 'underline',
    '&:hover': {
      cursor: 'pointer',
    },
  },

});

const PaymentTab = () => {
  const classes = useStyles();
  const history = useHistory();
  const store = useContext(storeContext);
  const auth = useContext(AuthContext);
  const [paymentType, setPaymentType] = useState('NONE');
  const { 
    profile,
    cartItems,
    setCartItems, 
    startDeliveryDate, 
    setCartTotal } = useContext(storeContext);

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
  const [ishidden, setIsHidden] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [deliveryInstructions, SetDeliveryInstructions] = useState(
    localStorage.getItem('deliveryInstructions') || ''
  );

  const [termsAccepted, setTermsAccepted] = useState(false);

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
        size="medium"
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

  const PlainTextField = (props) => {
    return (
      <Box mb={props.spacing || 1}>
        <CssTextField
          error={props.error}
          value={props.value}
          name={props.name}
          label={props.label}
          type={props.type}
          disabled={props.disabled}
          variant="outlined"
          size="small"
          fullWidth
          onChange={ onFieldChange}
        />
      </Box>
    );
  };

  //TODO: Add recipient label
  //TODO: If guest, give message: 'enter a password and sign up to be eligible for history and additional coupons press continue to create your account or cancel to skip'
  return (
    <>
    <Box
      pt={3}
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
        <Box className={classes.section} display="flex" flexDirection='column'>
        {PlainTextField({
          value: guestInfo.firstName,
          name: 'firstName',
          label: 'First Name',
          error: firstNameError,
            
        })}
        {PlainTextField({
          value: guestInfo.lastName,
          name: 'lastName',
          label: 'Last Name',
          error: lastNameError,
        })}
        {PlainTextField({
       //   error: emailError,
          value: guestInfo.email,
          name: 'email',
          label: 'Email',
          error: emailError,
          //   spacing: spacing,
        })}
        {PlainTextField({
          value: guestInfo.phoneNum,
          name: 'phoneNumber',
          label: 'Phone Number',
          error: phoneError,
        })}
        </Box>
      </form>
      <Box hidden={!auth.isAuth}>
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
      <Box
          style = {{display: 'flex'}}
        >
          <FormControl component="fieldset">
            <FormGroup aria-label="position" row onClick = {() => console.log('Clicky')}>
              <Box style = {{display: 'flex', alignItems: 'center'}}>
                <FormControlLabel
                  onClick = {() => setTermsAccepted(!termsAccepted)}
                  value="end"
                  control={<Checkbox color="primary" />}
                  labelPlacement="end"
                />
                <Typography
                  className = {classes.termsAndConditions}
                >
                  I’ve read and accept
                  the <a
                      className = {classes.termsAndConditionsLink}
                      onClick = {() => history.push('/terms-and-conditions')}
                    >
                      Terms and Conditions
                    </a>
                </Typography>
              </Box>
            </FormGroup>
          </FormControl>
        </Box>

        <Box hidden={paymentType !== 'PAYPAL' && paymentType !== 'NONE'}>
          <Box display="flex" flexDirection="column" justifyContent="center" mb={1}>
            <Button
              className={classes.showButton}
              size="small"
              variant="contained"
              color="primary"
              onClick={() => onPayWithClicked('STRIPE')}
              disabled = {!termsAccepted}
            >
              Pay with Stripe {paymentType !== 'NONE' ? 'Instead?' : ''}
            </Button>
          </Box>
        </Box>
        <Box hidden={paymentType !== 'STRIPE' && paymentType !== 'NONE'}>
          <Box display="flex" flexDirection="column" justifyContent="center">
            <Button
              className={classes.showButton}
              size="small"
              variant="contained"
              color="primary"
              onClick={() => onPayWithClicked('PAYPAL')}
              disabled = {!termsAccepted}
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
    </>
  );
};
export default PaymentTab;
