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
      case 'store':
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
    Auth.setAuthLevel(0);

    localStorage.removeItem('currentStorePage');
    localStorage.removeItem('cartTotal');
    localStorage.removeItem('cartItems');
    Cookies.remove('login-session');
    Cookies.remove('customer_uid');
    props.history.push('/');
  };

  // TODO: Configure Menu buttons
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
                      onClick={(e) => {
                        handleMenuItem(e, 'store');
                      }}
                    >
                      Store
                    </MenuItem>
                    <MenuItem
                      disabled
                      onClick={(e) => {
                        handleMenuItem(e, 'rewards');
                      }}
                    >
                      Rewards
                    </MenuItem>
                    <MenuItem
                      disabled
                      onClick={(e) => {
                        handleMenuItem(e, 'payment details');
                      }}
                    >
                      Payment Details
                    </MenuItem>
                    <MenuItem
                      disabled
                      onClick={(e) => {
                        handleMenuItem(e, 'checkout');
                      }}
                    >
                      Checkout
                    </MenuItem>
                    <MenuItem
                      disabled
                      onClick={(e) => {
                        handleMenuItem(e, 'history');
                      }}
                    >
                      History
                    </MenuItem>
                    <MenuItem
                      disabled
                      onClick={(e) => {
                        handleMenuItem(e, 'refund');
                      }}
                    >
                      Refund
                    </MenuItem>
                    <MenuItem onClick={handleClickLogOut}>Logout</MenuItem>
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
