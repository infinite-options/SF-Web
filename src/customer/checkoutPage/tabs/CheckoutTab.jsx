import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Box, TextField, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import appColors from '../../../styles/AppColors';
import CartItem from '../items/cartItem';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  section: {
    borderBottom: '1px solid' + appColors.paragraphText,
    marginBottom: '10px',
    paddingBottom: '10px',
  },
  button: { color: appColors.buttonText, marginBottom: '10px' },
});

function itemsCart() {
  var arr = [],
    keys = Object.keys(localStorage),
    index = keys.length;
  for (var i = 0; i < index; i++) {
    var holdNum = window.localStorage.getItem(keys[i]);
    holdNum = parseInt(holdNum);
    if (keys[i].length > 30 && holdNum > 0) {
      arr.push(JSON.parse(keys[i]));
    }
  }
  return arr;
}

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: appColors.secondary,
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: appColors.secondary,
      },
    },
  },
})(TextField);

export default function CheckoutTab() {
  const classes = useStyles();
  const products = itemsCart();

  const onSubmit = (event) => {};

  function listItem(items) {
    return (
      <>
        <CartItem
          name={items.name}
          price={items.price}
          img={items.img}
          meaning={items.meaning}
          business_uid={items.business_uid}
          id={items.id}
          key={items.id}
        />
      </>
    );
  }

  return (
    <>
      <Box px={8}>
        <Box
          className={classes.section}
          height="100px"
          display="flex"
          lineHeight="100px"
        >
          <Box color={appColors.secondary}>Expected Delivery</Box>
          <Box flexGrow={1} />
          <Box>Expected Delivery</Box>
        </Box>
        <Box className={classes.section}>
          <Box display="flex">
            <Box fontWeight="bold" lineHeight={1.8}>
              Your Order:
            </Box>
            <Box flexGrow={1} />
            <Button
              className={classes.button}
              size="small"
              variant="contained"
              color="primary"
            >
              <AddIcon fontSize="small" />
              Add Items
            </Button>
          </Box>
          <Box my={1} px={1}>
            {products.map(listItem)}
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" px="30%">
          <Button
            className={classes.button}
            size="small"
            variant="contained"
            color="primary"
          >
            Pay with PayPal
          </Button>
          <Button
            className={classes.button}
            size="small"
            variant="contained"
            color="primary"
          >
            Pay with Stripe
          </Button>
        </Box>
      </Box>
    </>
  );
}
