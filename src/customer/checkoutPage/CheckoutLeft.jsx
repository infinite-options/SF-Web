import React, { useEffect, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import appColors from '../../styles/AppColors';
import DeliveryInfo from './tabs/DeliveryInfoTab';
import PaymentTab from './tabs/PaymentTab';
import RewardsTab from './tabs/RewardsTab';
import checkoutContext from './CheckoutContext';
const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    boxShadow: '0',
    '& > span': {
      maxWidth: 40,
      width: '100%',
      backgroundColor: appColors.secondary,
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: appColors.paragraphText,
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    '&:focus': {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />);

export default function CheckoutLeft({ ...props }) {
  const classes = useStyles();
  const { leftTabChosen, setLeftTabChosen } = useContext(checkoutContext);
  const location = useLocation();

  useEffect(() => {
    if (
      location.state !== undefined &&
      location.state.leftTabChosen !== undefined
    )
      setLeftTabChosen(location.state.leftTabChosen);
  }, [location]);

  const handleChangeCheckoutLeft = (e, newValue) => {
    setLeftTabChosen(newValue);
  };

  return (
    <Paper elevation={0} className={classes.root}>
      <StyledTabs
        value={leftTabChosen}
        onChange={handleChangeCheckoutLeft}
        indicatorColor="secondary"
        textColor="secondary"
        aria-label="styled tabs example"
        centered
      >
        <StyledTab label="Profile Info" />
        <Box flexGrow={1} />
        <StyledTab label="Rewards" />
        <Box flexGrow={1} />
        <StyledTab label="Payment Details" />
      </StyledTabs>
      <Paper
        elevation={0}
        style={{
          marginTop: 10,
          backgroundColor: 'white',
          // maxHeight: '92%',
          overflow: 'auto',
        }}
      >
        {leftTabChosen === 0 && <DeliveryInfo />}
        {/* value is 2 because the flex spacing takes up values 1 and 3 */}
        <Box hidden={leftTabChosen !== 2}>
          <RewardsTab />
        </Box>
        {/* value is 4 because the flex spacing takes up values 1 and 3 */}
        <Box hidden={leftTabChosen !== 4}>
          <PaymentTab />
        </Box>
      </Paper>
    </Paper>
  );
}
