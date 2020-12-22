import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import DisplayProducts from './customer/productSelectionPage/produce/displayProduct';
import Store from './customer/Store';
import Landing from './home/Landing';
import Signup from './auth/Signup';
import SocialSignUp from './auth/SocialSignUp';
import AuthAdminRoute from './auth/AuthAdminRoute';
import AuthAdminLoginRoute from './auth/AuthAdminLoginRoute';
import AdminSocialSignup from './admin/AdminSocialSignup';
import AdminSignup from './admin/AdminSignup';
import AdminLogin from './auth/AdminLogin';
import Admin from './admin/Admin';
import MobilePaypalCheckout from './mobile/MobilePaypalCheckout';

// Nav here will take all the adress from children page to this and give
// it to the switch route

function Nav(authLevel, isAuth) {
  return (
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/socialsignup" component={SocialSignUp} />
      <Route exact path="/products" component={DisplayProducts} />
      <Route exact path="/store" component={Store} />
      <Route path="/payment/paypal:props" component={MobilePaypalCheckout} />
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
