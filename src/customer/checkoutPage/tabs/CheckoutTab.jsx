import React, { useContext } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Box, TextField, Button, Paper } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import appColors from '../../../styles/AppColors';
import CartItem from '../items/cartItem';
import storeContext from '../../storeContext';
import PlaceOrder from '../PlaceOrder';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  section: {
    borderBottom: '1px solid' + appColors.checkoutSectionBorder,
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

function calculateSubTotal(items) {
  var result = 0;

  for (const item of items) {
    console.log('item: ', item);
    result += item.count * item.price;
  }

  return result;
}

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

  // Retrieve items from store context
  function itemsCart() {
    var result = [];
    for (const itemId in store.cartItems) {
      result.push(store.cartItems[itemId]);
    }
    return result;
  }

  const products = itemsCart();

  const subTotal = calculateSubTotal(products);
  const deliveryFee = subTotal * 0.1;
  const tax = (subTotal + deliveryFee) * 0.075;
  const total = subTotal + deliveryFee + tax;

  const onSubmit = (event) => {};

  return (
    <Paper
      style={{
        marginTop: 10,
        backgroundColor: appColors.componentBg,
        maxHeight: '92%',
        overflow: 'auto',
      }}
    >
      <Box display="flex" flexDirection="column" height="90%" px={8}>
        {/* START: Expected Delivery */}
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
        {/* END: Expected Delivery */}

        {/* START: Order Items */}
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

        {/* END: Order Items */}
        <Box className={classes.section} display="flex">
          <Box>Subtotal</Box>
          <Box flexGrow={1} />
          <Box>${subTotal.toFixed(2)}</Box>
        </Box>
        <Box className={classes.section} display="flex">
          <Box color={appColors.secondary}>Promo Applied</Box>
          <Box flexGrow={1} />
          <Box>-${0}</Box>
        </Box>
        <Box className={classes.section} display="flex">
          <Box>Delivery Fee</Box>
          <Box flexGrow={1} />
          <Box>${deliveryFee.toFixed(2)}</Box>
        </Box>
        <Box className={classes.section} display="flex">
          <Box>Taxes</Box>
          <Box flexGrow={1} />
          <Box>${tax.toFixed(2)}</Box>
        </Box>
        <Box className={classes.section} fontWeight="bold" display="flex">
          <Box>Total</Box>
          <Box flexGrow={1} />
          <Box>${total.toFixed(2)}</Box>
        </Box>
        {/* START: Payment Buttons */}
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
            // onclick={PlaceOrder('STRIPE', paymentInfo)}
          >
            Pay with Stripe
          </Button>
          {/* END: Payment Buttons */}
        </Box>
      </Box>
    </Paper>
  );
}
