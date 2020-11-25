import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useElements, CardElement } from '@stripe/react-stripe-js';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Box, TextField, Button, Paper } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import appColors from '../../../styles/AppColors';
import CartItem from '../items/cartItem';
import storeContext from '../../storeContext';
import checkoutContext from '../CheckoutContext';
import PlaceOrder from '../PlaceOrder';
import Coupons from '../items/Coupons';

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

  const elements = useElements();

  // Retrieve items from store context
  function itemsCart() {
    var result = [];
    for (const itemId in store.cartItems) {
      result.push(store.cartItems[itemId]);
    }
    return result;
  }

  const products = itemsCart();

  // TODO: Add service fee
  // TODO: Add Delivery tip
  // TODO: apply promo to subtotal
  // TODO: make taxes not applied to the delivery fee
  const [subTotal, setSubTotal] = useState(calculateSubTotal(products));
  const [promoApplied, setPromoApplied] = useState(0);
  const [promoSubTotal, setPromoSubTotal] = useState(subTotal - promoApplied);
  const [deliveryFee, setDeliveryFee] = useState(
    store.cartItems.length > 0 ? 1.5 : 0
  );
  const [serviceFee, setServiceFee] = useState(
    store.cartItems.length > 0 ? 5 : 0
  );
  const [driverTip, setDriverTip] = useState(0);
  const [tax, setTax] = useState(subTotal * 0.075);
  const [total, setTotal] = useState(
    subTotal + deliveryFee + serviceFee + driverTip + tax
  );

  useEffect(() => {
    setSubTotal(calculateSubTotal(products));
    setDeliveryFee(store.cartTotal > 0 ? 1.5 : 0);
    setPromoApplied(0);
    setTax((subTotal + deliveryFee) * 0.075);
    setTotal(subTotal - promoApplied + deliveryFee + tax);
    console.log('store.cartItems.length: ', store.cartItems);
  }, [store.cartItems]);

  useEffect(() => {
    setTax(subTotal * 0.075);
  }, [subTotal]);

  function onAddItemsClicked() {
    store.setStorePage(0);
  }

  function onPayWithClicked(paymentType) {
    // const paymentInfo = { ...checkoutContext.userInfo };
    // // Get Stripe.js instance
    // // Call your backend to create the Checkout Session
    // const response = await fetch('/create-checkout-session', { method: 'POST' });
    // const session = await response.json();
    // // When the customer clicks on the button, redirect them to Checkout.
    // const result = await stripe.redirectToCheckout({
    //   sessionId: session.id,
    // });
    // if (result.error) {
    //   // If `redirectToCheckout` fails due to a browser or network
    //   // error, display the localized error message to your customer
    //   // using `result.error.message`.
    // }
  }

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
              onClick={onAddItemsClicked}
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

        {/* START: Coupons */}
        <Box className={classes.section}>
          <Box fontWeight="bold" textAlign="left" mb={1} lineHeight={1.8}>
            Choose one of the eligible promos to apply:
          </Box>
          <Box display="flex" justifyContent="center">
            <Coupons />
          </Box>
        </Box>

        {/* END: Coupons */}

        {/* START: Pricing */}
        <Box className={classes.section} display="flex">
          <Box>Subtotal</Box>
          <Box flexGrow={1} />
          <Box>${subTotal.toFixed(2)}</Box>
        </Box>
        <Box className={classes.section} display="flex">
          <Box color={appColors.secondary}>Promo Applied</Box>
          <Box flexGrow={1} />
          <Box>-${promoApplied.toFixed(2)}</Box>
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
        {/* END: Pricing */}

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
            onClick={onPayWithClicked('STRIPE')}
          >
            Pay with Stripe
          </Button>
          {/* END: Payment Buttons */}
        </Box>
      </Box>
    </Paper>
  );
}
