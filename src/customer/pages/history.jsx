import React, { useState, useEffect } from 'react';
import HistoryCard from './HistoryCard';

function createHistoryCard(props) {
  var holdItem = JSON.parse(props.items);
  // console.log(holdItem);
  return (
    <HistoryCard
      shipping_address={props.delivery_address}
      purchaseID={props.purchase_uid}
      key={props.purchase_uid}
      id={props.purchase_uid}
      date={props.purchase_date}
      price={props.amount_paid}
      products={holdItem}
      paymentID={props.payment_uid}
    />
  );
}

function History() {
  // var userEmail="tazi.arthur@hotmail.com";
  var anotherEmail = 'gloria.koehl@gmail.com';
  var url = process.env.REACT_APP_SERVER_BASE_URI + 'history/' + anotherEmail;
  const [historyData, SetfetchData] = useState([]);
  const [hasHistoryError, setHasHistoryError] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  useEffect(() => {
    let flag = false;
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const responseData = await response.json();
        console.log('Got the Data');
        if (!flag) {
          SetfetchData(responseData.result);
        }
      } catch (err) {
        setHasHistoryError(true);
      } finally {
        console.log('finish loading');
        setIsHistoryLoading(false);
      }
    };
    fetchData();

    return () => {
      flag = true;
    };
  }, [url]);

  if (!isHistoryLoading && !hasHistoryError) {
    return (
      <div>
        <div className="makeTopHistory">
          {historyData.map(createHistoryCard)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="historyDiv">Welcome to hsitory checkout!!!</div>
    </div>
  );
}

export default History;
