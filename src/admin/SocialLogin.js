import React, { Component, useState, useContext, useEffect } from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Grid, Paper, Button, Typography, Box } from '@material-ui/core';
import { AuthContext } from '../auth/AuthContext';
import { withRouter } from 'react-router';

function SocialLogin(props) {
  const Auth = useContext(AuthContext);

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
      Cookies.set('customer_uid', customerId);
      props.history.push('/admin');
    }
    // Log which media platform user should have signed in with instead of Apple
    // May eventually implement to display the message for which platform to Login
    else if (urlParams.has('media')) {
      console.log(urlParams.get('media'));
    }
  }, []);

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
      .post(process.env.REACT_APP_SERVER_BASE_URI + 'Login/', {
        email: email,
        password: '',
        social_id: socialId,
        signup_platform: platform,
      })
      .then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          let customerInfo = res.data.result[0];
          // Successful log in, Try to update tokens, then continue to next page based on role
          axios
            .post(
              process.env.REACT_APP_SERVER_BASE_URI +
                'token_fetch_update/update_web',
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
          props.setError('social');
          let startIndex = res.data.message.indexOf("'");
          startIndex += 1;
          let endIndex = res.data.message.indexOf("'", startIndex + 1);
          let socialMediaUsed = res.data.message.slice(startIndex, endIndex);
          console.log(socialMediaUsed);
          let socialMediaUsedFormat =
            socialMediaUsed.charAt(0) + socialMediaUsed.slice(1).toLowerCase();
          let newErrorMessage = 'Use ' + socialMediaUsedFormat + ' to login';
          props.setErrorMessage(newErrorMessage);
        } else if (res.data.code === 406) {
          console.log('Use Password Login');
          props.setError('social');
          props.setErrorMessage('Use email and password to log in');
        } else {
          console.log('Unknown log in error');
          props.setError('Log in failed, try again');
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };

  return (
    <Grid container spacing={1} xs={12}>
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
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          isSignedIn={false}
          buttonText="Continue with Google"
          disable={false}
          cookiePolicy={'single_host_origin'}
          style={{ borderRadius: '10px' }}
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
  );
}

export default withRouter(SocialLogin);
