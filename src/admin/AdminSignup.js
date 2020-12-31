import React, { Component, useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { Box } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
// import Background from '../welcome-bg.png'
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router';
import axios from 'axios';

function Signup(props) {
  const [state, setState] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    unit: '',
    city: '',
    state: '',
    zip: '',
    message: '',
  });
  //   constructor(props) {
  //     super()
  //     this.state = {
  //       email: '',
  //       password: '',
  //       confirmPassword: '',
  //       firstName: '',
  //       lastName: '',
  //       phone: '',
  //       address: '',
  //       unit: '',
  //       city: '',
  //       state: '',
  //       zip: '',
  //       message: '',
  //     }
  //   }

  const _onSubmit = (event) => {
    event.preventDefault();
    // console.log('_onSubmit')
    // console.log(state);
    if (state.password === state.confirmPassword && state.password.length > 0) {
      axios
        .get('https://dev.virtualearth.net/REST/v1/Locations/', {
          params: {
            CountryRegion: 'US',
            adminDistrict: state.state,
            locality: state.city,
            postalCode: state.zip,
            addressLine: state.address,
            key: process.env.REACT_APP_BING_LOCATION_KEY,
          },
        })
        .then((res) => {
          // console.log(res)
          let locationApiResult = res.data;
          if (locationApiResult.statusCode === 200) {
            let locations = locationApiResult.resourceSets[0].resources;
            /* Possible improvement: choose better location in case first one not desired
             */
            let location = locations[0];
            let lat = location.geocodePoints[0].coordinates[0];
            let long = location.geocodePoints[0].coordinates[1];
            if (location.geocodePoints.length === 2) {
              lat = location.geocodePoints[1].coordinates[0];
              long = location.geocodePoints[1].coordinates[1];
            }
            let object = {
              email: state.email,
              password: state.password,
              first_name: state.firstName,
              last_name: state.lastName,
              phone_number: state.phone,
              address: state.address,
              unit: state.unit,
              city: state.city,
              state: state.state,
              zip_code: state.zip,
              latitude: lat.toString(),
              longitude: long.toString(),
              referral_source: 'WEB',
              role: 'CUSTOMER',
              social: 'FALSE',
              social_id: 'NULL',
              user_access_token: 'FALSE',
              user_refresh_token: 'FALSE',
              mobile_access_token: 'FALSE',
              mobile_refresh_token: 'FALSE',
            };
            console.log(JSON.stringify(object));
            axios
              .post(
                process.env.REACT_APP_SERVER_BASE_URI + 'createAccount',
                object,
                {
                  headers: {
                    'Content-Type': 'text/plain',
                  },
                }
              )
              .then((res) => {
                let customerInfo = res.data.result;
                // console.log(customerInfo);
                if (res.data.code === 200) {
                  axios
                    .post(
                      process.env.REACT_APP_SERVER_BASE_URI +
                        'email_verification',
                      { email: state.email },
                      {
                        headers: {
                          'Content-Type': 'text/plain',
                        },
                      }
                    )
                    .then((res) => {
                      setState((prevState) => ({
                        ...prevState,
                        message: 'success',
                      }));
                      // console.log(res);
                    })
                    .catch((err) => {
                      if (err.response) {
                        console.log(err.response);
                      }
                      console.log(err);
                    });
                }
              })
              .catch((err) => {
                console.log(err);
                if (err.response) {
                  console.log(err.response);
                }
              });
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response) {
            console.log(err.response);
          }
        });
    } else {
      console.log('Passwords not matching');
    }
  };

  const _onReset = () => {
    setState((prevState) => ({
      ...prevState,
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: '',
      unit: '',
      state: '',
      zip: '',
    }));
  };

  const _emailChange = (event) => {
    setState({
      ...state,
      email: event.target.value,
    });
  };

  const _passwordChange = (event) => {
    setState({
      ...state,
      password: event.target.value,
    });
  };

  const _confirmPasswordChange = (event) => {
    setState({
      ...state,
      confirmPassword: event.target.value,
    });
  };

  const _firstNameChange = (event) => {
    setState({
      ...state,
      firstName: event.target.value,
    });
  };

  const _lastNameChange = (event) => {
    setState({
      ...state,
      lastName: event.target.value,
    });
  };

  const _phoneChange = (event) => {
    setState({
      ...state,
      phone: event.target.value,
    });
  };

  const _addressChange = (event) => {
    setState({
      ...state,
      address: event.target.value,
    });
  };

  const _unitChange = (event) => {
    setState({
      ...state,
      unit: event.target.value,
    });
  };

  const _cityChange = (event) => {
    setState({
      ...state,
      city: event.target.value,
    });
  };

  const _stateChange = (event) => {
    setState({
      ...state,
      state: event.target.value,
    });
  };

  const _zipChange = (event) => {
    setState({
      ...state,
      zip: event.target.value,
    });
  };

  //   render() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      // style={{ backgroundImage: `url(${Background})` }}
    >
      <Paper
        style={{
          height: 700,
          width: 350,
          margin: 20,
          textAlign: 'center',
          display: 'inline-block',
        }}
      >
        <p>SIGN UP</p>
        <form onSubmit={_onSubmit}>
          <TextField
            value={state.email}
            onChange={_emailChange}
            label="Email"
          />
          <br />

          <TextField
            value={state.password}
            onChange={_passwordChange}
            type="password"
            label="Password"
          />
          <br />

          <TextField
            value={state.confirmPassword}
            onChange={_confirmPasswordChange}
            type="password"
            label="Confirm Password"
          />
          <br />

          <TextField
            value={state.firstName}
            onChange={_firstNameChange}
            label="First Name"
          />
          <br />
          <TextField
            value={state.lastName}
            onChange={_lastNameChange}
            label="Last Name"
          />
          <br />

          <TextField
            value={state.phone}
            onChange={_phoneChange}
            label="Phone"
          />
          <br />

          <TextField
            value={state.address}
            onChange={_addressChange}
            label="Address"
          />
          <br />

          <TextField value={state.unit} onChange={_unitChange} label="Unit" />
          <br />
          <TextField value={state.city} onChange={_cityChange} label="City" />
          <br />
          <TextField
            value={state.state}
            onChange={_stateChange}
            label="State"
          />
          <br />

          <TextField value={state.zip} onChange={_zipChange} label="Zip code" />
          <br />
          <br />
          <div>
            <Button
              variant="contained"
              type="submit"
              disabled={state.message === 'success'}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              style={{ marginLeft: '20px' }}
              type="button"
              disabled={state.message === 'success'}
              onClick={_onReset}
            >
              Reset
            </Button>
          </div>
          {state.message === 'success' && (
            <div>
              Sign up successful. Please confirm sign up process by following
              link in your email.
            </div>
          )}
        </form>
      </Paper>
    </Box>
  );
  //   }
}

export default withRouter(Signup);
