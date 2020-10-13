import React, { Component, useState, useEffect, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { Box } from '@material-ui/core'
import Paper from '@material-ui/core/Paper';
// import Background from '../welcome-bg.png'
import Button from '@material-ui/core/Button';
import Cookies from 'js-cookie';
import { AuthContext } from '../auth/AuthContext';

import axios from 'axios';

// class AdminSocialSignup extends Component {
function AdminSocialSignup(props) {
    const Auth = useContext(AuthContext);

    const [state, setState] = useState({
        mounted: false,
        signUpApple: false,
        customerId: '',
        email: '',
        platform: '',
        accessToken: '',
        refreshToken: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        unit: '',
        city: '',
        state: '',
        zip: '',
    });
//   constructor(props) {
//     super();
//     state = {
//       mounted: false,
//       signUpApple: false,
//       customerId: '',
//       email: '',
//       platform: '',
//       accessToken: '',
//       refreshToken: '',
//       firstName: '',
//       lastName: '',
//       phone: '',
//       address: '',
//       unit: '',
//       city: '',
//       state: '',
//       zip: '',
//     }
//   }

    useEffect(() => {
        console.log()
        // Check query String for Apple Login
        let queryString = props.location.search;
        let urlParams = new URLSearchParams(queryString);
        // Clear Query parameters
        window.history.pushState({}, document.title, window.location.pathname);
        // Receive email and social platform
        if(urlParams.has('id')) {
        // Using Came from Apple Login
        axios
            .get('https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/Profile/' + urlParams.get('id'))
            .then((res) => {
                let customer = res.data.result[0];
                console.log(customer);
                setState(prevState => ({
                    ...prevState,
                mounted: true,
                signUpApple: true,
                email: customer.customer_email,
                customerId: customer.customer_uid,
                platform: 'APPLE'
                }))
            })
            .catch((err) => {
                if(err.response) {
                    console.log(err.response);
                }
                console.log(err);
            })
        }
        // Check location state for Gogle/Facebook Login
        else if(props.location.state !== undefined) {
        if(props.location.state.email && props.location.state.refreshToken && props.location.state.platform) {
            setState(prevState => ({
                ...prevState,
            mounted: true,
            email: props.location.state.email,
            platform: props.location.state.platform,
            refreshToken: props.location.state.refreshToken,
            accessToken: props.location.state.refreshToken ?  props.location.state.accessToken : 'access token'
            }))
        } else {
            console.log('Necessary information not provided');  
        }
        } else {
            console.log('Necessary information not provided');
        }
    }, []);

//   componentDidMount() {
//     console.log()
//     // Check query String for Apple Login
//     let queryString = this.props.location.search;
//     let urlParams = new URLSearchParams(queryString);
//     // Clear Query parameters
//     window.history.pushState({}, document.title, window.location.pathname);
//     // Receive email and social platform
//     if(urlParams.has('id')) {
//       // Using Came from Apple Login
//       axios
//         .get('https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/Profile/' + urlParams.get('id'))
//         .then((res) => {
//             let customer = res.data.result[0];
//             console.log(customer);
//             this.setState({
//               mounted: true,
//               signUpApple: true,
//               email: customer.customer_email,
//               customerId: customer.customer_uid,
//               platform: 'APPLE'
//             })
//         })
//         .catch((err) => {
//             if(err.response) {
//                 console.log(err.response);
//             }
//             console.log(err);
//         })
//     }
//     // Check location state for Gogle/Facebook Login
//     else if(this.props.location.state !== undefined) {
//       if(this.props.location.state.email && this.props.location.state.refreshToken && this.props.location.state.platform) {
//         this.setState({
//           mounted: true,
//           email: this.props.location.state.email,
//           platform: this.props.location.state.platform,
//           refreshToken: this.props.location.state.refreshToken,
//           accessToken: this.props.location.state.refreshToken ?  this.props.location.state.accessToken : 'access token'
//         })
//       } else {
//         console.log('Necessary information not provided');  
//       }
//     } else {
//       console.log('Necessary information not provided');
//     }
//   }

  const _onReset = () => {
    setState(prevState => ({
        ...prevState,
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      unit: '',
      city: '',
      state: '',
      zip: '',
    }))
  }

  const _firstNameChange = (event) => {
    // event.persist();
    setState({
        ...state,
        firstName: event.target.value
    });
  }

  const _lastNameChange = (event) => {
    setState({
        ...state,
      lastName: event.target.value
    });
  }

  const _phoneChange = (event) => {
    setState({
        ...state,
      phone: event.target.value
    })
  }

  const _addressChange = (event) => {
    setState({
        ...state,
      address: event.target.value
    })
  }

  const _unitChange = (event) => {
    setState({
        ...state,
      unit: event.target.value
    })
  }

  const _cityChange = (event) => {
    setState({
        ...state,
      city: event.target.value
    })
  }

  const _stateChange = (event) => {
    setState({
        ...state,
      state: event.target.value
    })
  }

  const _zipChange = (event) => {
    setState({
        ...state,
      zip: event.target.value
    })
  }

  const _onSubmit = () => {
    axios
    .get('https://dev.virtualearth.net/REST/v1/Locations/',{
        params: {
            CountryRegion: 'US',
            adminDistrict: state.state,
            locality: state.city,
            postalCode: state.zip,
            addressLine: state.address,
            key: process.env.REACT_APP_BING_LOCATION_KEY,
        }
    })
    .then((res) => {
      let locationApiResult = res.data;
      if(locationApiResult.statusCode === 200) {
        let locations = locationApiResult.resourceSets[0].resources;
        /* Possible improvement: choose better location in case first one not desired */
        let location = locations[0];
        let lat = location.geocodePoints[0].coordinates[0];
        let long = location.geocodePoints[0].coordinates[1];
        if(location.geocodePoints.length === 2) {
            lat = location.geocodePoints[1].coordinates[0];
            long = location.geocodePoints[1].coordinates[1];
        }
        console.log(lat,long);
        let object = {};
        if(!state.signUpApple){
          object = {
            email: state.email,
            access_token: state.accessToken,
            refresh_token: state.refreshToken,
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
            referral_source: 'Website',
            role: 'customer',
            social: state.platform,
          }
        } else {
          object = {
            cust_id: state.customerId,
            email: state.email,
            access_token: state.accessToken,
            refresh_token: state.refreshToken,
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
            referral_source: 'Website',
            role: 'customer',
            social: state.platform,
          }
        }
        console.log(JSON.stringify(object));
        axios
        .post('https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/SignUp', object,{
            headers: {
                'Content-Type': 'text/plain'
            }
        })
        .then((res) => {
            console.log(res);
            let customerInfo = res.data.result;
            console.log('cookie',document.cookie)
            document.cookie = 'customer_uid=' + customerInfo.customer_uid;
            console.log('cookie',document.cookie)
            Auth.setIsAuth(true);
            Cookies.set('login-session', 'good');
            props.history.push("/admin");
        })
        .catch((err) => {
            // Log error for Login endpoint
            if(err.response) {
                console.log(err.response);
            }
            console.log(err);
        })
      }
    })
    .catch((err) => {
      console.log(err)
      if(err.response) {
        console.log(err.response)
      }
    })
  }

//   render() {
    // let value = this.context;
    if(!state.mounted) {
      return null;
    }
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        // style={{ backgroundImage: `url(${Background})` }}
      >
        <Paper style ={{
          height: 600,
          width: 350,
          margin: 20,
          textAlign: 'center',
          display: 'inline-block',
        }}>
          <p>SOCIAL SIGN UP</p>
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
          <TextField
            value={state.unit}
            onChange={_unitChange}
            label="Unit"
          />
          <br />
          <TextField
            value={state.city}
            onChange={_cityChange}
            label="City"
          />
          <br />
          <TextField
            value={state.state}
            onChange={_stateChange}
            label="State"
          />
          <br />
          <TextField
            value={state.zip}
            onChange={_zipChange}
            label="Zip"
          />
          <br />
          <br />
          <div>
            <Button 
              variant="contained"
              onClick={_onSubmit}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              style={{ marginLeft: '20px' }}
              type="button"
              onClick={_onReset}
            >
              Reset
            </Button>
          </div>
        </Paper>
      </Box>
    );
//   }
}
// AdminSocialSignup.contextType = AuthContext;

export default AdminSocialSignup;