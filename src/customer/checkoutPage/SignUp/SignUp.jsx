import React, { Component } from 'react'
import SocialLogin from "./Landing/socialLogin";
import {
  changeNewEmail,
  changeNewPassword,
  changeNewPasswordConfirm,
  changeNewFirstName,
  changeNewLastName,
  changeNewPhone,
  changeNewAddress,
  changeNewUnit,
  changeNewCity,
  changeNewState,
  changeNewZip,
  submitPasswordSignUp,
  loginAttempt,
} from "./Landing/loginActions";
import {connect} from "react-redux";
import { Route , withRouter} from 'react-router-dom';

export class SignUp extends Component {

  constructor(){
    super();
  }

  handleClick = () => {
    this.props.toggle();
  };

  successLogin = () => {
    console.log('inside success login')
    this.props.history.push(`/choose-plan`);
  }; 

  sleep = (milliseconds) => {
    console.log('inside sleep')
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  wrapperFunction=()=>{
    console.log(this.props.password)
    this.props.submitPasswordSignUp(
      this.props.email,
      this.props.password,
      this.props.passwordConfirm,
      this.props.firstName,
      this.props.lastName,
      this.props.phone,
      this.props.street,
      this.props.unit,
      this.props.city,
      this.props.state,
      this.props.zip,
    );
    let temppd= this.props.password
    let tempem = this.props.email

    console.log('finish signup function');

    this.sleep(5000).then(()=>{
      this.props.loginAttempt(
        tempem,
        temppd,
        this.successLogin
      );
      console.log('finish login function')
    })

  }


  render() {
    return (
      <div
        className="model_content"
      >
        <div
        style={{
          top: '51px',
          left: '190px',
          width: '247px',
          height: '58px',
          background: '#466DED 0% 0% no-repeat padding-box',
          borderRadius: '20px',
          opacity: 1,
          marginLeft:'190px',
          marginTop:'51px',
        }}>
        </div>

        <div
        style={{
          top: '51px',
          left: '190px',
          width: '247px',
          height: '58px',
          background: '#485A95 0% 0% no-repeat padding-box',
          borderRadius: '20px',
          opacity: 1,
          marginLeft:'190px',
          marginTop:'9px',
        }}>
        </div>

        <div
        style={{
          top: '51px',
          left: '190px',
          width: '247px',
          height: '58px',
          background: '#466DED 0% 0% no-repeat padding-box',
          borderRadius: '20px',
          opacity: 1,
          marginLeft:'190px',
          marginTop:'9px',
        }}>
        </div>

        <div
          style={{
            marginTop:'50px'
          }}
        >
          <SocialLogin />
        </div>

        <hr
        style={{
          border: '1px solid #136D74',
          borderRadius: '5px',
          width:'455px',
          marginTop:'23',
        }}
        />

        <div
        style={{
          left: '209px',
          width: '210px',
          height: '24px',
          textAlign: 'center',
          letterSpacing: '-0.48px',
          color: '#000000',
          opacity: 1,
          marginLeft:'209px',
          fontSize:20,
          fontWeight:500,
          marginBottom:24,
        }}>
          Or continue with email
        </div>

        <div style={{
          marginLeft:'86px',
        }}>
          <input 
            className='inputBox'
            placeholder='First name (so we can address you)'
            value={this.props.firstName}
            onChange={e => {
              this.props.changeNewFirstName(e.target.value);
            }}
          >
          </input>

          <input 
            className='inputBox'
            placeholder='Last name (in case you want to be formal)'
            value={this.props.lastName}
            onChange={e => {
              this.props.changeNewLastName(e.target.value);
            }}
          >
          </input>

          <input 
            className='inputBox'
            placeholder='Email address (for order confirmation)'
            value={this.props.email}
            onChange={e => {
              this.props.changeNewEmail(e.target.value);
            }}
          >
          </input>

          <input 
            className='inputBox'
            placeholder='Create Password'
            value={this.props.password}
            onChange={e => {
              this.props.changeNewPassword(e.target.value);
            }}
          >
          </input>

          <input 
            className='inputBox'
            placeholder='Confirm Password'
            value={this.props.passwordConfirm}
            onChange={e => {
              this.props.changeNewPasswordConfirm(e.target.value);
            }}>
          </input>
        </div>
        <div style={{
          marginLeft:'86px',
          marginBottom:'13px',
          fontSize:20,
          fontWeight:500,
        }}>
          Address
        </div>


        <div
        style={{
          marginLeft:'86px',
        }}>
          <input 
            style={{
              top: '333px',
              left: '86px',
              width: '334px',
              height: '49px',
              background: '#FFFFFF 0% 0% no-repeat padding-box',
              border: '1px solid #00000028',
              borderRadius: '6px 5px 5px 5px',
              opacity: 1,
              marginBottom: '13px',
            }} 
            placeholder='Address'
            value={this.props.street}
            onChange={e => {
              this.props.changeNewAddress(e.target.value);
            }}
          />

          <input 
            style={{
              top: '333px',
              left: '86px',
              width: '120px',
              height: '49px',
              background: '#FFFFFF 0% 0% no-repeat padding-box',
              border: '1px solid #00000028',
              borderRadius: '6px 5px 5px 5px',
              opacity: 1,
              marginBottom: '13px',
            }} 
            placeholder='Unit'
            value={this.props.unit}
            onChange={e => {
              this.props.changeNewUnit(e.target.value);
            }}
          />
        </div>

        <div
        style={{
          marginLeft:'86px',
        }}>
          <input             
            style={{
              top: '333px',
              left: '86px',
              width: '200px',
              height: '49px',
              background: '#FFFFFF 0% 0% no-repeat padding-box',
              border: '1px solid #00000028',
              borderRadius: '6px 5px 5px 5px',
              opacity: 1,
              marginBottom: '13px',
              }} 
            placeholder='City'
            value={this.props.city}
            onChange={e => {
                this.props.changeNewCity(e.target.value);
              }}
            />



          <input             
            style={{
              top: '333px',
              left: '86px',
              width: '70px',
              height: '49px',
              background: '#FFFFFF 0% 0% no-repeat padding-box',
              border: '1px solid #00000028',
              borderRadius: '6px 5px 5px 5px',
              opacity: 1,
              marginBottom: '13px',
              }} 
            placeholder='State'
            value={this.props.state}
            onChange={e => {
              this.props.changeNewState(e.target.value);
              }}
            />


          <input             
            style={{
              top: '333px',
              left: '86px',
              width: '182px',
              height: '49px',
              background: '#FFFFFF 0% 0% no-repeat padding-box',
              border: '1px solid #00000028',
              borderRadius: '6px 5px 5px 5px',
              opacity: 1,
              marginBottom: '13px',
            }} 
              placeholder='Zip'
              value={this.props.zip}
              onChange={e => {
                this.props.changeNewZip(e.target.value);
              }}
            />
        </div>




        <button
          style={{
            top: '722px',
            left: '86px',
            width: '455px',
            height: '56px',
            background:' #FF8500 0% 0% no-repeat padding-box',
            borderRadius: '14px',
            opacity: 1,
            marginLeft:'86px',
          }}
          onClick={this.wrapperFunction}
        >
          <p style={{
            fontSize:'20px',
            textAlign:'center',
            marginTop:8,
            fontWeight:500,
          }}>
            Sign up
          </p>
          
        </button>




      </div>
    )
  }
}

const mapStateToProps = state => ({
  email: state.login.newUserInfo.email,
  password: state.login.newUserInfo.password,
  passwordConfirm: state.login.newUserInfo.passwordConfirm,
  firstName: state.login.newUserInfo.firstName,
  lastName: state.login.newUserInfo.lastName,
  phone: state.login.newUserInfo.phone,
  street: state.login.newUserInfo.address.street,
  unit: state.login.newUserInfo.address.unit,
  city: state.login.newUserInfo.address.city,
  state: state.login.newUserInfo.address.state,
  zip: state.login.newUserInfo.address.zip
});

const functionList = {
  changeNewEmail,
  changeNewPassword,
  changeNewPasswordConfirm,
  changeNewFirstName,
  changeNewLastName,
  changeNewPhone,
  changeNewAddress,
  changeNewUnit,
  changeNewCity,
  changeNewState,
  changeNewZip,
  submitPasswordSignUp,
  loginAttempt,
};

export default connect(mapStateToProps, functionList)(withRouter(SignUp));
