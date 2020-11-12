import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import DisplayProducts from './customer/pages/displayProduct';
import Cart from './customer/pages/cart';
import Store from './customer/Store';
import FarmGrid from './customer/FarmGrid';
import Profile from './customer/Profile';
import Landing from './customer/Landing';
import Signup from './customer/auth/Signup';
import SocialSignUp from './customer/auth/SocialSignUp';
import Login from './customer/auth/Login';
import History from './customer/pages/history';
import Refund from './customer/pages/Refund';
import PayStripe from './customer/pages/stripe';
import Days from './customer/pages/days';
import AuthAdminRoute from './auth/AuthAdminRoute';
import AuthAdminLoginRoute from './auth/AuthAdminLoginRoute';
import AdminSocialSignup from './admin/AdminSocialSignup';
import AdminSignup from './admin/AdminSignup';
import AdminLogin from './admin/AdminLogin';
import Admin from './admin/Admin';

// Nav here will take all the adress from children page to this and give
// it to the switch route

function Nav(authLevel, isAuth) {
  return (
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/socialsignup" component={SocialSignUp} />
      <Route exact path="/products" component={DisplayProducts} />
      <Route path="/cart" component={Cart} />
      <Route path="/stripe" component={PayStripe} />
      <Route path="/history" component={History} />
      <Route path="/refund" component={Refund} />
      <Route path="/days" component={Days} />
      <Route exact path="/store" component={Store} />
      <Route exact path="/farms" component={FarmGrid} />
      <Route exact path="/profile" component={Profile} />
      <AuthAdminRoute
        path="/admin"
        component={Admin}
        auth={isAuth}
        authLevel={authLevel}
      />
      <AuthAdminLoginRoute
        path="/adminlogin"
        component={AdminLogin}
        auth={isAuth}
      />
      <AuthAdminLoginRoute
        path="/socialsignup"
        component={AdminSocialSignup}
        auth={isAuth}
      />
      <AuthAdminLoginRoute
        path="/signup"
        component={AdminSignup}
        auth={isAuth}
      />
      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}

export default Nav;