import React, { useContext, useState, useEffect } from 'react';
import { useElements, CardElement } from '@stripe/react-stripe-js';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Box, TextField, Button, Paper } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import appColors from '../../../styles/AppColors';
import CartItem from '../items/cartItem';
import storeContext from '../../storeContext';
import checkoutContext from '../CheckoutContext';
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

  const [subTotal, setSubTotal] = useState(calculateSubTotal(products));
  const [promoApplied, setPromoApplied] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(1.5);
  const [tax, setTax] = useState((subTotal + deliveryFee) * 0.075);
  const [total, setTotal] = useState(subTotal + deliveryFee + tax);
  const [couponData, setCouponData] = useState([
    {
      percentOff: 10,
      amount: 60,
      status: subTotal >= 60 ? 'available' : 'unavailable',
    },
    {
      percentOff: 15,
      amount: 75,
      status: subTotal >= 75 ? 'available' : 'unavailable',
    },
    {
      percentOff: -1,
      amount: 50,
      status: subTotal >= 50 ? 'available' : 'unavailable',
    },
  ]);

  useEffect(() => {
    setSubTotal(calculateSubTotal(products));
    setDeliveryFee(1.5);
    setPromoApplied(0);
    setTax((subTotal + deliveryFee) * 0.075);
    setTotal(subTotal + deliveryFee + tax - promoApplied);
  }, [store.cartItems]);

  useEffect(() => {
    setTotal(subTotal + deliveryFee + tax - promoApplied);
  }, [couponData]);

  useEffect(() => {
    setCouponData([
      {
        index: 0,
        percentOff: 10,
        amount: 60,
        status: subTotal >= 60 ? 'available' : 'unavailable',
      },
      {
        index: 1,
        percentOff: 15,
        amount: 75,
        status: subTotal >= 75 ? 'available' : 'unavailable',
      },
      {
        index: 2,
        percentOff: -1,
        amount: 50,
        status: subTotal >= 50 ? 'available' : 'unavailable',
      },
    ]);
  }, [subTotal]);

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

  const Coupon = (props) => {
    const isFreeDelivery = props.percentOff == -1;

    const message = isFreeDelivery
      ? 'Free delivery'
      : '$' + props.percentOff + ' off';
    const fontSize = isFreeDelivery ? 20 : 25;
    const marginBottom = isFreeDelivery ? 0.2 : 0;
    const marginTop = isFreeDelivery ? 0.5 : 0;
    const marginLeft = isFreeDelivery ? 2 : 0;

    function onCouponClick() {
      if (props.status !== 'unavailable') {
        const newCouponData = [];
        for (const coupon of couponData) {
          const newCoupon = coupon;
          if (coupon.index !== props.index) {
            if (coupon.status !== 'unavailable') {
              newCoupon.status = 'available';
              if (coupon.percentOff === -1) setDeliveryFee(1.5);
            }
          } else {
            newCoupon.status =
              coupon.status === 'selected' ? 'available' : 'selected';
            if (newCoupon.status === 'selected') {
              if (coupon.percentOff === -1) {
                setDeliveryFee(0);
                setPromoApplied(0);
              } else {
                setPromoApplied(subTotal * (coupon.percentOff / 100));
              }
            } else {
              if (coupon.percentOff === -1) {
                setDeliveryFee(1.5);
              } else {
                setPromoApplied(0);
              }
            }
          }
          newCouponData.push(newCoupon);
        }
        setCouponData(newCouponData);
      }
    }

    return (
      <Box
        mx={1}
        style={{ cursor: props.status != 'unavailable' ? 'pointer' : '' }}
        onClick={onCouponClick}
      >
        <Box position="relative" zIndex="tooltip">
          <img
            src={'./coupon_img/' + props.status + '.png'}
            style={{
              width: '200px',
              height: '96px',
            }}
          />
        </Box>
        <Box
          textalign="left"
          position="relative"
          zIndex="modal"
          top={-65}
          mb={-6}
          ml={-6}
        >
          <Box
            fontSize={fontSize}
            fontWeight="bold"
            ml={marginLeft}
            mt={marginTop}
            mb={marginBottom}
          >
            {message}
          </Box>
          <Box fontSize="12px">On any order above ${props.amount}</Box>
        </Box>
      </Box>
    );
  };

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

        {/* START: Coupons */}
        <Box className={classes.section}>
          <Box fontWeight="bold" textAlign="left" mb={1} lineHeight={1.8}>
            Choose one of the eligible promos to apply:
          </Box>
          <Box display="flex" justifyContent="center">
            {couponData.map(Coupon)}
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
            onclick={onPayWithClicked('STRIPE')}
          >
            Pay with Stripe
          </Button>
          {/* END: Payment Buttons */}
        </Box>
      </Box>
    </Paper>
  );
}
