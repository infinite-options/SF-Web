import React, {useState} from 'react';
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
const useStyles = makeStyles((theme) => ({
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
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

function OptionBar({notification, setNotification, ...props }) {

    const handleNotificationChange = (event) => {
        console.log(event.target.value)
        setNotification(event.target.value)
    }

    const [openHistory, setOpenHistory] = React.useState(false);
    const [openGroup, setOpenGroup] = React.useState(false);
    const [openMessage, setOpenMessage] = React.useState(false);

    const classes = useStyles();
    return (
        <div className={classes.root}>
          <ThemeProvider theme={theme}>
            <AppBar color="primary" position="static">
                <Toolbar>
                    <Select
                        defaultValue={"Notifications"}
                        className={classes.selectType}
                        onChange={handleNotificationChange}
                    >
                        <MenuItem value={"Notifications"}>Notifications</MenuItem>
                        <MenuItem value={"SMS"}>SMS</MenuItem>
                    </Select>
                    <Button
                      size={"small"}
                      className={classes.button}
                      onClick={() => {
                        setOpenHistory(true);
                      }}
                    >
                      History
                    </Button>
                    <Button
                      size={"small"}
                      className={classes.button}
                      onClick={() => {
                        setOpenGroup(true);
                      }}
                    >
                      Saved Groups
                    </Button>
                    <Button
                      size={"small"}
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
            <div className={classes.modalContainer}>
              Test History Modal
            </div>
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
              Test Group Modal
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
              Test Message Modal
            </div>
          </Modal>
        </div>
  );
}

export default OptionBar;