import React from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import {connect} from "react-redux";
import {
  bypassLogin,
  changeEmail,
  changePassword,
  loginAttempt,
  socialLoginAttempt,
  forgotPassword
} from "../../reducers/actions/loginActions";
import {withRouter} from "react-router";
import {Link} from "react-router-dom";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import landingStyles from "./landing.module.css";
import Alert from "../Alert";
import SocialLogin from "./socialLogin"
import Logo from "./Logo.svg"
import { ThemeConsumer } from "react-bootstrap/esm/ThemeProvider";
class Landing extends React.Component {
  constructor() {
    super();
    this.state = {
      mounted: false,
      error: "",
    };
  }

  successLogin = page => {
    this.props.history.push(`/${page}`);
  };

  viewPassword() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  socialSignUp = () => {
    this.props.history.push("social-sign-up");
  };

  componentDidMount() {
    //check for logedIn
    const customerId = Cookies.get("customer_uid");
    if (customerId) {
      // this.props.history.push("/select-meal");
    } else {
      let queryString = this.props.location.search;
      let urlParams = new URLSearchParams(queryString);
      // Clear Query parameters
      window.history.pushState({}, document.title, window.location.pathname);
      if (urlParams.has("email") && urlParams.has("hashed")) {
        // Automatic log in
        this.props.bypassLogin(
          urlParams.get("email"),
          urlParams.get("hashed"),
          this.successLogin
        );
      } else {
        this.setState({
          mounted: true
        });
        window.AppleID.auth.init({
          clientId: process.env.REACT_APP_APPLE_CLIENT_ID,
          scope: "email",
          redirectURI: process.env.REACT_APP_APPLE_REDIRECT_URI
        });
      }
    }
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
    if (!this.state.mounted) {
      return (
        <div style = {{display: 'grid', alignContent: 'center', justifyContent: 'center', margin: '100px 0px'}}>
          <h6 style = {{textAlign: 'center'}}>You are already logged in</h6>
          <div>
            <h6 style = {{textAlign: 'center'}}>Click the following button to navigate to your meal plan</h6>
            <Link to = '/meal-plan' style = {{borderRadius: '20px', backgroundColor: 'orange', width: 'fit-content', margin: 'auto', padding: '10px 15px', width: 'max-content'}}>
              Meal Plan
            </Link>
          </div>

        </div>
      );
    }
    return (
      <div className={landingStyles.root}>
        <div className={landingStyles.mainLogin}>
            {/* <h2 style = {{float: 'right' , color: '#FFBA00', transform: 'rotate(45deg)', fontSize: '45px'}}>+</h2> */}
          <div className={landingStyles.mealHeader}>
            <img style={{width: "65%", height:"65%"}} src={Logo}/>
            <p style = {{color: 'black'}}>NUTRITION MADE EASY</p>
            <p>LOCAL.ORGANIC.RESPONSIBLE</p>
          </div>

          <div>
            <div className={landingStyles.loginSectionContainer}>
              <div className={landingStyles.loginSectionItem}>
                <input
                  type='text'
                  placeholder='USER NAME'
                  className={landingStyles.loginSectionInput}
                  value={this.props.email}
                  onChange={e => {
                    this.props.changeEmail(e.target.value);
                  }}
                />
              </div>
              <div className={landingStyles.loginSectionItem}>
                <span className={landingStyles.loginSectionInput}>
                  <input
                    style={{marginBottom: "0px"}}
                    type='password'
                    id='password'
                    placeholder='PASSWORD'
                    value={this.props.password}
                    onChange={e => {
                      this.props.changePassword(e.target.value);
                    }}
                  />

                  <a className={landingStyles.passwordShow}>
                    <i
                      className='far fa-eye'
                      id='togglePassword'
                      onClick={this.viewPassword}
                    ></i>
                  </a>
                </span>
              </div>
              <Link style = {{margin: 'auto'}} to={{ pathname: '/login', state: { forgotPassword: 'from Home'} }}>
                  <h6 style = {{margin: 'auto', fontSize: '1rem', color: "black", float: "right"}}> Forgot Password?</h6>
              </Link>
            </div>
            <div className={landingStyles.buttonContainer}>
              <button
                className={landingStyles.button}
                onClick={() => {
                  this.props.loginAttempt(
                    this.props.email,
                    this.props.password,
                    this.successLogin
                  );
                }}
              >
                LOGIN
              </button>
              <Link to='sign-up'>
                <button className={landingStyles.button}>SIGNUP</button>
              </Link>
            </div>
            <hr
              style={{marginTop: "2rem", color: "#E392409D", width: "300px"}}
            ></hr>
            <p
              style={{
                color: "black",
                textAlign: "center",
                fontSize: "1rem",
                paddingTop: "1.2rem"
              }}
            >
              LOGIN OR SIGNUP WITH
            </p>
            <div
              style={{
                marginTop: "3.7rem",
                display: "flex",
                flexDirection: "row",
                alignContent: "center",
                textAlign: "center",
                justifyContent: "space-between",
                padding: "0rem 8.5rem"
              }}
            >
              <SocialLogin />

            </div>
            <Alert />
          </div>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  bypassLogin: PropTypes.func.isRequired,
  changeEmail: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired,
  loginAttempt: PropTypes.func.isRequired,
  socialLoginAttempt: PropTypes.func.isRequired,
  forgotPassword: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  email: state.login.email,
  password: state.login.password,
  error: state.login.error
});

const functionList = {
  bypassLogin,
  changeEmail,
  changePassword,
  loginAttempt,
  socialLoginAttempt,
  forgotPassword
};

export default connect(mapStateToProps, functionList)(withRouter(Landing));
