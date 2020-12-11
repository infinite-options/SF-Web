import React, { useContext } from 'react';
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

function MenuListComposition(props) {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const auth = useContext(AuthContext);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleMenuItem = (event, nav) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    const pathname = auth.authLevel >= 1 ? '/admin' : '/store';
    switch (nav) {
      case 'Store':
        history.push({
          pathname: pathname,
        });
        break;
      case 'Profile Info':
        history.push({
          pathname: pathname,
          state: { leftTabChosen: 0 },
        });
        break;
      case 'Rewards':
        history.push({
          pathname: pathname,
          state: { leftTabChosen: 2 },
        });
        break;
      case 'Payment Details':
        history.push({
          pathname: pathname,
          state: { leftTabChosen: 4 },
        });
        break;
      case 'Checkout':
        history.push({
          pathname: pathname,
          state: { rightTabChosen: 0 },
        });
        break;
      case 'History':
        history.push({
          pathname: pathname,
          state: { rightTabChosen: 2 },
        });
        break;
      case 'Refund':
        history.push({
          pathname: pathname,
          state: { rightTabChosen: 4 },
        });
        break;
      default:
        break;
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
    auth.setIsAuth(false);
    auth.setAuthLevel(0);

    localStorage.removeItem('currentStorePage');
    localStorage.removeItem('cartTotal');
    localStorage.removeItem('cartItems');
    Cookies.remove('login-session');
    Cookies.remove('customer_uid');
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
              <Paper style={{ backgroundColor: appColors.componentBg }}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem
                      disabled={!auth.isAuth}
                      onClick={(e) => {
                        handleMenuItem(e, 'Store');
                      }}
                    >
                      Store
                    </MenuItem>
                    <MenuItem
                      disabled={!auth.isAuth}
                      onClick={(e) => {
                        handleMenuItem(e, 'Profile Info');
                      }}
                    >
                      Profile Info
                    </MenuItem>
                    <MenuItem
                      disabled={!auth.isAuth}
                      onClick={(e) => {
                        handleMenuItem(e, 'Rewards');
                      }}
                    >
                      Rewards
                    </MenuItem>
                    <MenuItem
                      disabled={!auth.isAuth}
                      onClick={(e) => {
                        handleMenuItem(e, 'Payment Details');
                      }}
                    >
                      Payment Details
                    </MenuItem>
                    <MenuItem
                      disabled={!auth.isAuth}
                      onClick={(e) => {
                        handleMenuItem(e, 'Checkout');
                      }}
                    >
                      Checkout
                    </MenuItem>
                    <MenuItem
                      disabled={!auth.isAuth}
                      onClick={(e) => {
                        handleMenuItem(e, 'History');
                      }}
                    >
                      History
                    </MenuItem>
                    <MenuItem
                      disabled={!auth.isAuth}
                      onClick={(e) => {
                        handleMenuItem(e, 'Refund');
                      }}
                    >
                      Refund
                    </MenuItem>
                    <MenuItem
                      disabled={!auth.isAuth}
                      onClick={handleClickLogOut}
                    >
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

export default withRouter(MenuListComposition);
