import React, { useState, useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import AdminNavBar from './AdminNavBar';
import Farmer from './farm/Farmer';
import { AdminFarmContext } from './AdminFarmContext';
import { AuthContext } from '../auth/AuthContext';
//within this admin page, we need ability to display any farmer page
//the option to select which farm to view is in AdminNavBar
//get selected farm from AdmiNavBar and use it in Farmer
//to pass data easily, wrap AdminNavBar and Farmer in a Provider

function Admin() {
  const Auth = useContext(AuthContext);
  const [farmID, setFarmID] = useState('');
  const [timeChange, setTimeChange] = useState({});
  const [deliveryTime, setDeliveryTime] = useState({});

  const [tab, setTab] = useState(
    Number(localStorage.getItem('farmerTab')) || 0
  );

  useEffect(() => {
    localStorage.setItem('farmerTab', tab);
  }, [tab]);

  useEffect(() => {
    if (Auth.authLevel >= 2) {
      setFarmID('200-000004');
    } else {
      axios
        .get(
          process.env.REACT_APP_SERVER_BASE_URI +
            'Profile/' +
            Cookies.get('customer_uid')
        )
        .then((response) => {
          let customerInfo = response.data.result[0];
          console.log(customerInfo.role);
          setFarmID(customerInfo.role);
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response);
          }
          console.log(err);
        });
    }
  }, []);

  return (
    <div>
      <AdminFarmContext.Provider
        value={{
          farmID,
          setFarmID,
          timeChange,
          setTimeChange,
          deliveryTime,
          setDeliveryTime,
        }}
      >
        <AdminNavBar tab={tab} setTab={setTab} />
        {Auth.authLevel >= 1 ? <Farmer tab={tab} /> : <Redirect to="/" />}
      </AdminFarmContext.Provider>
    </div>
  );
}

export default Admin;
