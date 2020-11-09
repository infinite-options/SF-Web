import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Admin from './admin/Admin';
import {BrowserRouter as Router,Switch,Route,Link,Redirect} from "react-router-dom";
import AdminLogin from './admin/AdminLogin';
import FarmerLogin from './farmer/FarmerLogin';
import FarmerSignUp from './farmer/FarmerSignUp';
import { AuthContext } from './auth/AuthContext';
import AuthAdminRoute from './auth/AuthAdminRoute'
import Cookies from 'js-cookie'
import AuthAdminLoginRoute from './auth/AuthAdminLoginRoute';
import AdminSocialSignup from './admin/AdminSocialSignup';
import AdminSignup from './admin/AdminSignup';
import axios from 'axios';

const BASE_URL = "https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/";

function App() {
  const [isAuth, setIsAuth] = useState(false); // checks if user is logged in
  const [accountType, setAccountType] = useState();

  // IF USER IS LOGGED IN, CHECK THEIR ACCOUNT AUTHORITY:
  // Level  0: Lowest level 
  // Level  1: User is logged in & is farmer or higher 
  // Level  2: User is logged in & is admin
  const [authLevel, setAuthLevel] = useState(0);
  
  const readCookie = () => {
    const loggedIn = Cookies.get('login-session');
    // console.log('asduojhfhuasdf');
    if(loggedIn){ 
      setIsAuth(true);
      console.log('User is already logged in');
    }
  }

  useEffect(() => {
    console.log("reading cookie...");
    readCookie();
  }, []);

  useEffect(() => {
    if (isAuth) {
      axios.get(BASE_URL + "Profile/" + Cookies.get('customer_uid'))
      .then((response) => {
        console.log("Account:", response);
        let newAccountType = response.data.result[0].role.toLowerCase()
        setAccountType(response.data.result[0].role ? 
           newAccountType : 
          ''
        );
        let newAuthLevel = (() => {
          console.log(newAccountType)
          switch (newAccountType) {
              case 'customer': return 0;
              case 'farmer': return 1;
              case 'admin': return 2;
              default: return 0;
          }
        })();
        console.log(newAuthLevel)
        setAuthLevel(newAuthLevel);
      })
      .catch(err => {
        console.log(err.response || err);
      });
    }
    else { setAccountType(); }
  }, [isAuth])

  return (
    <Router>
      <div className="App">
        <AuthContext.Provider value={{isAuth, setIsAuth, authLevel}}>
          <Switch>
            {/* <Route exact path='/'/> */}
            <AuthAdminRoute path="/admin" component={Admin} auth={isAuth} authLevel={authLevel}/>
            <AuthAdminLoginRoute path="/adminlogin" component={AdminLogin} auth={isAuth}/>
            <AuthAdminLoginRoute path="/socialsignup" component={AdminSocialSignup} auth={isAuth}/>
            <AuthAdminLoginRoute path="/signup" component={AdminSignup} auth={isAuth}/>
            <Route path='/*'>
              <Redirect to="/adminlogin" />
            </Route>
          </Switch>
        </AuthContext.Provider>
      </div>
    </Router>

  );
}

export default App;
