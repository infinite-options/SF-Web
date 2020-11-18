import React, { useState, useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

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
  const [farmID, setFarmID] = useState('200-000004');
  const [timeChange, setTimeChange] = useState({});
  const [deliveryTime, setDeliveryTime] = useState({});

  const [tab, setTab] = useState(
    Number(localStorage.getItem('farmerTab')) || 0
  );

  useEffect(() => {
    localStorage.setItem('farmerTab', tab);
  }, [tab]);

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
