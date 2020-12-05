import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import appColors from '../../../styles/AppColors';
import storeContext from '../../storeContext';
import HistoryCard from '../items/HistoryCard';

const CreateHistoryCard = (props) => {
  return (
    <HistoryCard
      items={JSON.parse(props.items)}
      date={props.payment_time_stamp}
      total={props.amount_paid}
      amountSaved={props.amount_paid}
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

const HistoryTab = () => {
  const { profile } = useContext(storeContext);
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SERVER_BASE_URI + 'history/' + profile.email)
      .then((res) => {
        if (res && res.data && res.data.result) setHistoryList(res.data.result);
      });
  }, [profile.email]);
  return (
    <Box pt={5} px={10}>
      <Box mb={1} color={appColors.paragraphText} fontSize={20}>
        {historyList.map(CreateHistoryCard)}
      </Box>
    </Box>
  );
};

export default HistoryTab;
