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
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import StorefrontIcon from '@material-ui/icons/Storefront';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import MoneyOffOutlinedIcon from '@material-ui/icons/MoneyOffOutlined';
import HistoryOutlinedIcon from '@material-ui/icons/HistoryOutlined';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';

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
          pathname: '/profile-info',
          state: { leftTabChosen: 0 },
        });
        break;
      case 'Rewards':
        history.push({
          pathname: '/store',
          state: { rightTabChosen: 0  },
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
      case 'home':
          history.push({
          pathname: '',
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
            <MenuIcon style={{color:"white",width:'3rem',height:'3rem'}} 
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
              <Paper style={{ backgroundColor: appColors.secondary }}>
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
                      <div style={{display:'flex'}}>
                      <div>
                      <StorefrontIcon
                       fontSize="Medium"
                       key={props.storePage || ''}
                       aria-hidden="false"
                       aria-label="Shopping cart"
                       style={{ color: 'white' }}
                      />
                      </div>
            
                      <div style={{marginLeft:'1rem', fontSize:'18px', color:'white'}}>
                      Store
                      </div>
                      </div>
                      
                    </MenuItem>
                  
                    <MenuItem
                      disabled={isDisabled}
                      onClick={(e) => {
                        handleMenuItem(e, 'Rewards');
                      }}
                    >
                      <div style={{display:'flex'}}>
                      <div>
                      <ShoppingCartOutlinedIcon
                       fontSize="Medium"
                       key={props.storePage || ''}
                       aria-hidden="false"
                       aria-label="Shopping cart"
                       style={{ color: 'white' }}
                      />
                      </div>
            
                      <div style={{marginLeft:'1rem', fontSize:'18px', color:'white'}}>
                      Cart
                      </div>
                      </div>
                    </MenuItem>
                    <MenuItem
                      disabled={isDisabled}
                      onClick={(e) => {
                        handleMenuItem(e, 'History');
                      }}
                    >
                           <div style={{display:'flex'}}>
                      <div>
                      <HistoryOutlinedIcon
                       fontSize="Medium"
                       key={props.storePage || ''}
                       aria-hidden="false"
                       aria-label="Shopping cart"
                       style={{ color: 'white' }}
                      />
                      </div>
            
                      <div style={{marginLeft:'1rem', fontSize:'18px', color:'white'}}>
                      History
                      </div>
                      </div>
                    </MenuItem>

                    <MenuItem
                      disabled={isDisabled}
                      onClick={(e) => {
                        handleMenuItem(e, 'Refund');
                      }}
                    >
                            <div style={{display:'flex'}}>
                      <div>
                      <MoneyOffOutlinedIcon
                       fontSize="Medium"
                       key={props.storePage || ''}
                       aria-hidden="false"
                       aria-label="Shopping cart"
                       style={{ color: 'white' }}
                      />
                      </div>
            
                      <div style={{marginLeft:'1rem', fontSize:'18px', color:'white'}}>
                      Refund
                      </div>
                      </div>
                    </MenuItem>

                    <MenuItem
                      disabled={isDisabled}
                      onClick={(e) => {
                        handleMenuItem(e, 'Profile Info');
                      }}
                    >
                      <div style={{display:'flex'}}>
                      <div>
                      <AccountCircleOutlinedIcon
                       fontSize="Medium"
                       key={props.storePage || ''}
                       aria-hidden="false"
                       aria-label="Shopping cart"
                       style={{ color: 'white' }}
                      />
                      </div>
            
                      <div style={{marginLeft:'1rem', fontSize:'18px', color:'white'}}>
                      Profile
                      </div>
                      </div>
                    </MenuItem>
                    {/* <MenuItem
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
                    </MenuItem> */}
                 
                 
                    {auth.isAuth && (
                      <MenuItem
                        disabled={isDisabled}
                        onClick={handleClickLogOut}
                      >
                          <div style={{display:'flex'}}>
                      <div>
                      <ExitToAppOutlinedIcon
                       fontSize="Medium"
                       key={props.storePage || ''}
                       aria-hidden="false"
                       aria-label="Shopping cart"
                       style={{ color: 'white' }}
                      />
                      </div>
            
                      <div style={{marginLeft:'1rem', fontSize:'18px', color:'white'}}>
                      Logout
                      </div>
                      </div>
                      </MenuItem>
                        )}
                       <MenuItem
                       disabled={isDisabled}
                       onClick={(e) => {
                         handleMenuItem(e, 'Home');
                       }}
                     >
                       <div style={{display:'flex'}}>
                       <div>
                       <HomeOutlinedIcon
                        fontSize="Medium"
                        key={props.storePage || ''}
                        aria-hidden="false"
                        aria-label="Shopping cart"
                        style={{ color: 'white' }}
                       />
                       </div>
             
                       <div style={{marginLeft:'1rem', fontSize:'18px', color:'white'}}>
                       Return to Home
                       </div>
                       </div>
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
