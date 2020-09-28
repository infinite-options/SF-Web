import React, { Component, useState, useContext } from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import Cookies from 'js-cookie'
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import {Grid, Paper, Button, Typography} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { sizing } from '@material-ui/system';
import { AuthContext } from './AuthContext';

export default function AdminLogin(){
    const [emailValue, setEmail] = useState('');
    const [passwordValue, setPassword] = useState('');
    const [errorValue, setError] = useState(false);
    const [error, RaiseError] = useState(null);

    const Auth = useContext(AuthContext);

    const handleEmailChange = (e) => {
        console.log('email is changing')
        setEmail(e.target.value)
    }
    const handlePasswordChange = (e) => {
        console.log('password is changing')
        setPassword(e.target.value)
    }
    const SOCIAL_API = "https://dc3so1gav1.execute-api.us-west-1.amazonaws.com/dev/api/v2/social/";
    const verifyLoginInfo = (e) => {
        const SOCIAL_API = "https://dc3so1gav1.execute-api.us-west-1.amazonaws.com/dev/api/v2/social/";
        const LOGIN_API = "https://dc3so1gav1.execute-api.us-west-1.amazonaws.com/dev/api/v2/login";
        console.log('Email: ' + emailValue);
        console.log('Password: ' + passwordValue);
        const data = {
            "email": emailValue,
            "password": passwordValue,
        }
        //post request to see if user login credentials are correct
        axios.post(
            LOGIN_API, 
            data
        ).then(response => {
            console.log(response)
            if(response.data.auth_success === true){
                setError(false);
                console.log('Login successful')
                Auth.setIsAuth(true)
                Cookies.set('login-session', 'good')
                console.log(Auth.isAuth)
            }
        }).catch(err => {
            console.log(err)
            if(err.response.status === 400){
                console.log('User does not exist');
                setError(true);
            }
            if(err.response.status === 401){
                console.log('Invalid email or password');
                setError(true);
            }
        })
    }
    const responseFacebook = async response => {
        console.log(response)
        axios.get(
            SOCIAL_API,
            {
                params: {email: response.email}
            } 
        ).then(response => {
            console.log(response)
            if(response.data.auth_success === true){
                setError(false);
                console.log('Login successful')
                Auth.setIsAuth(true)
                Cookies.set('login-session', 'good')
                console.log(Auth.isAuth)
            }
        }).catch(err => {
            console.log(err)
            if(err.response.status === 400){
                console.log('User does not exist');
                setError(true);
            }
            if(err.response.status === 401){
                console.log('Invalid email or password');
                setError(true);
            }
        })
    }
    const responseGoogle = async response => {
        console.log(response)
        axios.get(
            SOCIAL_API,
            {
                params: {email: response.profileObj.email}
            } 
        ).then(response => {
            console.log(response)
            if(response.data.auth_success === true){
                setError(false);
                console.log('Login successful')
                Auth.setIsAuth(true)
                Cookies.set('login-session', 'good')
                console.log(Auth.isAuth)
            }
        }).catch(err => {
            console.log(err)
            if(err.response.status === 400){
                console.log('User does not exist');
                setError(true);
            }
            if(err.response.status === 401){
                console.log('Invalid email or password');
                setError(true);
            }
        })
    }
    
    
    return (
        <div>
            <Paper style={paperStyle} elevation={3} >
                <Grid container spacing={5} justify={"center"} direction="column" style={{marginTop: '20px'}}>
                    <Grid item xs={12}>
                    <FacebookLogin
                        appId='257223515515874'
                        autoLoad={false}
                        fields='name,email,picture'
                        onClick='return false'
                        callback={responseFacebook}
                        size='small'
                        textButton='Continue with FB'
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <GoogleLogin
                        clientId='478982641106-1pq9nhdubrcpnii3ms0rmdpa0kmcjhgj.apps.googleusercontent.com'
                        buttonText='Continue with Google'
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        isSignedIn={false}
                        disable={false}
                        cookiePolicy={"single_host_origin"}
                    />
                    </Grid>
                    <Grid item xs={12}>
                        <h3>Admin Login</h3>
                    </Grid> 
                    <Grid item xs={12}>
                        <TextField
                        error={errorValue}
                        id="outlined-required"
                        label="email"
                        defaultValue=""
                        variant="outlined"
                        value={emailValue}
                        onChange={handleEmailChange}
                        style ={{width: '75%'}}
                        />
                    </Grid> 
                    <Grid item xs={12}>
                        <TextField
                        error={errorValue}
                        id="outlined-password-input"
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={passwordValue}
                        onChange={handlePasswordChange}
                        style ={{width: '75%'}}
                        />
                    </Grid>
                    <Grid item xs={12}>
                    {errorValue && (
                        <Typography style={{color: 'red'}}>Invalid login</Typography>
                    )}
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={verifyLoginInfo}>
                            Login
                        </Button>
                    </Grid>
                </Grid>
            </Paper>               
        </div>
    )
}

const paperStyle = {
    height: '500px',
    width: '80%',
    maxWidth: '500px',
    textAlign: 'center',
    display: 'inline-block',
    padding: '10px',
    marginTop: '50px',
    backgroundColor: 'white',
};