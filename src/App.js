import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Admin from './Admin.js'
import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";
import Farmer from './Farmer';
import AdminLogin from './AdminLogin';
import FarmerLogin from './FarmerLogin';
import FarmerSignUp from './FarmerSignUp';
import { AuthContext } from './AuthContext';
import AuthAdminRoute from './AuthAdminRoute'
import Cookies from 'js-cookie'
import AuthAdminLoginRoute from './AuthAdminLoginRoute';
function App() {
  const[isAuth, setIsAuth] = useState(false);
  
  const readCookie = () => {
    const loggedIn = Cookies.get('login-session')
    console.log('asduojhfhuasdf')
    if(loggedIn){ 
      setIsAuth(true)
      console.log('User is already logged in')
    }
  }

  useEffect(() => {
    readCookie()
  })
  return (
    <Router>
      <div className="App">
        <AuthContext.Provider value={{isAuth, setIsAuth}}>
          <Route exact path='/'/>
          <AuthAdminRoute path="/admin" component={Admin} auth={isAuth}/>
          <AuthAdminLoginRoute path="/adminlogin" component={AdminLogin} auth={isAuth}/>
        </AuthContext.Provider>
      </div>
    </Router>

  );
}

export default App;
