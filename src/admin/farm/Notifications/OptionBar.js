import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

// import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
import Modal from '@material-ui/core/Modal';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Axios from 'axios';
// import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#D3D3D3',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: '#0066ff',
      main: '#0044ff',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffcc00',
    },
  },
});
const useStyles = makeStyles(theme => ({
  button: {
    marginRight: theme.spacing(1),
  },
  rightButtons: {
    position: 'absolute',
    right: '10px',
  },
  selectType: {
    marginRight: theme.spacing(2),
  },
  modalContainer: {
    position: 'absolute',
    maxHeight: 'calc(100vh - 210px)',

    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    overflowY: 'auto',
  },
}));

function OptionBar({ notification, setNotification, ...props }) {
  const handleNotificationChange = event => {
    console.log(event.target.value);
    setNotification(event.target.value);
  };

  const [openHistory, setOpenHistory] = useState(false);
  const [openGroup, setOpenGroup] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const [savedMessages, setSavedMessages] = useState([]);
  const [savedGroups, setSavedGroups] = useState([]);
  useEffect(() => {
    Axios.get(
      'https://phaqvwjbw6.execute-api.us-west-1.amazonaws.com/dev/api/v1/saved_notification_message'
    ).then(res => {
      console.log(res);
      setSavedMessages(res.data.Items);
    });
    Axios.get(
      'https://phaqvwjbw6.execute-api.us-west-1.amazonaws.com/dev/api/v1/saved_notification_group'
    ).then(res => {
      console.log(res.data.Items);
      setSavedGroups(res.data.Items);
    });
  }, []);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <AppBar color="primary" position="static">
          <Toolbar>
            <Select
              defaultValue={'Notifications'}
              className={classes.selectType}
              onChange={handleNotificationChange}
            >
              <MenuItem value={'Notifications'}>Notifications</MenuItem>
              <MenuItem value={'SMS'}>SMS</MenuItem>
            </Select>
            <Button
              size={'small'}
              className={classes.button}
              onClick={() => {
                setOpenHistory(true);
              }}
            >
              History
            </Button>
            <Button
              size={'small'}
              className={classes.button}
              onClick={() => {
                setOpenGroup(true);
              }}
            >
              Saved Groups
            </Button>
            <Button
              size={'small'}
              className={classes.button}
              onClick={() => {
                setOpenMessage(true);
              }}
            >
              Saved Messages
            </Button>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
      <Modal
        open={openHistory}
        onClose={() => {
          setOpenHistory(false);
        }}
        aria-labelledby="Message History"
        aria-describedby="Look at previously sent messages"
      >
        <div className={classes.modalContainer}>Test History Modal</div>
      </Modal>
      <Modal
        open={openGroup}
        onClose={() => {
          setOpenGroup(false);
        }}
        aria-labelledby="Customer Groups"
        aria-describedby="Look at customer groups and select"
      >
        <div className={classes.modalContainer}>
          {savedGroups.map((item, idx) => (
            <div key={idx} style={{ overflow: 'auto' }}>
              <p>
                <span style={{ fontWeight: 'bold' }}>Group ID:</span>{' '}
                {item.group_id.S}
              </p>
              <p>
                <span style={{ fontWeight: 'bold' }}>Created Date:</span>{' '}
                {item.created_date.S}
              </p>
              <p>
                <span style={{ fontWeight: 'bold' }}>Message Name:</span>{' '}
                {item.group_name.S}
              </p>
              <p>
                <span style={{ fontWeight: 'bold' }}>Customers:</span>{' '}
                {item.customers.L.map((cus, idx) => (
                  <p key={idx}>
                    {' '}
                    &emsp;
                    <span style={{ fontWeight: '500' }}> - Customer ID:</span>
                    {cus.S}
                  </p>
                ))}
              </p>
              {idx + 1 !== savedMessages.length && <hr />}
            </div>
          ))}
        </div>
      </Modal>
      <Modal
        open={openMessage}
        onClose={() => {
          setOpenMessage(false);
        }}
        aria-labelledby="Saved Messages"
        aria-describedby="Choose previously saved message"
      >
        <div className={classes.modalContainer}>
          {savedMessages.map((item, idx) => (
            <div key={idx} style={{ overflow: 'auto' }}>
              <p>
                <span style={{ fontWeight: 'bold' }}>Message ID:</span>{' '}
                {item.message_id.S}
              </p>
              <p>
                <span style={{ fontWeight: 'bold' }}>Created Date:</span>{' '}
                {item.created_date.S}
              </p>
              <p>
                <span style={{ fontWeight: 'bold' }}>Message Name:</span>{' '}
                {item.message_name.S}
              </p>
              <p>
                <span style={{ fontWeight: 'bold' }}>Message Payload:</span>{' '}
                {item.message_payload.S}
              </p>
              {idx + 1 !== savedMessages.length && <hr />}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

export default OptionBar;
