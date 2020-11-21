import React, { Component, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { Grid, Paper, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { sizing } from '@material-ui/system';
const paperStyle = {
  height: '700px',
  width: '90%',
  textAlign: 'center',
  display: 'inline-block',
  padding: '10px',
  marginTop: '50px',
  backgroundColor: 'white',
};
export function FarmerSignUp() {
  const [emailValue, setEmail] = useState('');
  const [passwordValue, setPassword] = useState('');

  const handleEmailChange = (e) => {
    console.log('email is changing');
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    console.log('password is changing');
    setPassword(e.target.value);
  };
  const verifyLoginInfo = (e) => {
    // console.log('Email: ' + emailValue);
    // console.log('Password: ' + passwordValue);
  };
  return (
    <div>
      <Paper style={paperStyle} elevation={3}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <h2>Registration</h2>
          </Grid>
          <Grid item xs={9}></Grid>
          <Grid spacing={2} container xs={6}>
            <Grid item xs={6}>
              <TextField
                id="outlined-required"
                label="First Name"
                defaultValue=""
                variant="outlined"
                style={{ width: '75%' }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="outlined-required"
                label="Last Name"
                defaultValue=""
                variant="outlined"
                style={{ width: '75%' }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="outlined-required"
                label="Email"
                defaultValue=""
                variant="outlined"
                type="email"
                style={{ width: '75%' }}
              />
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}>
              <TextField
                id="outlined-required"
                label="Password"
                defaultValue=""
                variant="outlined"
                type="password"
                style={{ width: '75%' }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="outlined-required"
                label="Confirm Password"
                defaultValue=""
                variant="outlined"
                type="password"
                style={{ width: '75%' }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="outlined-required"
                label="Street"
                defaultValue=""
                variant="outlined"
                type="street"
                style={{ width: '75%' }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="outlined-required"
                label="City"
                defaultValue=""
                variant="outlined"
                type="city"
                style={{ width: '75%' }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="outlined-required"
                label="State"
                defaultValue=""
                variant="outlined"
                type="state"
                style={{ width: '75%' }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="outlined-required"
                label="Zipcode"
                defaultValue=""
                variant="outlined"
                type="zipcode"
                style={{ width: '75%' }}
              />
            </Grid>
          </Grid>
          <Grid spacing={2} container xs={6}>
            <Grid item xs={12}>
              <TextField
                id="outlined-required"
                label="Business Name"
                defaultValue=""
                variant="outlined"
                style={{ width: '75%' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="outlined-required"
                label="Description"
                defaultValue=""
                variant="outlined"
                type="description"
                style={{ width: '75%' }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default FarmerSignUp;
