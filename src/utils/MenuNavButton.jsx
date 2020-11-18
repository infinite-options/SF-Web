import React, { useContext } from 'react';
import Cookies from 'js-cookie';
import { AuthContext } from '../auth/AuthContext';
import { withRouter } from 'react-router';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

function MenuListComposition(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const Auth = useContext(AuthContext);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleMenuItem = (event, nav) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    switch (nav) {
      case 'days':
        window.location.replace('/store');
    }
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleClickLogOut = () => {
    Auth.setIsAuth(false);
    Cookies.remove('login-session');
    Cookies.remove('customer_uid');
    props.history.push('/');
  };

  return (
    <div className={classes.root}>
      <div>
        <IconButton
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <MenuIcon color="secondary" />
        </IconButton>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem
                      onClick={(e) => {
                        handleMenuItem(e, 'days');
                      }}
                    >
                      Days
                    </MenuItem>
                    <MenuItem
                      disabled
                      onClick={(e) => {
                        handleMenuItem(e, 'orders');
                      }}
                    >
                      Orders
                    </MenuItem>
                    <MenuItem
                      disabled
                      onClick={(e) => {
                        handleMenuItem(e, 'profile');
                      }}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      disabled
                      onClick={(e) => {
                        handleMenuItem(e, 'informations');
                      }}
                    >
                      Information
                    </MenuItem>
                    <MenuItem onClick={handleClickLogOut}>
                      Logout
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
}

export default withRouter(MenuListComposition)