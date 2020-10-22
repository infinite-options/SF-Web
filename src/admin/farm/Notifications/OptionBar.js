import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

// import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';

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
  root: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  rightButtons: {
    position: 'absolute',
    right: '10px',
  },
  selectType: {
      marginRight: theme.spacing(2),
  }
}));

function OptionBar({notification, setNotification, ...props }) {
    const handleNotificationChange = (event) => {
        console.log(event.target.value)
        setNotification(event.target.value)
    }

    const classes = useStyles();
    return (
        <div className={classes.root}>
          <ThemeProvider theme={theme}>
            <AppBar color="primary" position="static">
                <Toolbar>
                    <Select
                        defaultValue={"Notififications"}
                        className={classes.selectType}
                        onChange={handleNotificationChange}
                    >
                        <MenuItem value={"Notififications"}>Notifications</MenuItem>
                        <MenuItem value={"SMS"}>SMS</MenuItem>
                    </Select>
                    <Button size={"small"} className={classes.button}>History</Button>
                    <Button size={"small"} className={classes.button}>Saved Groups</Button>
                    <Button size={"small"} className={classes.button}>Saved Messages</Button>
                </Toolbar>
            </AppBar>
          </ThemeProvider>        
        </div>
  );
}

export default OptionBar;