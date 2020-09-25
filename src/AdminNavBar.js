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
import { AuthContext } from './AuthContext';
import {AdminFarmContext} from './AdminFarmContext';

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

export default function AdminNavBar() {
    const { farmID, setFarmID} = useContext(AdminFarmContext);
    const Auth = useContext(AuthContext);
    //when admin logs out, remove their login info from cookies
    const handleClickLogOut = () => {
        Auth.setIsAuth(false)
        Cookies.remove('login-session')
    }

    const handleChangeFarm = (event) => {
        console.log(event.target.value)
        setFarmID(event.target.value)
    }

    const classes = useStyles();
    return (
        <div className={classes.root}>
          <ThemeProvider theme={theme}>
            <AppBar color="primary" position="static">
                <Toolbar>
                    <div className={classes.navButtons}>
                        <Select
                        defaultValue={"200-000003"}
                        className={classes.farmSelect}
                        onChange={handleChangeFarm}
                        >
                            <MenuItem value={"200-000003"}>Esquivel Farm</MenuItem>
                            <MenuItem value={"200-000004"}>Resendiz Family</MenuItem>
                        </Select>
                        <Link to='/admin/messages' style={{ textDecoration: 'none' }}>
                            <Button size={"small"}className={classes.button} >Messages</Button>
                        </Link>
                        <Link to='/admin/charts' style={{ textDecoration: 'none' }}>
                            <Button size={"small"} className={classes.button} >Charts</Button>
                        </Link>
                        <Button size={"small"} className={classes.button} onClick={handleClickLogOut}> Logout</Button>
                    </div>
                </Toolbar>
            </AppBar>
          </ThemeProvider>        
        </div>
  );
}
