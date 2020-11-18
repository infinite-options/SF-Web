import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const AuthAdminLoginRoute = ({ auth, component: Component, ...rest }) => {
  const context = useContext(AuthContext);
  console.log('check: ' + context.isAuth);
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /adminlogin page
    // Update 11/14: This is only used to handle Apple Login users
    <Route
      {...rest}
      render={(props) =>
        context.authLevel >= 1 ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default AuthAdminLoginRoute;
