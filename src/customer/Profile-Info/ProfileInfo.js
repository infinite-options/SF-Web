import React, {useContext, useState} from 'react';
import {useHistory} from 'react-router-dom';

import { AuthContext } from 'auth/AuthContext';
import AuthUtils from '../../utils/AuthUtils';
import ProfileInfoNavBar from './ProfileInfoNavBar';
import {Box, Button, Typography, TextField, Avatar, Dialog} from '@material-ui/core';
import {withStyles, makeStyles} from '@material-ui/core/styles';
import appColors from '../../styles/AppColors';

import GoogleSignin from '../../sf-svg-icons/Google-signin.svg';
import FacebookSignin from '../../sf-svg-icons/Facebook-signin.svg';
import AppleSignin from '../../sf-svg-icons/Apple-signin.svg';
import Background from '../../icon/Rectangle.svg';

import AdminLogin from '../../auth/AdminLogin';
import Signup from '../../auth/Signup';
import Footer from '../../home/Footer';

import Cookies from 'js-cookie';

// Donovan_0521 empty commit

const useStyles = makeStyles((theme) => ({
    profileInfoContainer: {
        display: 'flex',
        flexDirection: 'column',
        background: `transparent url(${Background}) 0% 0% no-repeat padding-box`,
    },

    profileContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    pageLabel: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: 'rgb(47, 120, 127)',
        textAlign: 'left',
        textDecoration: 'underline',
        marginLeft: theme.spacing(6),
        marginTop: theme.spacing(6),
    },

    currUserInf: {
        display: 'flex',
        flexDirection: 'column',

        [theme.breakpoints.down('md')]: {
            width: '40%',
        },

        [theme.breakpoints.up('lg')]: {
            width: '30%',
        },
    },

    currUserPic: {
        width: theme.spacing(12),
        height: theme.spacing(12),
    },

    profileEditField: {
        borderRadius: '10px',
        marginTop: theme.spacing(1),
        width: '100%',
        background: 'white',
    },

    resetPasswordLink: {
        display: 'inline-block',
        textDecoration: 'underline',
        color: '#A0A0A0',
        fontSize: '17px',
        marginTop: '10px',
        '&:hover': {
            cursor: 'pointer',
        },
    },

    socialSigninWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },

    profInfButtonContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    profInfButton: {
        marginTop: theme.spacing(3),
        width: '75%',
        height: '50px',
        color: 'primary',
        background: '#e88330',
        color: 'white',
        borderRadius: '10px',
    },

    servingFreshSupportMessage: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(12),
    },

    supportLink: {
        color: '#e88330',
        textDecoration: 'none',
    },
}));

const ColorButton = withStyles(() => ({
    root: {
        color: 'white',
        backgroundColor: appColors.primary,
        '&:hover': {
        backgroundColor: 'rgb(162, 91, 33)',
        },
    },
}))(Button);

