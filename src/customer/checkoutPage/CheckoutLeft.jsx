import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import appColors from '../../styles/AppColors';
import DeliveryInfo from './tabs/DeliveryInfoTab';
import PaymentTab from './tabs/PaymentTab';

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
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper className={classes.root}>
      <StyledTabs
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="secondary"
        aria-label="styled tabs example"
        centered
      >
        <StyledTab label="Delivery Info" />
        <Box flexGrow={1} />
        <StyledTab label="Rewards" />
        <Box flexGrow={1} />
        <StyledTab label="Payment Details" />
      </StyledTabs>
      <Box hidden={value != 0}>
        <DeliveryInfo />
      </Box>
      {/* value is 4 because the flex spacing takes up values 1 and 3 */}
      <Box hidden={value != 4}>
        <PaymentTab />
      </Box>
    </Paper>
  );
}
