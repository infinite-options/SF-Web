
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext }  from './AuthContext';

const AuthAdminRoute = ({auth, component: Component, ...rest}) => {
    const context = useContext(AuthContext);
    console.log('check: ' + context.isAuth)
    return (
        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /adminlogin page
        <Route {...rest} render={props => (
            auth ?
                // Checking if user is farmer or higher
                rest.authLevel >= 1 ? 
                    <Component {...props} /> : <Redirect to ="/customer" />
                : <Redirect to="/adminlogin" />
        )} />
    );
};

export default AuthAdminRoute;