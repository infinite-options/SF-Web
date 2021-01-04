import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import appColors from '../../../styles/AppColors';
import { AuthContext } from '../../../auth/AuthContext';
import storeContext from '../../storeContext';
import checkoutContext from '../CheckoutContext';
import HistoryCard from '../items/HistoryCard';

const cookies = new Cookies();
const CreateHistoryCard = (props) => {
  return (
    <HistoryCard
      id={props.purchase_uid}
      items={JSON.parse(props.items)}
      purchaseDate={new Date(props.purchase_date + '  UTC')}
      deliveryDate={new Date(props.start_delivery_date)}
      subtotal={props.subtotal}
      amountPaid={props.amount_paid}
      savings={props.amount_discount}
      driverTip={props.driver_tip}
      serviceFee={props.service_fee}
      deliveryFee={props.delivery_fee}
      taxes={props.taxes}
      address={props.delivery_address}
      unit={props.delivery_unit}
      city={props.delivery_city}
      state={props.delivery_state}
      zip={props.delivery_zip}
      paymentMethod={props.payment_type}
      deliveryInstructions={props.delivery_instructions}
      key={props.purchase_uid}
    />
  );
};

// TODO: headers for item values
// TODO: Give individual price for items
// TODO: Add delivery date
const HistoryTab = () => {
  const { isAuth } = useContext(AuthContext);
  const { profile } = useContext(storeContext);
  const { purchaseMade } = useContext(checkoutContext);
  const [historyList, setHistoryList] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [message, setMessage] = useState(true);
  function loadHistory(setHistoryList, setHistoryLoading) {
    axios
      .get(
        process.env.REACT_APP_SERVER_BASE_URI +
          'history/' +
          cookies.get('customer_uid')
      )
      .then((res) => {
        if (res && res.data && res.data.result) {
          setHistoryList(res.data.result);
        }
        setHistoryLoading(false);
      });
  }

  useEffect(() => {
    if (cookies.get('customer_uid') !== '')
      loadHistory(setHistoryList, setHistoryLoading);
  }, [profile.email, purchaseMade]);

  useEffect(() => {
    if (isAuth) {
      if (historyList.length > 0) {
        setMessage('');
      } else {
        if (historyLoading) setMessage('History is Loading...');
        else setMessage('No purchases have been made.');
      }
    } else {
      setMessage('Sign up to keep track of your purchases.');
    }
  }, [historyLoading, historyList]);

  return (
    <Box pt={5} px={10}>
      <Box mb={1} color={appColors.paragraphText} fontSize={20}>
        <Box mb={1} color={appColors.paragraphText} fontSize={20}>
          <label> {message} </label>
        </Box>
        {historyList.map(CreateHistoryCard)}
      </Box>
    </Box>
  );
};

export default HistoryTab;
