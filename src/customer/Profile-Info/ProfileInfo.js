import React from 'react';
import {useHistory} from 'react-router-dom';

import { AuthContext } from 'auth/AuthContext';
import AuthUtils from '../../utils/AuthUtils';
import ProfileInfoNavBar from './ProfileInfoNavBar';

import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import MenuNavButton from '../../utils/MenuNavButton';
import {Box, Button, Toolbar, Typography, TextField, Avatar, Link, IconButton, Badge} from '@material-ui/core';  
import sf from '../../icon/sfnav.svg';
import {withStyles, makeStyles} from '@material-ui/core/styles';
import appColors from '../../styles/AppColors';

import useWindowsDimensions from '../WindowDimensions';

import Cookies from 'universal-cookie';
import { UnfoldLess } from '@material-ui/icons';
const cookies = new Cookies();


// AuthMethods.getProfile().then((authRes) => {
//     console.log('User profile and store items were retrieved');
//     console.log('authRes: ', authRes);
//     const updatedProfile = {
//       email: authRes.customer_email,
//       firstName: authRes.customer_first_name,
//       lastName: authRes.customer_last_name,
//       pushNotifications:
//         authRes.cust_notification_approval === 'TRUE' ? true : false,
//       phoneNum: authRes.customer_phone_num,
//       address: authRes.customer_address,
//       unit: authRes.customer_unit,
//       city: authRes.customer_city,
//       state: authRes.customer_state,
//       zip: authRes.customer_zip,
//       deliveryInstructions: '',
//       latitude: authRes.customer_lat,
//       longitude: authRes.customer_long,
//       zone: '',
//       socialMedia: authRes.user_social_media || '',
//     };
//     setProfile(updatedProfile);
//   });

const useStyles = makeStyles((theme) => ({
    profileInfoContainer: {
        display: 'flex',
        flexDirection: 'column',
        background: appColors.componentBg,
    },

    sfImgContainer: {
        flexBasis: '1',
        flexGrow: '1',
        '&:hover': {
            cursor: 'pointer',
        },
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
        width: '450px',
    },

    currUserPic: {
        width: theme.spacing(12),
        height: theme.spacing(12),
    },

    resetPasswordLink: {
        textDecoration: 'underline',
        marginTop: '10px',
        '&:hover': {
            cursor: 'pointer',
        },
    },

    profInfButtonContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: theme.spacing(3),
    },

    profInfButton: {
        marginTop: theme.spacing(3),
        width: '75%',
        height: '50px',
        color: 'primary',
        background: '#e88330',
        color: 'white',
    },

    servingFreshSupportMessage: {
        // color: '#e88330',
        marginBottom: theme.spacing(12),
    },

    supportLink: {
        color: '#e88330',
        textDecoration: 'none',
    },
}));

const ColorButton = withStyles((theme) => ({
    root: {
        color: 'white',
        backgroundColor: appColors.primary,
        '&:hover': {
        backgroundColor: 'rgb(162, 91, 33)',
        },
    },
}))(Button);

function fetchUInf(setUInf, uid) {
    fetch(`https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/Profile/${uid}/`)
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((json) => {
          const uInf = json.result;
          console.warn('Printing uInf');
          console.warn(uInf)
          setUInf(uInf);
        })
        .catch((error) => {
          console.warn('CAUGHT with uid = ', uid);
          console.warn(error);
          setUInf(null);
        });
}

