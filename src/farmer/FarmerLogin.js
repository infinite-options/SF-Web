import React, { Component, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { Grid, Paper, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { sizing } from '@material-ui/system';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const paperStyle = {
  height: '500px',
  width: '450px',
  textAlign: 'center',
  display: 'inline-block',
  padding: '10px',
  marginTop: '50px',
  backgroundColor: 'white',
};
export function FarmerLogin() {
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
    console.log('Email: ' + emailValue);
    console.log('Password: ' + passwordValue);
  };
  return (
    <div>
      <Paper style={paperStyle} elevation={3}>
        <Grid
          container
          spacing={5}
          justify={'center'}
          direction="column"
          style={{ marginTop: '20px' }}
        >
          <Grid item xs={12}>
            <h3>Farmer Login</h3>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-required"
              label="email"
              defaultValue=""
              variant="outlined"
              value={emailValue}
              onChange={handleEmailChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-password-input"
              label="Password"
              type="password"
              variant="outlined"
              value={passwordValue}
              onChange={handlePasswordChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button onClick={verifyLoginInfo}>Login</Button>
          </Grid>
          <Grid item xs={5}>
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <Button size={'small'}>Create Account</Button>
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default FarmerLogin;
