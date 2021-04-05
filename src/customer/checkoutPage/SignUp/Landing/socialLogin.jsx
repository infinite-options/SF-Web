import React, { Component } from 'react';
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import {connect} from "react-redux";
import {
  // bypassLogin,
  // changeEmail,
  // changePassword,
  // loginAttempt,
  socialLoginAttempt
} from "./loginActions";
import {withRouter} from "react-router";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
// import socialLoginStyle from "./landing.module.css";
import {makeStyles} from '@material-ui/core/styles';
import './landing.module.css';

// const useStyles = makeStyles(() => ({
//   root: {
//     height: 'inherit',
//     width: 'inherit',
//     /* background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
//       url("../../images/landing.png"); */
//     /* background-color: white; */
//     backgroundSize: 'cover',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: '20px',
//   },
  
//   mainLogin: {
//     height: '100%',
//   },

//   mealHeader: {
//     height: '300px',
//     textAlign: 'center',
//     padding: '4.5rem 0rem 0rem 0rem',
//   },
  
//   'p:nth-of-type(1)': {
//     fontSize: '30px',
//     color: 'white',
//     padding: '0px 80px',
//   },
//   'p:nth-of-type(2)': {
//     marginTop: '20px',
//     fontSize: '15px',
//     color: '#fdca3e',
//     padding: '5px 40px',
//     fontWeight: '600',
//   },
  
//   headerItemContainer: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
  
//   headerItem: {
//     flex: 1,
//   },
  
//   'headerItem:nth-of-type(1)': {
//     flex: 3,
//   },
  
//   loginSectionContainer: {
//     display: 'flex',
//     textAlign: 'center',
//     flexWrap: 'wrap',
//     padding: '55px 0px 0px 0px',
//   },

//   socialLogin: {
//     display: 'flex',
//     width: '50%',
//     margin: 'auto',
//     textAlign: 'center',
//     justifyContent: 'space-evenly',
//     padding: '0px',
//   },

//   'socialLogin > button & socialLogin > span > button & socialLogin > div > button': {
//     marginLeft: '20px',
//     marginRight: '20px',
//   },

//   googleBtn: {
//     backgroundColor: 'none',
//     border: 'none',
//     cursor: 'pointer',
//     borderRadius: '50%',
//     padding: '0px',
//     height: '32.9px',
//     width: '32.9px',
//   },
  
//   googleBtn: {
//     '&::before': {
//       content: 'url(./google-plus.svg)',
//     }
//   },
  
//   appleLogin: {
//     backgroundColor: 'black',
//     border: 'none',
//     cursor: 'pointer',
//     borderRadius: '50%',
//     padding: '0px',
//     height: '32.9px',
//     width: '32.9px',
//   },
  
//   fbLogin: {
//     backgroundColor: 'none',
//     border: 'none',
//     cursor: 'pointer',
//     borderRadius: '50%',
//     padding: '0px',
//     height: '32.9px',
//     width: '32.9px',
//     color: 'transparent',
//   },
  
//   fbLogin: 
//   {
//     '&::before': {
//       content: 'url(./facebook.svg)',
//     }
//   },
  
//   loginSectionItem: {
//     flex: '1 100%',
//     margin: '7px 10px',
//     width: '100%',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
  
//   loginSectionInput: {
//     width: '270px',
//     height: '31px',
//     padding: '0px 15px',
//     borderRadius: '18px',
//     backgroundColor: '#ffffffd0',
//     border: 'none',
//     boxShadow: '0px 3px 6px #00000029',
//     /* margin-bottom: 5px; */
//   },
  
//   loginSectionInput: {
//     '&::focus': {
//       outline: 'none',
//     }
//   },
  
//   'loginSectionInput > input': {
//     width: '85%',
//     float: 'left',
//     backgroundColor: 'transparent',
//     paddingTop: '3px',
//     height: '90%',
//     border: 'none',
//   },
  
//   'loginSectionInput > input': {
//     '&::hover': {
//       outline: 'none',
//       border: 'none',
//     }
//   },
  
//   'loginSectionInput > a': {
//     cursor: 'pointer',
//     height: '100%',
//     width: '10%',
//     textDecoration: 'none',
//     display: 'inline-flex',
//     margin: '0px !important',
//     padding: '0.5rem',
//     textAlign: 'center',
//     justifyItems: 'center',
//   },
  