function ProfileInfo() {
    const classes = useStyles();
    const uid = cookies.get('customer_uid') ? cookies.get('customer_uid') : '';
    const history = useHistory();
    const {width} = useWindowsDimensions();
    const {profile, setProfile} = React.useContext(AuthContext);
    const Auth = React.useContext(AuthContext);

    const [uInf, setUInf] = React.useState(null);

    // React.useEffect(() => {
    //     console.warn('here');
    //     fetchUInf(setUInf, uid);
    // }, ([]));

    React.useEffect(() => {
        if (Auth.isAuth) {
          const AuthMethods = new AuthUtils();
          AuthMethods.getProfile().then((authRes) => {
            console.log('User profile and store items were retrieved');
            console.log('authRes: ', authRes);
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
              latitude: authRes.customer_lat,
              longitude: authRes.customer_long,
              zone: '',
              socialMedia: authRes.user_social_media || '',
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

    console.warn('Profile warn');
    console.warn(profile)

    console.warn()

    return (
        <Box className = {classes.profileInfoContainer}>
            <AuthContext.Provider
                value = {{
                    profile, setProfile,
                }}
            >
                <ProfileInfoNavBar />
            </AuthContext.Provider>
            {/* <Toolbar style={{backgroundColor:'#2F787F'}}>
                <Box flexBasis = {1} flexGrow = {1}>
                    <MenuNavButton style={{border:'1px solid black',color:'white'}}/>
                </Box>
                
                <Box
                    className = {classes.sfImgContainer}
                    onClick = {() => history.push('/')
                }>
                    <img style={{float:'center'}} src={sf}></img>
                </Box>
                
                <Box flexGrow = {1} flexBasis = {1} style = {{display: 'flex', justifyContent: 'flex-end', color: 'white', alignItems: 'center'}}>
                    <Typography style = {{marginRight: '20px'}}> {uInf ? uInf.customer : 'John Doe'} </Typography>
                    <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        style = {{marginRight: '20px'}}
                    >
                        <Typography style = {{color: 'white', fontSize: '12px', marginLeft: '5px', marginRight: '5px'}}> Log Out </Typography>
                    </Button>

                    <IconButton edge="end" className="link" onClick = {() => {
                        if (width < 1280) {
                            // setCheckingOut(true)
                            console.log("Should check out");
                        }
                        }
                    }>
                        <Badge badgeContent={1} color = "primary">
                        <ShoppingCartOutlinedIcon
                            fontSize="large"
                            key={'profile-info-shop-cart'}
                            aria-hidden="false"
                            aria-label = 'Shopping cart'
                            style = {{color: appColors.buttonText}}
                        />
                        </Badge>
                    </IconButton>
                </Box>
            </Toolbar> */}

            <Box className = {classes.profileContainer}>
                <Box style = {{width: '100%'}}>
                    <Typography className = {classes.pageLabel}>
                        Profile
                    </Typography>
                </Box>
                

                <Box className = {classes.currUserInf}>
                    <Box style = {{display: 'flex', justifyContent: 'center'}}>
                        <Avatar src = {"no-link"} className = {classes.currUserPic}>
                            <Typography style = {{fontSize: '30px'}}>
                                {(profile.firstName || profile.lastName) ? `${profile.firstName[0]} ${profile.lastName[0]}` :
                                    'J D'
                                }
                            </Typography>
                        </Avatar>
                    </Box>
                    <TextField label = {profile.firstName == '' ? 'John' : profile.firstName}/>
                    <TextField label = {profile.lastName == '' ? 'Doe' : profile.lastName}/>
                    <TextField label = {profile.phoneNum == '' ? '(123)456-7891' : profile.phoneNum}/>
                    <TextField label = {profile.email == '' ? 'johndoe@example.com' : profile.email}/>

                    <Link className =  {classes.resetPasswordLink}>
                        Reset Password
                    </Link>

                    <TextField label = {profile.address == '' ? 'Street Address' : profile.address}/>
                    <TextField label = {profile.unit == '' ? 'Appt number' : profile.unit}/>

                    <Box style = {{display:  'flex'}}>
                        <TextField label = {profile.city == '' ? 'City' : profile.city} style = {{marginRight: "30px"}}/>
                        <TextField label = {profile.state == '' ? 'State' : profile.state} style = {{marginRight: "30px"}}/>
                        <TextField label = {profile.zip == '' ? 'Zip Code' : profile.zip}/>
                    </Box>

                    <Box className = {classes.profInfButtonContainer}>
                        <ColorButton variant = 'contained' className = {classes.profInfButton}>
                            Save Changes
                        </ColorButton>

                        <ColorButton variant = 'contained' className = {classes.profInfButton}>
                            Log Out
                        </ColorButton>
                    </Box>

                    <Typography className = {classes.servingFreshSupportMessage}>
                        Please contact <a href = "google.com" className = {classes.supportLink}>support@servingfresh.me</a> to 
                        change your First Name, Last Name
                        or Email Address.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default ProfileInfo;