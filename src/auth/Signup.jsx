import React, { Component } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import { Box, Button } from '@material-ui/core';
import { withRouter } from 'react-router';
import Paper from '@material-ui/core/Paper';
import CssTextField from '../utils/CssTextField';
import appColors from '../styles/AppColors';
import SocialLogin from '../admin/SocialLogin';

class Signup extends Component {
  constructor(props) {
    super();
    this.state = {
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
    };
  }

  _onSubmit = (event) => {
    event.preventDefault();
    console.log('_onSubmit');
    console.log(this.state);
    if (
      this.state.password === this.state.confirmPassword &&
      this.state.password.length > 0
    ) {
      axios
        .get('https://dev.virtualearth.net/REST/v1/Locations/', {
          params: {
            CountryRegion: 'US',
            adminDistrict: this.state.state,
            locality: this.state.city,
            postalCode: this.state.zip,
            addressLine: this.state.address,
            key: process.env.REACT_APP_BING_LOCATION_KEY,
          },
        })
        .then((res) => {
          console.log(res);
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
              email: this.state.email,
              password: this.state.password,
              first_name: this.state.firstName,
              last_name: this.state.lastName,
              phone_number: this.state.phone,
              address: this.state.address,
              unit: this.state.unit,
              city: this.state.city,
              state: this.state.state,
              zip_code: this.state.zip,
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
                console.log(customerInfo);
                if (res.data.code === 200) {
                  axios
                    .post(
                      process.env.REACT_APP_SERVER_BASE_URI +
                        'email_verification',
                      { email: this.state.email },
                      {
                        headers: {
                          'Content-Type': 'text/plain',
                        },
                      }
                    )
                    .then((res) => {
                      this.setState({
                        message: 'success',
                      });
                      console.log(res);
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

  _onReset = () => {
    this.setState({
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: '',
      unit: '',
      state: '',
      zip: '',
    });
  };

  _emailChange = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  _passwordChange = (event) => {
    this.setState({
      password: event.target.value,
    });
  };

  _confirmPasswordChange = (event) => {
    this.setState({
      confirmPassword: event.target.value,
    });
  };

  _firstNameChange = (event) => {
    this.setState({
      firstName: event.target.value,
    });
  };

  _lastNameChange = (event) => {
    this.setState({
      lastName: event.target.value,
    });
  };

  _phoneChange = (event) => {
    this.setState({
      phone: event.target.value,
    });
  };

  _addressChange = (event) => {
    this.setState({
      address: event.target.value,
    });
  };

  _unitChange = (event) => {
    this.setState({
      unit: event.target.value,
    });
  };

  _cityChange = (event) => {
    this.setState({
      city: event.target.value,
    });
  };

  _stateChange = (event) => {
    this.setState({
      state: event.target.value,
    });
  };

  _zipChange = (event) => {
    this.setState({
      zip: event.target.value,
    });
  };

  render() {
    return (
      <Paper
        style={{
          width: 480,
          padding: 20,
          backgroundColor: appColors.componentBg,
          textAlign: 'center',
          display: 'inline-block',
        }}
      >
        <p style={{ color: appColors.secondary }}>SIGN UP</p>
        <form onSubmit={this._onSubmit}>
          <Box mb={1}>
            <CssTextField
              value={this.state.email}
              onChange={this._emailChange}
              label="Email"
              variant="outlined"
              size="small"
              fullWidth
            />
          </Box>
          <Box mb={1}>
            <CssTextField
              value={this.state.password}
              onChange={this._passwordChange}
              type="password"
              label="Password"
              variant="outlined"
              size="small"
              fullWidth
            />
          </Box>
          <Box mb={1}>
            <CssTextField
              value={this.state.confirmPassword}
              onChange={this._confirmPasswordChange}
              type="password"
              label="Confirm Password"
              variant="outlined"
              size="small"
              fullWidth
            />
          </Box>
          <Box display="flex" mb={1}>
            <CssTextField
              value={this.state.firstName}
              onChange={this._firstNameChange}
              label="First Name"
              variant="outlined"
              size="small"
              fullWidth
            />
            <Box m={0.5} />
            <CssTextField
              value={this.state.lastName}
              onChange={this._lastNameChange}
              label="Last Name"
              variant="outlined"
              size="small"
              fullWidth
            />
          </Box>
          <Box mb={1}>
            <CssTextField
              value={this.state.phone}
              onChange={this._phoneChange}
              label="Phone"
              variant="outlined"
              size="small"
              fullWidth
            />
          </Box>
          <Box mb={1}>
            <CssTextField
              value={this.state.address}
              onChange={this._addressChange}
              label="Address"
              variant="outlined"
              size="small"
              fullWidth
            />
          </Box>
          <Box display="flex" mb={1}>
            <CssTextField
              value={this.state.unit}
              onChange={this._unitChange}
              label="Unit"
              variant="outlined"
              size="small"
              fullWidth
            />
            <Box m={0.5} />
            <CssTextField
              value={this.state.city}
              onChange={this._cityChange}
              label="City"
              variant="outlined"
              size="small"
              fullWidth
            />
            <Box m={0.5} />
            <CssTextField
              value={this.state.state}
              onChange={this._stateChange}
              label="State"
              variant="outlined"
              size="small"
              fullWidth
            />
          </Box>
          <CssTextField
            value={this.state.zip}
            onChange={this._zipChange}
            label="Zip code"
            variant="outlined"
            size="small"
            fullWidth
          />
          <br />
          <br />
          <div>
            <Button
              variant="contained"
              type="submit"
              style={{
                backgroundColor: appColors.secondary,
                color: 'white',
              }}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              style={{
                marginLeft: '20px',
                backgroundColor: appColors.secondary,
                color: 'white',
              }}
              type="button"
              onClick={this._onReset}
            >
              Reset
            </Button>
          </div>
          {this.state.message === 'success' && (
            <div>
              Sign up successful. Please confirm sign up process by following
              link in your email.
            </div>
          )}
          <Box my={2}>
            <Box>or</Box>
          </Box>
          <SocialLogin />
        </form>
      </Paper>
    );
  }
}

export default withRouter(Signup);