function ProfileInfo() {
    const classes = useStyles();
    const history = useHistory();
    const Auth = React.useContext(AuthContext);
    const {profile, setProfile, isAuth, setIsAuth, setAuthLevel, cartTotal} = Auth;
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    const [resetPasswordClicked, setResetPasswordClicked] = React.useState(false);
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmedPassword, setConfirmedPassword] = React.useState('');

    console.log('newPassword = ', newPassword);
    console.log('confirmPass = ', confirmedPassword);
    console.log('profile = ', profile);

    const loginTypeMapping = {
        'NULL': (
            <Box>
                <Typography
                    className =  {classes.resetPasswordLink}
                    onClick = {() => setResetPasswordClicked(!resetPasswordClicked)}
                >
                    Reset Password
                </Typography>
            </Box>
        ),
        'GOOGLE': (
            <Box className = {classes.socialSigninWrapper}>
                <img height = '60px' src = {GoogleSignin} />
            </Box>
        ),
        'FACEBOOK': (
            <Box className = {classes.socialSigninWrapper}>
                <img height = '60px' src = {FacebookSignin} />
            </Box>
        ),
        'APPLE': (
            <Box className = {classes.socialSigninWrapper}>
                <img height = '60px' src = {AppleSignin} />
            </Box>
        ),
    }

    React.useEffect(() => {
        console.warn('In useEffect');
        if (Auth.isAuth) {
          const AuthMethods = new AuthUtils();
          AuthMethods.getProfile().then((authRes) => {
              console.warn('AuthRes = ', authRes);
            const updatedProfile = {
              email: authRes.customer_email,
              firstName: authRes.customer_first_name,
              lastName: authRes.customer_last_name,
              pushNotifications:
                authRes.cust_notification_approval === 'TRUE' ? true : false,
              phoneNum: authRes.customer_phone_num,
              address: authRes.customer_address,
              unit: authRes.customer_unit,
              city: authRes.customer_city,
              state: authRes.customer_state,
              zip: authRes.customer_zip,
              deliveryInstructions: '',
              referralSource: authRes.referral_source,
              role: authRes.role,
              latitude: authRes.customer_lat,
              longitude: authRes.customer_long,
              zone: '',
              socialMedia: authRes.user_social_media || '',
              socialID: authRes.social_id || '',
              userAccessToken: authRes.userAccessToken,
              userRefreshToken: authRes.userRefreshToken,
              mobileAccessToken: authRes.mobile_access_token,
              mobileRefreshToken: authRes.mobile_refresh_token,
              hashed_pwd: authRes.password_hashed,
            };

            setProfile(updatedProfile);
          });
        } else {
          const guestProfile = JSON.parse(localStorage.getItem('guestProfile'));
          if (guestProfile === null) {
            history.push('/');
            return;
          }
    
          const updatedProfile = {
            email: '',
            firstName: '',
            lastName: '',
            pushNotifications: false,
            phoneNum: '',
            address: guestProfile.address,
            unit: '',
            city: guestProfile.city,
            state: guestProfile.state,
            zip: guestProfile.zip,
            deliveryInstructions: '',
            latitude: guestProfile.latitude,
            longitude: guestProfile.longitude,
            zone: '',
            socialMedia: 'NULL',
          };
          setProfile(updatedProfile);
        }
      }, []);

    const handleClickLogOut = () => {
        localStorage.removeItem('currentStorePage');
        localStorage.removeItem('cartTotal');
        localStorage.removeItem('cartItems');
        Cookies.remove('login-session');
        Cookies.remove('customer_uid');

        Auth.setIsAuth(false);
        Auth.setAuthLevel(0);
        history.push('/');
    };

    const onSubmit = (event) => {
        const AuthMethods = new AuthUtils();

        if (newPassword != '' && newPassword == confirmedPassword) {
            const cred = {
                customer_email: profile.email,
                password: newPassword,
            }

            Promise.all([
                AuthMethods.updateProfile(profile),
                AuthMethods.updatePassword(cred),
            ]).then((authRes) => {
                console.warn('authRes = ', authRes);
                window.location.reload();
            })
            .catch((err) => {
                alert('Unsuccessful update');
            });

            console.log('here');
        } else {
            console.log('else');
            AuthMethods.updateProfile(profile).then((authRes) => {
                console.warn('authRes = ', authRes);
                window.location.reload();
            })
            .catch((err) => {
                alert('Unsuccessful update');
            });
        }
    };

    console.log('Auth = ', Auth);

    return (
        <Box className = {classes.profileInfoContainer}>
            <AuthContext.Provider
                value = {{
                    profile, setProfile,
                    isAuth, setIsAuth,
                    setAuthLevel,
                    cartTotal,
                    setShowLogin,
                    setShowSignup,
                }}
            >
                <ProfileInfoNavBar />
            </AuthContext.Provider>

            <Dialog
                open={showLogin}
                onClose = {() => setShowLogin(false)}
            >
                <AdminLogin />
            </Dialog>

            <Dialog
                open={showSignup}
                onClose = {() => setShowSignup(false)}
            >
                <Signup />
            </Dialog>

            <Box className = {classes.profileContainer}>
                <Box style = {{width: '100%'}}>
                    <Typography className = {classes.pageLabel}>
                        Profile
                    </Typography>
                </Box>
                

                <Box className = {classes.currUserInf}>
                    <Box style = {{display: 'flex', justifyContent: 'center'}}>
                        <Avatar src = {"no-link"} className = {classes.currUserPic}>
                            <Typography style = {{fontSize: '38px'}}>
                                {(profile.firstName || profile.lastName) ? `${profile.firstName[0]}${profile.lastName[0]}` :
                                    'JD'
                                }
                            </Typography>
                        </Avatar>
                    </Box>
                    <TextField
                        className = {classes.profileEditField}
                        variant = 'outlined'
                        label = {profile.firstName == '' ? 'John' : profile.firstName}
                        disabled
                    />
                    <TextField
                        className = {classes.profileEditField}
                        variant = 'outlined'
                        label = {profile.lastName == '' ? 'Doe' : profile.lastName}
                        disabled
                    />
                    <TextField
                        className = {classes.profileEditField}
                        variant = 'outlined'
                        placeholder = {profile.phoneNum == '' ? '123-456-7891' : profile.phoneNum}
                        onChange = {(event) => setProfile({...profile, phoneNum: event.target.value})}
                    />
                    <TextField
                        className = {classes.profileEditField}
                        variant = 'outlined'
                        label = {profile.email == '' ? 'johndoe@example.com' : profile.email}
                        disabled
                    />

                    {
                        Auth.isAuth ?
                        loginTypeMapping[profile.socialMedia] : ''
                        
                    }

                    <Box hidden = {profile.socialMedia != 'NULL' || !resetPasswordClicked}>
                        <TextField
                            className = {classes.profileEditField}
                            variant = 'outlined'
                            type = 'password'
                            placeholder = {'New Password'}
                            onChange = {(event) => setNewPassword(event.target.value)}
                        />

                        <TextField
                            className = {classes.profileEditField}
                            variant = 'outlined'
                            type = 'password'
                            placeholder = {'Confirm Password'}
                            onChange = {(event) => setConfirmedPassword(event.target.value)}
                        />
                    </Box>

                    <TextField
                        className = {classes.profileEditField}
                        variant = 'outlined'
                        placeholder = {profile.address == '' ? 'Street Address' : profile.address}
                        onChange = {(event) => setProfile({...profile, address: event.target.value})}
                    />
                    <TextField
                        className = {classes.profileEditField}
                        variant = 'outlined'
                        placeholder = {profile.unit == '' ? 'Appt number' : profile.unit}
                        onChange = {(event) => setProfile({...profile, unit: event.target.value})}
                    />

                    <Box style = {{display:  'flex'}}>
                        <TextField
                            className = {classes.profileEditField}
                            variant = 'outlined'
                            placeholder = {profile.city == '' ? 'City' : profile.city} style = {{marginRight: "30px"}}
                            onChange = {(event) => setProfile({...profile, city: event.target.value})}
                        />
                        <TextField
                            className = {classes.profileEditField}
                            variant = 'outlined'
                            placeholder = {profile.state == '' ? 'State' : profile.state} style = {{marginRight: "30px"}}
                            onChange = {(event) => setProfile({...profile, state: event.target.value})}
                        />
                        <TextField
                            className = {classes.profileEditField}
                            variant = 'outlined'
                            placeholder = {profile.zip == '' ? 'Zip Code' : profile.zip}
                            onChange = {(event) => setProfile({...profile, zip: event.target.value})}
                        />
                    </Box>

                    <Box hidden = {!Auth.isAuth}>
                        <Box className = {classes.profInfButtonContainer}>
                            <ColorButton
                                variant = 'contained'
                                onClick = {onSubmit}
                                className = {classes.profInfButton}
                            >
                                Save Changes
                            </ColorButton>

                            <ColorButton variant = 'contained' className = {classes.profInfButton}
                                onClick = {handleClickLogOut}
                            >
                                Log Out
                            </ColorButton>
                        </Box>
                    </Box>

                    <Typography className = {classes.servingFreshSupportMessage}>
                        Please contact <a href = "google.com" className = {classes.supportLink}>support@servingfresh.me</a> to 
                        change your First Name, Last Name
                        or Email Address.
                    </Typography>
                </Box>
            </Box>

            <Footer />
        </Box>
    );
}

export default ProfileInfo;