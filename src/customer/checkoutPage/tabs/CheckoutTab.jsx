import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useElements, CardElement } from '@stripe/react-stripe-js';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Box, TextField, Button, Paper } from '@material-ui/core';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import AddIcon from '@material-ui/icons/Add';
import appColors from '../../../styles/AppColors';
import CartItem from '../items/cartItem';
import storeContext from '../../storeContext';
import checkoutContext from '../CheckoutContext';
import PlaceOrder from '../PlaceOrder';
import PayPal from './Paypal';
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

function listItem(item) {
  return (
    <>
      <CartItem
        name={item.name}
        price={item.price}
        count={item.count}
        img={item.img}
        meaning={item.meaning}
        business_uid={item.business_uid}
        id={item.id}
        key={item.id}
      />
    </>
  );
}

// TODO testing: Order confirmation for completed purchase
export default function CheckoutTab() {
  const classes = useStyles();
  const store = useContext(storeContext);
  const checkout = useContext(checkoutContext);
  const [paypal, setPaypal] = useState(false);
  const elements = useElements();

  const { setPaymentProcessing, setLeftTabChosen } = checkout;
  // Retrieve items from store context
  function getItemsCart() {
    var result = [];
    for (const itemId in store.cartItems) {
      result.push(store.cartItems[itemId]);
    }
    return result;
  }
  // cartItems is a dictonary, need to convert it into an array
  const [cartItems, setCartItems] = useState(getItemsCart());

  useEffect(() => {
    setCartItems(getItemsCart());
  }, [store.cartItems]);

  // DONE: Add service fee
  // DONE: Add Delivery tip
  // DONE: apply promo to subtotal
  // DONE: make taxes not applied to the delivery fee
  const [subtotal, setSubtotal] = useState(calculateSubTotal(cartItems));
  const [promoApplied, setPromoApplied] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(cartItems.length > 0 ? 5 : 0);
  const [serviceFee, setServiceFee] = useState(cartItems.length > 0 ? 1.5 : 0);
  const [driverTip, setDriverTip] = useState('');
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(
    subtotal -
      promoApplied.toFixed(2) +
      deliveryFee +
      serviceFee +
      parseFloat(driverTip !== '' ? driverTip : 0) +
      tax
  );
  const { setAmountDue, setAmountPaid, setDiscount } = checkout;
  useEffect(() => {
    setTotal(
      subtotal > 0
        ? subtotal -
            promoApplied.toFixed(2) +
            deliveryFee +
            serviceFee +
            tax +
            parseFloat(driverTip !== '' ? driverTip : 0)
        : 0
    );
    setAmountPaid(
      subtotal > 0
        ? parseFloat(
            (
              subtotal -
              promoApplied +
              deliveryFee +
              serviceFee +
              tax +
              parseFloat(driverTip !== '' ? driverTip : 0)
            ).toFixed(2)
          )
        : 0
    );
    setDiscount(parseFloat(promoApplied.toFixed(2)));
  }, [subtotal, promoApplied, deliveryFee, driverTip]);

  useEffect(() => {
    setSubtotal(calculateSubTotal(cartItems));
    let amountDue = parseFloat(
      (calculateSubTotal(cartItems) + deliveryFee + serviceFee).toFixed(2)
    );
    setAmountDue(amountDue);
  }, [cartItems]);

  useEffect(() => {
    setTax(0);
    setServiceFee(subtotal > 0 ? 1.5 : 0);
  }, [subtotal]);

  function onAddItemsClicked() {
    store.setStorePage(0);
    const items = Object.values(store.cartItems).map((item) => {
      return {
        qty: item.count,
        name: item.name,
        price: item.price,
        item_uid: item.id,
        itm_business_uid: item.business_uid,
      };
    });
    console.log('items: ', items);
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
    if (subtotal > 0) {
      if (paymentType === 'STRIPE') {
        // let user confirm their info before process
        console.log('Stripe is clicked');
        setPaymentProcessing(true);
        setLeftTabChosen(4);
      } else if (paymentType === 'PAYPAL') {
        console.log('Paypal is loading');
        setPaypal(true);
      }
    } else {
      alert('Please add items to your card before processing payment');
    }
  }

  return (
    <Box display="flex" flexDirection="column" height="90%" px={8}>
      {/* START: Expected Delivery */}
      <Box hidden={store.expectedDelivery !== ''} m={2} />
      <Box hidden={store.expectedDelivery === ''}>
        <Box
          className={classes.section}
          height="100px"
          display="flex"
          lineHeight="100px"
        >
          <Box color={appColors.secondary}>Expected Delivery</Box>
          <Box flexGrow={1} />
          <Box>{store.expectedDelivery}</Box>
        </Box>
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
          {cartItems.map(listItem)}
        </Box>
      </Box>
      <Box flexGrow={1} />
      {/* END: Order Items */}

      {/* START: Coupons */}
      <Coupons
        setDeliveryFee={setDeliveryFee}
        setPromoApplied={setPromoApplied}
        subtotal={subtotal}
        originalDeliveryFee={5}
        classes={classes}
      />
      {/* END: Coupons */}

      {/* START: Pricing */}
      <Box className={classes.section} display="flex">
        <Box>Subtotal</Box>
        <Box flexGrow={1} />
        <Box>${subtotal.toFixed(2)}</Box>
      </Box>
      <Box className={classes.section} display="flex">
        <Box color={appColors.secondary}>Promo Applied</Box>
        <Box flexGrow={1} />
        <Box>-${promoApplied.toFixed(2)}</Box>
      </Box>
      <Box className={classes.section} display="flex">
        <Box>Service Fee</Box>
        <Box flexGrow={1} />
        <Box>${serviceFee.toFixed(2)}</Box>
      </Box>
      <Box className={classes.section} display="flex">
        <Box>Delivery Fee</Box>
        <Box flexGrow={1} />
        <Box>${deliveryFee.toFixed(2)}</Box>
      </Box>
      <Box className={classes.section} display="flex">
        <Box>Driver Tip</Box>
        <Box flexGrow={1} />
        <Box width="70px">
          <CurrencyTextField
            variant="standard"
            value={driverTip}
            currencySymbol="$"
            minimumValue="0"
            outputFormat="string"
            decimalCharacter="."
            digitGroupSeparator=","
            onChange={(event, value) => {
              console.log(value);
              setDriverTip(value);
            }}
          ></CurrencyTextField>
        </Box>
      </Box>
      <Box className={classes.section} display="flex">
        <Box>Taxes</Box>
        <Box flexGrow={1} />
        <Box>${tax.toFixed(2)}</Box>
      </Box>
      <Box className={classes.section} fontWeight="bold" display="flex">
        <Box>Total</Box>
        <Box flexGrow={1} />
        <Box>{total.toFixed(2)}</Box>
      </Box>
      {/* END: Pricing */}

      {/* START: Payment Buttons */}
      <Box display="flex" flexDirection="column" px="30%">
        <Button
          className={classes.button}
          size="small"
          variant="contained"
          color="primary"
          onClick={() => onPayWithClicked('STRIPE')}
        >
          Pay with Stripe
        </Button>
      </Box>
      {!paypal ? (
        <Box display="flex" flexDirection="column" px="30%">
          <Button
            className={classes.button}
            size="small"
            variant="contained"
            color="primary"
            onClick={() => onPayWithClicked('PAYPAL')}
          >
            Pay with PayPal
          </Button>
        </Box>
      ) : (
        <PayPal
          value={total}
          setPaypal={setPaypal}
          setCartItems={store.setCartItems}
        />
      )}
      {/* END: Payment Buttons */}
    </Box>
  );
}
