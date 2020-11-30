import React, { useState, useEffect } from 'react';
import OptionBar from './OptionBar';
import Main from './Main';
import { Paper } from '@material-ui/core';

import axios from 'axios';

let API_URL = process.env.REACT_APP_SERVER_BASE_URI + '';

function Notifications({ farmID, farmName, ...props }) {
  const [notification, setNotification] = useState(
    Number(localStorage.getItem('messageNotification')) || 'Notifications'
  );
  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('messageNotification', notification);
  }, [notification]);

  useEffect(() => {
    axios
      .get(API_URL + 'customer_info')
      .then((res) => {
        console.log(res);
        setCustomerList(res.data.result);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  }, [notification]);

  return (
    <div hidden={props.hidden}>
      <OptionBar
        notification={notification}
        setNotification={setNotification}
        setSelectedCustomers={setSelectedCustomers}
        setMessage={setMessage}
      />
      <Paper style={paperStyle} elevation={0}>
        <Main
          notification={notification}
          customerList={customerList}
          selectedCustomers={selectedCustomers}
          setSelectedCustomers={setSelectedCustomers}
          message={message}
          setMessage={setMessage}
        />
      </Paper>
    </div>
  );
}

const paperStyle = {
  height: '2000px',
  width: '95%',
  maxWidth: '2000px',
  textAlign: 'center',
  display: 'inline-block',
  padding: '0px',
  marginTop: '30px',
  backgroundColor: 'white',
};

export default Notifications;