//   buttonContainer: {
//     marginTop: '10px',
//     display: 'flex',
//     flexWrap: 'wrap',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     textAlign: 'center',
//   },
  
//   button: {
//     width: '110px',
//     height: '45px',
//     color: '#000000',
//     border: 'none',
//     backgroundColor: '#ff9e19',
//     borderRadius: '25px',
//     padding: '10px',
//     fontSize: '1rem',
//     fontWeight: '500',
//     margin: '0rem 0.8rem',
//   },
  
//   socialLoginItem: {
//     margin: '20px',
//     padding: '5px',
//     height: '30px',
//   },
// }));


class SocialLogin extends Component {

  successLogin = page => {
    this.props.history.push(`/${page}`);
  };

  socialSignUp = () => {
    this.props.history.push("social-sign-up");
  };

  componentDidMount() {
      window.AppleID.auth.init({
          clientId: process.env.REACT_APP_APPLE_CLIENT_ID,
          scope: "email",
          redirectURI: process.env.REACT_APP_APPLE_REDIRECT_URI
        });
  }

  responseGoogle = response => {
    console.log(response);
    if (response.profileObj) {
      // Google Login successful, try to login to MTYD
      console.log("Google login successful");
      let email = response.profileObj.email;
      let accessToken = response.accessToken;
      let refreshToken = response.googleId;
      // console.log(email,accessToken,refreshToken)
      this.props.socialLoginAttempt(
        email,
        accessToken,
        refreshToken,
        "GOOGLE",
        this.successLogin,
        this.socialSignUp
      );
    } else {
      // Google Login unsuccessful
      console.log("Google Login failed");
    }
  };

  responseFacebook = response => {
    console.log(response);
    if (response.email) {
      console.log("Facebook Login successful");
      let email = response.email;
      let accessToken = response.accessToken;
      let refreshToken = response.id;
      this.props.socialLoginAttempt(
        email,
        accessToken,
        refreshToken,
        "FACEBOOK",
        this.successLogin,
        this.socialSignUp
      );
    } else {
      // Facebook Login unsuccessful
      console.log("Facebook Login failed");
    }
  };
  showError = err => {
    console.log("this is error in show err: ", err);
    return (
      <div
        style={{display: "flex", alignItem: "center", justifyContent: "center"}}
      >
        <p
          style={{
            color: "red",
            fontSize: "15px",
            fontWeight: "bold",
            padding: "10px 10px"
          }}
        >
          {err}
        </p>
      </div>
    );
  };

  render() {
    // const classes = useStyles();

    return ( 
      <div className='socialLogin'>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          render={renderProps => (
            <button
              className='googleBtn'
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            ></button>
          )}
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          isSignedIn={false}
          disabled={false}
          cookiePolicy={"single_host_origin"}
        />
        <FacebookLogin
          appId={process.env.REACT_APP_FACEBOOK_APP_ID}
          autoLoad={false}
          fields={"name,email,picture"}
          callback={this.responseFacebook}
          className='fbLogin'
          textButton=''
        />
        <div>
          <button
            onClick={() => {
              window.AppleID.auth.signIn();
            }}
            className='appleLogin'
          >
            <i
              className='fa fa-apple'
              style={{fontSize: "28px", color: "white"}}
            ></i>
          </button>
        </div>
      </div>
    );
  }
}

SocialLogin.propTypes = {
    // bypassLogin: PropTypes.func.isRequired,
    // changeEmail: PropTypes.func.isRequired,
    // changePassword: PropTypes.func.isRequired,
    // loginAttempt: PropTypes.func.isRequired,
    socialLoginAttempt: PropTypes.func.isRequired,
    // email: PropTypes.string.isRequired,
    // password: PropTypes.string.isRequired
  };
  
  // const mapStateToProps = state => ({
  //   email: state.login.email,
  //   password: state.login.password,
  //   error: state.login.error
  // });

  const mapStateToProps = state => ({});
  
  const functionList = {
    // bypassLogin,
    // changeEmail,
    // changePassword,
    // loginAttempt,
    socialLoginAttempt
  };
 
  export default connect(mapStateToProps, functionList)(withRouter(SocialLogin));