import React, {useContext} from 'react';
import Cookies from 'js-cookie'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";

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
  navButtons: {
    position: 'absolute',
    right: '5px',
  },
  newbutton: {
    backgroundColor: 'red',
  },
  farmSelect: {
      marginRight: theme.spacing(2),
  }
}));
export default function FarmerNavBar({ changeTab , ...props }) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
        <ThemeProvider theme={theme}>
        <AppBar color="primary" position="static">
            <Toolbar>
                <div className={classes.navButtons}>
                    <Button size={"small"} className={classes.button} onClick={() => changeTab(0)}>Home</Button>
                    <Button size={"small"} className={classes.button} onClick={() => changeTab(1)}>Reports</Button>
                    <Button size={"small"} className={classes.button} onClick={() => changeTab(2)}>Settings</Button>
                    {/* <Button size={"small"} className={classes.button} > Logout</Button> */}
                </div>
            </Toolbar>
        </AppBar>
        </ThemeProvider>        
        </div>
    )
}
