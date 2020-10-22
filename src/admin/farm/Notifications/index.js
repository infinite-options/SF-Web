import React, { Fragment, useState, useEffect } from "react";
import OptionBar from './OptionBar';
import Main from './Main';

function Notifications({ farmID, farmName, ...props }){
  const [notification, setNotification] = useState(Number(localStorage.getItem("messageNotification")) || 0);

  useEffect(() => {
      localStorage.setItem("messageNotification", notification);
  }, [notification]);

  return(
    <div hidden={props.hidden}>
      <OptionBar notification={notification} setNotification={setNotification} />
      <Main />
    </div>
  )
}

export default Notifications;