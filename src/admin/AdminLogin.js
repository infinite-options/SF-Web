import React, { Component, useState, useContext, useEffect } from 'react';
import FacebookLogin from 'react-facebook-login';
import FacebookIcon from '@material-ui/icons/Facebook';
import GoogleLogin from 'react-google-login';
import Cookies from 'js-cookie';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import { Grid, Paper, Button, Typography, Box } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { sizing } from '@material-ui/system';
import { AuthContext } from '../auth/AuthContext';
import { withRouter } from 'react-router';
import RevenueHighchart from './farm/RevenueHighchart';
import appColors from '../styles/AppColors';

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: appColors.secondary,
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: appColors.secondary,
      },
    },
  },
})(TextField);

const API_URL =
  'https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/';

function AdminLogin(props) {
  const [emailValue, setEmail] = useState('');
  const [passwordValue, setPassword] = useState('');
  const [errorValue, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

	const Auth = useContext(AuthContext);

    useEffect(() => {
        if(process.env.REACT_APP_APPLE_CLIENT_ID && process.env.REACT_APP_APPLE_REDIRECT_URI){
            window.AppleID.auth.init({
                clientId : process.env.REACT_APP_APPLE_CLIENT_ID,
                scope : 'email',
                redirectURI : process.env.REACT_APP_APPLE_REDIRECT_URI,
            });
        }
        // Note: search query parameters used for Apple Login
        let queryString = props.location.search;
        let urlParams = new URLSearchParams(queryString);
        // Clear Query parameters
        window.history.pushState({}, document.title, window.location.pathname);
        // console.log(props,urlParams)
        // Successful Log in with Apple, set cookies, context, redirect
        if(urlParams.has('id')) {
            let customerId = urlParams.get('id');
            Auth.setIsAuth(true);
            Cookies.set('login-session', 'good');
            Cookies.set('customer_uid',customerId)
            axios
            .get('https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/Profile/' + customerId)
            .then((response) => {
              console.log('Account:', response);
              let newAccountType = response.data.result[0].role.toLowerCase();
              switch (newAccountType) {
                case 'admin':
                    Auth.setAuthLevel(2);
                    props.history.push('/admin');
                    break;
                case 'farmer':
                    Auth.setAuthLevel(1);
                    props.history.push('/store');
                    break;
                case 'customer':
                    Auth.setAuthLevel(0);
                    props.history.push('/store');
                    break;
                // Farmer roles are moving towared business Id string
                default:
                    Auth.setAuthLevel(0);
                    props.history.push('/admin');
              }
            })
            .catch((err) => {
              console.log(err.response || err);
            });
            props.history.push("/admin");
        }
        // Log which media platform user should have signed in with instead of Apple
        // May eventually implement to display the message for which platform to Login
        else if(urlParams.has('media')) {
            console.log(urlParams.get('media'));
        }
    }, []);

  useEffect(() => {
    if (
      process.env.REACT_APP_APPLE_CLIENT_ID &&
      process.env.REACT_APP_APPLE_REDIRECT_URI
    ) {
      window.AppleID.auth.init({
        clientId: process.env.REACT_APP_APPLE_CLIENT_ID,
        scope: 'email',
        redirectURI: process.env.REACT_APP_APPLE_REDIRECT_URI,
      });
    }
    let queryString = props.location.search;
    let urlParams = new URLSearchParams(queryString);
    // Clear Query parameters
    window.history.pushState({}, document.title, window.location.pathname);
    console.log(props, urlParams);
    // Successful Log in with Apple, set cookies, context, redirect
    if (urlParams.has('id')) {
      let customerId = urlParams.get('id');
      Auth.setIsAuth(true);
      Cookies.set('login-session', 'good');
      Cookies.set('customer_uid',customerId)
      props.history.push('/admin');
    }
    // Log which media platform user should have signed in with instead of Apple
    // May eventually implement to display the message for which platform to Login
    else if (urlParams.has('media')) {
      console.log(urlParams.get('media'));
    }
  }, []);

  const handleEmailChange = (e) => {
    // console.log('email is changing')
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    // console.log('password is changing')
    setPassword(e.target.value);
  };
  const verifyLoginInfo = (e) => {
    //Attempt to login
    // Get salt for account
    axios
      .post(API_URL + 'AccountSalt', {
        // params: {
        email: emailValue,
        // }
      })
      .then((res) => {
        // console.log(emailValue, passwordValue);
        let saltObject = res;
        if (saltObject.data.code === 200) {
          let hashAlg = saltObject.data.result[0].password_algorithm;
          let salt = saltObject.data.result[0].password_salt;
          // let salt = "cec35d4fc0c5e83527f462aeff579b0c6f098e45b01c8b82e311f87dc6361d752c30293e27027653adbb251dff5d03242c8bec68a3af1abd4e91c5adb799a01b";
          if (hashAlg != null && salt != null) {
            // Make sure the data exists
            if (hashAlg !== '' && salt !== '') {
              // Rename hash algorithm so client can understand
              switch (hashAlg) {
                case 'SHA512':
                  hashAlg = 'SHA-512';
                  break;
                default:
                  break;
              }
              // console.log(hashAlg);
              // Salt plain text password
              let saltedPassword = passwordValue + salt;
              // console.log(saltedPassword);
              // Encode salted password to prepare for hashing
              const encoder = new TextEncoder();
              const data = encoder.encode(saltedPassword);
              //Hash salted password
              crypto.subtle.digest(hashAlg, data).then((res) => {
                let hash = res;
                // Decode hash with hex digest
                let hashArray = Array.from(new Uint8Array(hash));
                let hashedPassword = hashArray
                  .map((byte) => {
                    return byte.toString(16).padStart(2, '0');
                  })
                  .join('');
                console.log(hashedPassword);
                let loginObject = {
                  email: emailValue,
                  password: hashedPassword,
                  social_id: '',
                  signup_platform: '',
                };
                console.log(JSON.stringify(loginObject));
                axios
                  .post(API_URL + 'Login', loginObject, {
                    headers: {
                      'Content-Type': 'text/plain',
                    },
                  })
                  .then((res) => {
                    console.log(res);
                    if (res.data.code === 200) {
                      setError('');
                      console.log('Login success');
                      let customerInfo = res.data.result[0];
                      Auth.setIsAuth(true);
                      Cookies.set('login-session', 'good');
                      Cookies.set('customer_uid', customerInfo.customer_uid);
                      let newAccountType = customerInfo.role.toLowerCase();
                      switch (newAccountType) {
                        case 'admin':
                          Auth.setAuthLevel(2);
                          props.history.push('/admin');
                          break;
                        case 'farmer':
                          Auth.setAuthLevel(1);
                          props.history.push('/store');
                          break;
                        case 'customer':
                          Auth.setAuthLevel(0);
                          props.history.push('/store');
                          break;
                        // Farmer roles are moving towared business Id string
                        default:
                          Auth.setAuthLevel(1);
                          props.history.push('/store');
                          break;
                      }
                    } else if (res.data.code === 406 || res.data.code === 404) {
                      console.log('Invalid credentials');
                      setError('credential');
                      setErrorMessage('Invalid credentials');
                    } else if (res.data.code === 401) {
                      console.log('Need to log in by social media');
                      setError('social');
                      setErrorMessage(res.data.message);
                    } else if (res.data.code === 407) {
                      console.log('Need email verification');
                      setError('email_verify');
                      axios
                        .post(
                          'https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/email_verification',
                          { email: emailValue },
                          {
                            headers: {
                              'Content-Type': 'text/plain',
                            },
                          }
                        )
                        .then((res) => {
                          console.log(res);
                          setErrorMessage(
                            'Email not verified. Check your email to get link for verification.'
                          );
                        })
                        .catch((err) => {
                          setErrorMessage('Email not verified.');
                          if (err.response) {
                            console.log(err.response);
                          }
                          console.log(err);
                        });
                    } else {
                      console.log('Unknown login error');
                      setError('unknown');
                      setErrorMessage(res.data.message);
                    }
                  })
                  .catch((err) => {
                    // Log error for Login endpoint
                    if (err.response) {
                      console.log(err.response);
                    }
                    console.log(err);
                  });
              });
            }
          } else {
            // No hash/salt information, probably need to sign in by socail media
            console.log('Salt not found');
            // Try to login anyway to confirm
            let loginObject = {
              email: emailValue,
              password: 'test',
              token: '',
              signup_platform: '',
            };
            // console.log(JSON.stringify(loginObject))
            axios
              .post(API_URL + 'Login', loginObject, {
                headers: {
                  'Content-Type': 'text/plain',
                },
              })
              .then((res) => {
                console.log(res);
                if (res.data.code === 404) {
                  console.log('Invalid credentials');
                  setError('credential');
                  setErrorMessage('Invalid credentials');
                } else {
                  console.log('Unknown login error');
                  setError('unknown');
                  setErrorMessage('Login failed, try again');
                }
              })
              .catch((err) => {
                // Log error for Login endpoint
                if (err.response) {
                  console.log(err.response);
                }
                console.log(err);
              });
          }
        } else if (res.data.code === 401) {
          console.log('Use Social Login');
          setError('social');
          let socialMediaUsed = res.data.result[0].user_social_media;
          let socialMediaUsedFormat =
            socialMediaUsed.charAt(0) + socialMediaUsed.slice(1).toLowerCase();
          let newErrorMessage = 'Use ' + socialMediaUsedFormat + ' to login';
          setErrorMessage(newErrorMessage);
        } else if (res.data.code === 401) {
          // No information, probably because invalid email
          console.log('Invalid credentials');
          setError('credential');
        } else {
          console.log('Unknown log in error');
          setError('Log in failed, try again');
        }
      })
      .catch((err) => {
        // Log error for account salt endpoint
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };

  const responseGoogle = (response) => {
    console.log(response);
    if (response.profileObj) {
      console.log('Google login successful');
      let email = response.profileObj.email;
      let accessToken = response.accessToken;
      let socialId = response.googleId;
      _socialLoginAttempt(email, accessToken, socialId, 'GOOGLE');
    } else {
      console.log('Google login unsuccessful');
    }
  };

  const responseFacebook = (response) => {
    console.log(response);
    if (response.email) {
      console.log('Facebook login successful');
      let email = response.email;
      let accessToken = response.accessToken;
      let socialId = response.id;
      _socialLoginAttempt(email, accessToken, socialId, 'FACEBOOK');
    } else {
      console.log('Facebook login unsuccessful');
    }
  };

  const _socialLoginAttempt = (email, accessToken, socialId, platform) => {
    axios
      .post(
        'https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/Login/',
        {
          email: email,
          password: '',
          social_id: socialId,
          signup_platform: platform,
        }
      )
      .then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          let customerInfo = res.data.result[0];
          // Successful log in, Try to update tokens, then continue to next page based on role
          axios
            .post(
              'https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/token_fetch_update/update_web',
              {
                uid: customerInfo.customer_uid,
                user_access_token: accessToken,
                user_refresh_token: 'FALSE',
              }
            )
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              if (err.response) {
                console.log(err.response);
              }
              console.log(err);
            })
            .finally(() => {
              console.log(customerInfo);
              Cookies.set('login-session', 'good');
              Cookies.set('customer_uid', customerInfo.customer_uid);
              Auth.setIsAuth(true);
              let newAccountType = customerInfo.role.toLowerCase();
              switch (newAccountType) {
                case 'admin':
                  Auth.setAuthLevel(2);
                  props.history.push('/admin');
                  break;
                case 'farmer':
                  Auth.setAuthLevel(1);
                  props.history.push('/admin');
                  break;
                case 'customer':
                  Auth.setAuthLevel(0);
                  props.history.push('/store');
                  break;
                // Farmer roles are moving towared business Id string
                default:
                  Auth.setAuthLevel(1);
                  props.history.push('/admin');
                  break;
              }
            });
        } else if (res.data.code === 404) {
          props.history.push('/socialsignup', {
            email: email,
            accessToken: accessToken,
            socialId: socialId,
            platform: platform,
          });
        } else if (res.data.code === 411) {
          console.log('Wrong social media');
          setError('social');
          let startIndex = res.data.message.indexOf("'");
          startIndex += 1;
          let endIndex = res.data.message.indexOf("'", startIndex + 1);
          let socialMediaUsed = res.data.message.slice(startIndex, endIndex);
          console.log(socialMediaUsed);
          let socialMediaUsedFormat =
            socialMediaUsed.charAt(0) + socialMediaUsed.slice(1).toLowerCase();
          let newErrorMessage = 'Use ' + socialMediaUsedFormat + ' to login';
          setErrorMessage(newErrorMessage);
        } else if (res.data.code === 406) {
          console.log('Use Password Login');
          setError('social');
          setErrorMessage('Use email and password to log in');
        } else {
          console.log('Unknown log in error');
          setError('Log in failed, try again');
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };

  const handleSignup = () => {
    props.history.push('/signup');
  };

  const showError = () => {
    if (errorValue === '') {
      return null;
    }
    return <Typography style={{ color: 'red' }}>{errorMessage}</Typography>;
  };

  return (
    <div>
      <Paper style={paperStyle}>
        <Grid container spacing={1} xs={12}>
          <Grid item xs={12}>
            <Box
              my={1}
              style={{ fontSize: '20px', color: appColors.secondary }}
            >
              Log In
            </Box>
          </Grid>
          <Grid item xs={12}>
            <CssTextField
              error={errorValue}
              id="outlined-required"
              label="email"
              variant="outlined"
              size="small"
              value={emailValue}
              onChange={handleEmailChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <CssTextField
              error={errorValue}
              id="outlined-password-input"
              label="Password"
              type="password"
              variant="outlined"
              size="small"
              value={passwordValue}
              onChange={handlePasswordChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            {showError()}
          </Grid>
          <Grid item xs={12}>
            <Box mb={2}>
              <Button
                variant="contained"
                style={{
                  backgroundColor: appColors.secondary,
                  color: 'white',
                  width: '300px',
                  height: '40px',
                }}
                onClick={verifyLoginInfo}
              >
                Login
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box mb={2}>
              <Box>or</Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              isSignedIn={false}
              textButton="Continue with Google"
              disable={false}
              cookiePolicy={'single_host_origin'}
              style={{ borderRadius: '10px' }}
            />
          </Grid>
          <Grid item xs={12}>
            <FacebookLogin
              appId={process.env.REACT_APP_FACEBOOK_APP_ID}
              autoLoad={false}
              fields="name,email,picture"
              onClick="return false"
              callback={responseFacebook}
              size="small"
              textButton="Continue with Facebook"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={() => {
                window.AppleID.auth.signIn();
              }}
            >
              Apple Login
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

const paperStyle = {
  width: '500px',
  textAlign: 'center',
  display: 'inline-block',
  padding: '20px',
  marginTop: '50px',
  backgroundColor: appColors.componentBg,
};

export default withRouter(AdminLogin);
