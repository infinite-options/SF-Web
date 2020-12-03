import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CheckoutTab from './tabs/CheckoutTab';
import HistoryTab from './tabs/HistoryTab';
import RefundTab from './tabs/RefundTab';
import appColors from '../../styles/AppColors';
import { Box } from '@material-ui/core';

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

export default function CheckoutRight() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
    <Paper className={classes.root} style={{ height: windowHeight - 95 }}>
      <StyledTabs
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="secondary"
        aria-label="styled tabs example"
        centered
      >
        <StyledTab label="Checkout" />
        <Box flexGrow={1} />
        <StyledTab label="History" />
        <Box flexGrow={1} />
        <StyledTab label="Refund" />
      </StyledTabs>
      {/*
      Hi Quang, I changed it back to hidden just so that the
      coupons from checkout are not re-rendering with the coupon backend API call.
      I'm sure there are ways to avoid this with the: {value != 0 && <CheckoutTab />}
      So this'll just be a quick fix for now.
      */}
      {/*Hi Jeremy, Thanks for your comment.*/}
      <Paper
        style={{
          marginTop: 10,
          backgroundColor: appColors.componentBg,
          maxHeight: '92%',
          overflow: 'auto',
        }}
      >
        <Box hidden={value !== 0}>
          <CheckoutTab />
        </Box>
        {/* value is 2 because the flex spacing takes up values 1 and 3 */}
        <Box hidden={value !== 2}>
          <HistoryTab />
        </Box>
        <Box hidden={value !== 4}>
          <RefundTab />
        </Box>
      </Paper>
    </Paper>
  );
}
