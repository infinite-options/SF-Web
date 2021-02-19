import React, { useState, useContext, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
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
import appColors from '../styles/AppColors';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    zIndex: 100,
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

//TODO: have store go to store selection
function MenuListComposition(props) {
  const classes = useStyles();
  const history = useHistory();
  const auth = useContext(AuthContext);
  const anchorRef = React.useRef(null);

  const [open, setOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(!(auth.isAuth || auth.isGuest));

  useMemo(() => {
    setIsDisabled(!(auth.isAuth || auth.isGuest));
  }, [auth.isAuth, auth.isGuest]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleMenuItem = (event, nav) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    switch (nav) {
      case 'Admin':
        if (auth.authLevel === 2)
          history.push({
            pathname: '/admin',
          });
        break;
      case 'Farm':
        if (auth.authLevel === 1)
          history.push({
            pathname: '/admin',
          });
        break;
      case 'Store':
        history.push({
          pathname: '/store',
          state: { storePage: 0 },
        });
        break;
      case 'Profile Info':
        history.push({
          pathname: '/store',
          state: { leftTabChosen: 0 },
        });
        break;
      case 'Rewards':
        history.push({
          pathname: '/store',
          state: { leftTabChosen: 2 },
        });
        break;
      case 'Payment Details':
        history.push({
          pathname: '/store',
          state: { leftTabChosen: 4 },
        });
        break;
      case 'Checkout':
        history.push({
          pathname: '/store',
          state: { rightTabChosen: 0 },
        });
        break;
      case 'History':
        history.push({
          pathname: '/store',
          state: { rightTabChosen: 2 },
        });
        break;
      case 'Refund':
        history.push({
          pathname: '/store',
          state: { rightTabChosen: 4 },
        });
        break;
      default:
        break;
    }
    setOpen(false);
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
    localStorage.removeItem('currentStorePage');
    localStorage.removeItem('cartTotal');
    localStorage.removeItem('cartItems');
    Cookies.remove('login-session');
    Cookies.remove('customer_uid');

    auth.setIsAuth(false);
    auth.setAuthLevel(0);
    props.history.push('/');
  };

  // TEST: Configure Menu buttons
  return (
    <div className={classes.root}>
      <div>
        <IconButton
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
            <MenuIcon color="secondary" 
              aria-hidden="false"
              aria-label = 'Menu list'
            />
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
              <Paper style={{ backgroundColor: appColors.componentBg }}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                  >
                    {auth.authLevel === 2 && (
                      <MenuItem
                        disabled={isDisabled}
                        onClick={(e) => {
                          handleMenuItem(e, 'Admin');
                        }}
                      >
                        Admin
                      </MenuItem>
                    )}
                    {auth.authLevel === 1 && (
                      <MenuItem
                        disabled={isDisabled}
                        onClick={(e) => {
                          handleMenuItem(e, 'Farm');
                        }}
                      >
                        Farm
                      </MenuItem>
                    )}
                    <MenuItem
                      disabled={isDisabled}
                      onClick={(e) => {
                        handleMenuItem(e, 'Store');
                      }}
                    >
                      Store
                    </MenuItem>
                    <MenuItem
                      disabled={isDisabled}
                      onClick={(e) => {
                        handleMenuItem(e, 'Profile Info');
                      }}
                    >
                      Profile Info
                    </MenuItem>
                    <MenuItem
                      disabled={isDisabled}
                      onClick={(e) => {
                        handleMenuItem(e, 'Rewards');
                      }}
                    >
                      Rewards
                    </MenuItem>
                    <MenuItem
                      disabled={isDisabled}
                      onClick={(e) => {
                        handleMenuItem(e, 'Payment Details');
                      }}
                    >
                      Payment Details
                    </MenuItem>
                    <MenuItem
                      disabled={isDisabled}
                      onClick={(e) => {
                        handleMenuItem(e, 'Checkout');
                      }}
                    >
                      Checkout
                    </MenuItem>
                    <MenuItem
                      disabled={isDisabled}
                      onClick={(e) => {
                        handleMenuItem(e, 'History');
                      }}
                    >
                      History
                    </MenuItem>
                    <MenuItem
                      disabled={isDisabled}
                      onClick={(e) => {
                        handleMenuItem(e, 'Refund');
                      }}
                    >
                      Refund
                    </MenuItem>
                    {auth.isAuth && (
                      <MenuItem
                        disabled={isDisabled}
                        onClick={handleClickLogOut}
                      >
                        Logout
                      </MenuItem>
                    )}
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

export default withRouter(MenuListComposition);
