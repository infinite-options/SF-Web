import React, { useContext } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Box, TextField, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import appColors from '../../../styles/AppColors';
import CartItem from '../items/cartItem';
import storeContext from '../../storeContext';

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
export default function CheckoutTab() {
  const classes = useStyles();
  const store = useContext(storeContext);

  function itemsCart() {
    var result = [];
    for (const itemId in store.cartItems) {
      result.push(store.cartItems[itemId]);
    }
    return result;
  }

  const products = itemsCart();

  const onSubmit = (event) => {};

  return (
    <Box display="flex" flexDirection="column" height="90%" px={8}>
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
      <Box flexGrow={1} />
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
  );
}
