import React, {Component, useState, useContext, useEffect} from "react";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import Cookies from "js-cookie";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import {Grid, Paper, Button, Typography} from "@material-ui/core";
import {withStyles} from "@material-ui/styles";
import {sizing} from "@material-ui/system";
import {AuthContext} from "../auth/AuthContext";
import {withRouter} from "react-router";
import RevenueHighchart from "./farm/RevenueHighchart";

const API_URL =
	"https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/";

function AdminLogin(props) {
	const [emailValue, setEmail] = useState("");
	const [passwordValue, setPassword] = useState("");
	const [errorValue, setError] = useState(false);
	const [error, RaiseError] = useState(null);

	const Auth = useContext(AuthContext);

    useEffect(() => {
        if(process.env.REACT_APP_APPLE_CLIENT_ID && process.env.REACT_APP_APPLE_REDIRECT_URI){
            window.AppleID.auth.init({
                clientId : process.env.REACT_APP_APPLE_CLIENT_ID,
                scope : 'email',
                redirectURI : process.env.REACT_APP_APPLE_REDIRECT_URI,
            });
        }
        let queryString = props.location.search;
        let urlParams = new URLSearchParams(queryString);
        // Clear Query parameters
        window.history.pushState({}, document.title, window.location.pathname);
        // Successful Log in with Apple, set cookies, context, redirect
        if(urlParams.has('id')) {
            let customerId = urlParams.get('id');
            document.cookie = 'customer_uid=' + customerId;
            Auth.setIsAuth(true);
            Cookies.set('login-session', 'good');
            props.history.push("/admin");
        }
        // Log which media platform user should have signed in with instead of Apple
        // May eventually implement to display the message for which platform to Login
        else if(urlParams.has('media')) {
            console.log(urlParams.get('media'));
        }
    }, []);

    const handleEmailChange = (e) => {
        // console.log('email is changing')
        setEmail(e.target.value)
    }
    const handlePasswordChange = (e) => {
        // console.log('password is changing')
        setPassword(e.target.value)
    }
    const verifyLoginInfo = (e) => {
        //Attempt to login
        // Get salt for account
        axios
        .post(API_URL + 'AccountSalt',{
            // params: {
                email: emailValue,
            // }
        })
        .then((res) => {
            // console.log(emailValue, passwordValue);
            let saltObject = res;
            // console.log(saltObject);//, saltObject.data.code, saltObject.data.code !== 200, !(saltObject.data.code && saltObject.data.code !== 200));
            if(!(saltObject.data.code && saltObject.data.code !== 280)) {
                let hashAlg = saltObject.data.result[0].password_algorithm;
                let salt = saltObject.data.result[0].password_salt;
                // let salt = "cec35d4fc0c5e83527f462aeff579b0c6f098e45b01c8b82e311f87dc6361d752c30293e27027653adbb251dff5d03242c8bec68a3af1abd4e91c5adb799a01b";
                if (hashAlg != null && salt != null) {
                    // Make sure the data exists
                    if(hashAlg !== '' && salt !== '') {
                        // Rename hash algorithm so client can understand
                        switch(hashAlg) {
                            case 'SHA512':
                                hashAlg = 'SHA-512';
                                break;
                            default:
                                break;
                        }
                        // console.log(hashAlg);
                        // Salt plain text password
                        let saltedPassword = passwordValue + salt;
                        // console.log(saltedPassord);
                        // Encode salted password to prepare for hashing
                        const encoder = new TextEncoder();
                        const data = encoder.encode(saltedPassword);
                        //Hash salted password
                        crypto.subtle.digest(hashAlg,data)
                        .then((res) => {
                            let hash = res;
                            // Decode hash with hex digest
                            let hashArray = Array.from(new Uint8Array(hash));
                            let hashedPassword = hashArray.map(byte => { return byte.toString(16).padStart(2, '0')}).join('');
                            // console.log(hashedPassword);
                            let loginObject = {
                                email: emailValue,
                                password: hashedPassword,
                                social_id: '',
                                signup_platform: ''
                            }
                            // console.log(JSON.stringify(loginObject))
                            axios
                            .post(API_URL + 'Login',loginObject,{
                                headers: {
                                    'Content-Type': 'text/plain'
                                }
                            })
                            .then((res) => {
                                console.log(res)
                                if(res.data.code === 200) {
                                    console.log('Login success')
                                    let customerInfo = res.data.result[0];
                                    // console.log('cookie',document.cookie)
                                    document.cookie = 'customer_uid=' + customerInfo.customer_uid;
                                    // console.log('cookie',document.cookie)
                                    Auth.setIsAuth(true);
                                    Cookies.set("login-session", "good");
                                    props.history.push("/admin");
                                } else if (res.data.code === 406 || res.data.code === 404){
                                    console.log('Invalid credentials')
                                } else if (res.data.code === 401) {
                                    console.log('Need to log in by social media')
                                } else {
                                    console.log('Unknown login error')
                                }
                            })
                            .catch((err) => {
                                // Log error for Login endpoint
                                if(err.response) {
                                    console.log(err.response);
                                }
                                console.log(err);
                            })
                        })
                    }
                } else {
                    // No hash/salt information, probably need to sign in by socail media
                    console.log('Salt not found')
                    // Try to login anyway to confirm
                    let loginObject = {
                        email: emailValue,
                        password: 'test',
                        token: '',
                        signup_platform: ''
                    }
                    // console.log(JSON.stringify(loginObject))
                    axios
                    .post(API_URL + 'Login',loginObject,{
                        headers: {
                            'Content-Type': 'text/plain'
                        }
                    })
                    .then((res) => {
                        console.log(res)
                        if (res.data.code === 401) {
                            console.log('Need to log in by social media')
                        } else {
                            console.log('Unknown login error')
                        }
                    })
                    .catch((err) => {
                        // Log error for Login endpoint
                        if(err.response) {
                            console.log(err.response);
                        }
                        console.log(err);
                    })
                }
            } else {
                // No information, probably because invalid email
                console.log('Invalid credentials')
            }
        })
        .catch((err) => {
            // Log error for account salt endpoint
            if(err.response) {
                console.log(err.response)
            }
            console.log(err);
        })
    }

    const responseGoogle = (response) => {
        console.log(response);
        if (response.profileObj) {
            console.log("Google login successful");
            let email = response.profileObj.email;
            let accessToken = response.accessToken;
            let socialId = response.googleId;
            _socialLoginAttempt(email,accessToken,socialId,'GOOGLE');
        } else {
            console.log('Google login unsuccessful')
        }
    }

    const responseFacebook = (response) => {
        console.log(response);
        if (response.email) {
            console.log("Facebook login successful");
            let email = response.email;
            let accessToken = response.accessToken;
            let socialId = response.id;
            _socialLoginAttempt(email,accessToken,socialId,'FACEBOOK');
        } else {
            console.log('Facebook login unsuccessful')
        }
    }

    const _socialLoginAttempt = (email, accessToken, socialId, platform) => {
        axios
        .post('https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/Login/',{
            email: email,
            password: '',
            social_id: socialId,
            signup_platform: platform,
        })
        .then((res) => {
            console.log(res);
            if(!(res.data.code && res.data.code !== 200)) {
                let customerInfo = res.data.result[0];
                console.log(customerInfo);
                // console.log('cookie',document.cookie)
                document.cookie = 'customer_uid=' + customerInfo.customer_uid;
                // console.log('cookie',document.cookie)
                Auth.setIsAuth(true);
                Cookies.set('login-session', 'good');
                // Successful log in, Try to update tokens, then log in
                axios
                .post('https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/token_fetch_update/update_web',{
                    uid: customerInfo.customer_uid,
                    user_access_token: accessToken,
                    user_refresh_token: 'FALSE',
                })
                .then((res) => {
                    console.log(res);
                    props.history.push("/admin");
                })
                .catch((err) => {
                    if(err.response) {
                        console.log(err.response);
                    }
                    console.log(err);
                    props.history.push("/admin");
                })
            } else if(res.data.code === 404) {
                props.history.push("/socialsignup",{
                    email: email, 
                    accessToken: accessToken,
                    socialId: socialId,
                    platform: platform,    
                });
            }
        })
        .catch((err) => {
            if(err.response) {
                console.log(err.response);
            }
            console.log(err);
        })
    }

	const handleSignup = () => {
		props.history.push("/signup");
	};

	return (
		<div>
			<Paper style={paperStyle} elevation={3}>
				<Grid
					container
					spacing={5}
					justify={"center"}
					direction="column"
					style={{marginTop: "20px"}}
				>
					<Grid item xs={12}>
						<FacebookLogin
							appId="257223515515874"
							autoLoad={false}
							fields="name,email,picture"
							onClick="return false"
							callback={responseFacebook}
							size="small"
							textButton="Continue with FB"
						/>
					</Grid>
					<Grid item xs={12}>
						<GoogleLogin
							clientId="478982641106-1pq9nhdubrcpnii3ms0rmdpa0kmcjhgj.apps.googleusercontent.com"
							buttonText="Continue with Google"
							onSuccess={responseGoogle}
							onFailure={responseGoogle}
							isSignedIn={false}
							disable={false}
							cookiePolicy={"single_host_origin"}
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
					<Grid item xs={12}>
						<h3>Admin Login</h3>
					</Grid>
					<Grid item xs={12}>
						<TextField
							error={errorValue}
							id="outlined-required"
							label="email"
							variant="outlined"
							value={emailValue}
							onChange={handleEmailChange}
							style={{width: "75%"}}
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
							style={{width: "75%"}}
						/>
					</Grid>
					<Grid item xs={12}>
						{errorValue && (
							<Typography style={{color: "red"}}>Invalid login</Typography>
						)}
					</Grid>
					<Grid item xs={12}>
						<Button onClick={verifyLoginInfo}>Login</Button>
						<Button style={{marginLeft: "20px"}} onClick={handleSignup}>
							Sign Up
						</Button>
					</Grid>
				</Grid>
			</Paper>
		</div>
	);
}

const paperStyle = {
	height: "700px",
	width: "80%",
	maxWidth: "500px",
	textAlign: "center",
	display: "inline-block",
	padding: "10px",
	marginTop: "50px",
	backgroundColor: "white",
};

export default withRouter(AdminLogin);
