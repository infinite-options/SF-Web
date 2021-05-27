import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import appColors from '../../../styles/AppColors';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, FormHelperText } from '@material-ui/core';
import storeContext from '../../storeContext';
import MapComponent from '../../MapComponent';
import SocialLogin from '../../../admin/SocialLogin';
import CssTextField from '../../../utils/CssTextField';
import AuthUtils from '../../../utils/AuthUtils';
import { useConfirmation } from '../../../services/ConfirmationService';
import checkoutContext from '../CheckoutContext';
import { AuthContext } from '../../../auth/AuthContext';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  labelRoot: {
    fontSize: 20,
    paddingLeft: '20px',
  },
}));

const OrderConfirmation = (props) => {
  const store = useContext(storeContext);
  const checkout = useContext(checkoutContext);
  const auth = useContext(AuthContext);
  const history = useHistory();
  const confirm = useConfirmation();
  const classes = useStyles();
  const AuthMethods = new AuthUtils();
  const { profile } = useContext(storeContext);
  const updatedProfile = { ...profile };
  const [userInfo, setUserInfo] = useState(store.profile);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(true);

  const [signUpErrorMessage, setSignUpErrorMessage] = useState('');
  const [locError, setLocError] = useState('');
  const [locErrorMessage, setLocErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  function createLocError(message) {
    setLocError('Invalid Input');
    setLocErrorMessage(message);
  }

  function resetErrors() {
    setSignUpErrorMessage('');
    setLocError('');
    setLocErrorMessage('');
    setEmailError('');
    setEmailErrorMessage('');
  }

  useEffect(() => {
    if (store.profile !== {}) {
      setUserInfo(store.profile);
    }
  }, [store.profile]);

  const { setProfile } = store;

  const onSubmit = async () => {
    resetErrors();
    let isEmailError = false;
    let isEmptyError = false;
    let isPasswordError = false;
    if (isAddressConfirmed) {
      if (userInfo.pushNotifications !== store.profile.pushNotifications) {
        AuthMethods.updatePushNotifications(userInfo.pushNotifications);
      }
      if (store.profile.email !== userInfo.email) {
        isEmailError = await checkExistingEmail();
      }

      for (const field in userInfo) {
        const excluded = new Set([
          'email',
          'firstName',
          'lastName',
          'phoneNum',
          'latitude',
          'state',
          'city',
          'zip',
        ]);
        if (userInfo[field] === '' && excluded.has(field)) {
          setSignUpErrorMessage('Please enter in all Fields');
          isEmptyError = true;
        }
      }

      if (
        !auth.isAuth &&
        (password !== confirmPassword ||
          password.length === 0 ||
          confirmPassword.length === 0)
      ) {
        setPasswordError('not matching');
        setConfirmPasswordError('not matching');
        setPasswordErrorMessage('Your passwords do not match');
        isPasswordError = true;
      }
      var count = 0;

      //Minimum eight characters, at least one letter and one number:
      count += password.length >= 8 && password.length <= 32 ? 1 : 0;
      count += /[a-z]/.test(password) ? 1 : 0;
      count += /[A-Z]/.test(password) ? 1 : 0;
      count += /\d/.test(password) ? 1 : 0;
      if (count < 4) {
        setPasswordError('stronger');
        setPasswordErrorMessage('Your password does not pass the criteria');
        isPasswordError = true;
      }
      if (isEmailError || isEmptyError || isPasswordError) {
        return;
      }

      if (auth.isAuth) {
        AuthMethods.updateProfile(userInfo).then((res) => {
          console.log('(res.code === 200): ', res);
          if (res.code === 200) {
            setProfile({ ...userInfo });
          } else {
            setLocErrorMessage(
              'There was an issue updating your profile, please try again later'
            );
          }
        });
      } else {
        AuthMethods.createProfile(userInfo, password).then((res) => {
          if (res.code === 200) {
            setProfile({ ...userInfo });
            auth.setAuthLevel(0);
            auth.setIsAuth(true);
            confirm({
              variant: 'info',
              catchOnCancel: true,
              title: 'Profile Successfully Created',
              description: 'Thank you for signing up. You are now signed in.',
            }).then(() => {});
          } else {
            setLocErrorMessage(
              'There was an issue creating your Account, please try again later'
            );
          }
        });
      }
    } else {
      createLocError(
        'Your address Had not been validated, please validate before saving changes.'
      );
    }
  };
  const checkExistingEmail = async () => {
    let emailExists = await axios
      .post(process.env.REACT_APP_SERVER_BASE_URI + 'AccountSalt', {
        email: userInfo.email,
      })
      .then((res) => {
        return res.data.code === 200;
      });
    if (emailExists) {
      setEmailError('Exists');
      setEmailErrorMessage(
        'This email is already associated with an account, please try a different email.'
      );
    }
    return emailExists;
  };

  const onFieldChange = (event) => {
    const { name, value } = event.target;
    if (name === 'email' && emailError !== '') {
      setEmailError('');
      setEmailErrorMessage('');
    }
    setUserInfo({ ...userInfo, [name]: value });
  };
  const onPasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordError('');
    setConfirmPasswordError('');
    setPasswordErrorMessage('');
    if (name === 'confirm') {
      setConfirmPassword(value);
    } else {
      setPassword(value);
    }
  };

  useEffect(() => {
    setIsAddressConfirmed(
      userInfo.address === store.profile.address &&
        userInfo.city === store.profile.city &&
        userInfo.zip === store.profile.zip &&
        userInfo.state === store.profile.state
    );
  }, [userInfo]);

  const PlainTextField = (props) => {
    return (
      <Box mb={props.spacing || 1}>
        <CssTextField
          error={props.error || ''}
          value={props.value}
          name={props.name}
          label={props.label}
          type={props.type}
          disabled={props.disabled}
          variant="outlined"
          size="small"
          fullWidth
          onChange={props.onChange || onFieldChange}
        />
      </Box>
    );
  };

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  const authFields = () => {
    return (
      <>
        <FormHelperText error={true} style={{ textAlign: 'center' }}>
          {emailErrorMessage}
        </FormHelperText>
        {PlainTextField({
          error: emailError,
          value: userInfo.email,
          name: 'email',
          label:
            (store.profile.socialMedia !== 'NULL'
              ? toTitleCase(store.profile.socialMedia) + ' '
              : '') + 'Email',
          disabled: store.profile.socialMedia !== 'NULL',
        })}
        {store.profile.socialMedia === 'NULL' && <></>}
      </>
    );
  };
  const noAuthFields = (spacing) => {
    return (
      <>
        {/* {PlainTextField({
          value: userInfo.firstName,
          name: 'firstName',
          label: 'First Name',
          spacing: spacing,
        })}
        {PlainTextField({
          value: userInfo.lastName,
          name: 'lastName',
          label: 'Last Name',
          spacing: spacing,
        })}
        {PlainTextField({
          value: userInfo.phoneNum,
          name: 'phoneNum',
          label: 'Phone Number',
          spacing: spacing,
        })}
        <FormHelperText error={true} style={{ textAlign: 'center' }}>
          {emailErrorMessage}
        </FormHelperText>
        {PlainTextField({
          error: emailError,
          value: userInfo.email,
          name: 'email',
          label: 'Email',
          spacing: spacing,
        })} */}

        <Box mb={0.5} />
        <FormHelperText style={{ textAlign: 'center' }}>
          Minimum eight and maximum thirty-two characters, at least one capital
          letter and one number:
        </FormHelperText>
        <Box mb={spacing || 1}>
          <CssTextField
            error={passwordError}
            label="Password"
            type="password"
            InputProps={{ disableUnderline: true }}
            InputLabelProps={{
              classes: {
                root: classes.labelRoot,
              },
            }}
            style={{
              background: '#FFFFFF 0% 0% no-repeat padding-box',
              border: '1px solid #00000028',
              width: '400px',
              borderRadius: '18px',
              opacity: 1,
            }}
            onChange={onPasswordChange}
          />
        </Box>
        <Box mb={spacing || 1}>
          <CssTextField
            error={confirmPasswordError}
            name="confirm"
            label="Confirm Password"
            type="password"
            InputProps={{ disableUnderline: true }}
            InputLabelProps={{
              classes: {
                root: classes.labelRoot,
              },
            }}
            style={{
              background: '#FFFFFF 0% 0% no-repeat padding-box',
              border: '1px solid #00000028',
              width: '400px',
              borderRadius: '18px',
              opacity: 1,
            }}
            onChange={onPasswordChange}
          />
        </Box>
        <Box mt={3}>
          <FormHelperText error={true} style={{ textAlign: 'center' }}>
            {signUpErrorMessage}
          </FormHelperText>
          <Button
            className={classes.button}
            variant="contained"
            color="paragraphText"
            onClick={onSubmit}
            style={{
              color: 'white',
              width: '300px',
              background: '#FF8500 0% 0% no-repeat padding-box',
              borderRadius: '14px',
              opacity: 1,
              marginBottom: '2%',
            }}
          >
            Sign Up
          </Button>
        </Box>
      </>
    );
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#E0E6E6',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#E0E6E6',
            marginLeft: '5%',
          }}
        >
          <div>
            <h1
              style={{
                textDecoration: 'underline',
                color: appColors.secondary,
              }}
            >
              Order Confirmed
            </h1>
          </div>
          <div style={{ textAlign: 'justify', fontSize: '18px' }}>
            <p>
              If we have question, we will contact you at:{' '}
              <strong>{updatedProfile.email}</strong>
            </p>
            <p>
              Your order will be delivered on:{' '}
              <strong>{store.expectedDelivery} </strong>
            </p>
            <p>
              To your address:{' '}
              <strong>
                {updatedProfile.address},&nbsp;{updatedProfile.city},&nbsp;
                {updatedProfile.state}
                &nbsp;
                {updatedProfile.zip}
              </strong>{' '}
            </p>
            <Box>
              <MapComponent
                latitude={updatedProfile.latitude}
                longitude={updatedProfile.longitude}
              />
            </Box>
          </div>
          <div>
            <h2
              style={{
                textDecoration: 'underline',
                color: appColors.secondary,
                marginTop: '25%',
              }}
            >
              What to expect
            </h2>
          </div>
          <div style={{ textAlign: 'justify', fontSize: '18px' }}>
            <p>
              {' '}
              If you have ordered with us before, please put out your old box
              out before 9am.
            </p>
          </div>
          <Box style={{ marginBottom: '1rem', justifyContent: 'center' }}>
            {' '}
            <Box hidden={auth.isAuth}>
              <div>
                <h2
                  style={{
                    textDecoration: 'underline',
                    color: appColors.secondary,
                  }}
                >
                  You are so close to unlocking the full potential of Serving
                  Fresh
                </h2>
              </div>
              <div
                style={{
                  textAlign: 'center',
                  alignItems: 'center',
                  fontSize: '18px',
                }}
              >
                <p>Sign Up via Social Media</p>
                <SocialLogin />
                <p>
                  Or Create a password to make Login easier <br></br> keep track
                  of your purchases
                </p>
                <Box>
                  <form onSubmit={onSubmit}>
                    {auth.isAuth ? authFields() : noAuthFields(2)}
                  </form>
                </Box>
              </div>
            </Box>
            <Box style={{ marginBottom: '1rem', alignContent: 'center' }}>
              <Button
                href="/store"
                variant="contained"
                type="submit"
                style={{
                  color: 'white',
                  width: '300px',
                  marginBottom: '5%',
                  background: '#FF8500 0% 0% no-repeat padding-box',
                  borderRadius: '14px',
                  opacity: 1,
                }}
              >
                Return to store
              </Button>
            </Box>
          </Box>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
