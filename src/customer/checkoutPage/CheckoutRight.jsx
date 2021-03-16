import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import CheckoutTab from './tabs/CheckoutTab';
import HistoryTab from './tabs/HistoryTab';
import RefundTab from './tabs/RefundTab';
import appColors from '../../styles/AppColors';
import storeContext from '../storeContext';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    backgroundColor: appColors.componentBg,
    borderTopLeftRadius: 25,
  },
});

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 80,
      width: '100%',
      backgroundColor: appColors.secondary,
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: appColors.secondary,

    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    '&:focus': {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />);

export default function CheckoutRight() {
  const classes = useStyles();
  const store = useContext(storeContext);
  const location = useLocation();

  const [rightTabChosen, setRightTabChosen] = useState(0);

  useEffect(() => {
    setRightTabChosen(0);
  }, [store.cartClicked]);

  useEffect(() => {
    if (
      location.state !== undefined &&
      location.state.rightTabChosen !== undefined
    ) {
      setRightTabChosen(location.state.rightTabChosen);
    }
  }, [location]);

  const handleChange = (event, newValue) => {
    setRightTabChosen(newValue);
  };

  const [windowHeight, setWindowHeight] = React.useState(window.innerHeight);

  React.useEffect(() => {
    window.addEventListener('resize', updateWindowHeight);
    return () => window.removeEventListener('resize', updateWindowHeight);
  });

  const updateWindowHeight = () => {
    setWindowHeight(window.innerHeight);
  };

  return (
    <Paper
      elevation={0}
      className={classes.root}
      style={{
        border: '3px solid #136D74',
        borderRadius: '20px',
        width: '500px',
        float: 'right',
        marginRight: '20px',
      }}
      // style={{ height: windowHeight - 95 }}
    >
      <StyledTabs
        value={rightTabChosen}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="secondary"
        aria-label="styled tabs example"
        centered
      >
        <StyledTab
          label="Cart"
          style={{ fontSize: '20px', fontWeight: '700' }}
        />
        <Box flexGrow={1} />
        <StyledTab
          label="History"
          style={{ fontSize: '20px', fontWeight: '700' }}
        />
        <Box flexGrow={1} />
        <StyledTab
          label="Refund"
          style={{ fontSize: '20px', fontWeight: '700' }}
        />
      </StyledTabs>
      {/*
      Hi Quang, I changed it back to hidden just so that the
      coupons from checkout are not re-rendering with the coupon backend API call.
      I'm sure there are ways to avoid this with the: {rightTabChosen != 0 && <CheckoutTab />}
      So this'll just be a quick fix for now.
      */}
      {/*Hi Jeremy, Thanks for your comment.*/}
      <Paper
        elevation={0}
        style={{
          marginTop: 10,
          backgroundColor: appColors.componentBg,
          maxHeight: '92%',
          overflow: 'auto',
        }}
      >
        <Box hidden={rightTabChosen !== 0}>
          <CheckoutTab />
        </Box>
        {/* rightTabChosen is 2 because the flex spacing takes up values 1 and 3 */}
        {rightTabChosen === 2 && <HistoryTab />}
        {rightTabChosen === 4 && <RefundTab />}
      </Paper>
    </Paper>
  );
}
