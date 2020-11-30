import React, {useMemo} from "react";
import {useStripe, useElements, CardElement} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import Box from "@material-ui/core/Box";
import {makeStyles} from "@material-ui/core/styles";
import useResponsiveFontSize from "../../../utils/useResponsiveFontSize";
import CssTextField from "../../../utils/CssTextField";

const useStyles = makeStyles({
  label: {
    color: "#6b7c93",
    fontWeight: 300,
    letterSpacing: "0.025em"
  },
  element: {
    display: "block",
    margin: "10px 0 20px 0",
    padding: "10px 14px",
    fontSize: "1em",
    fontFamily: "Source Code Pro, monospace",
    boxShadow:
      "rgba(50, 50, 93, 0.14902) 0px 1px 3px, rgba(0, 0, 0, 0.0196078) 0px 1px 0px",
    border: 0,
    outline: 0,
    borderRadius: "4px",
    background: "white"
  }
});

const useOptions = () => {
  const fontSize = useResponsiveFontSize();
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize,
          color: "#424770",
          letterSpacing: "0.025em",
          fontFamily: "Source Code Pro, monospace",
          "::placeholder": {
            color: "#aab7c4"
          }
        },
        invalid: {
          color: "#9e2146"
        }
      }
    }),
    [fontSize]
  );

  return options;
};
const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);
const PaymentTab = () => {
  const classes = useStyles();

  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();

  const handleSubmit = async event => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement)
    });

    console.log("[PaymentMethod]", paymentMethod);

    if (error) {
      console.log("[error]", error);
    } else {
      console.log("[PaymentMethod]", paymentMethod);
    }
  };

  return (
    <Box pt={5} px={10}>
      <form onSubmit={handleSubmit}>
        <label className={classes.label}>Cardholder Name</label>
        <Box mt={1}>
          <CssTextField variant='outlined' size='small' fullWidth />
        </Box>
        <Box mt={3}>
          <label className={classes.label}>
            Card details
            <CardElement
              className={classes.element}
              options={options}
              onReady={() => {
                console.log("CardElement [ready]");
              }}
              onChange={event => {
                console.log("CardElement [change]", event);
              }}
              onBlur={() => {
                console.log("CardElement [blur]");
              }}
              onFocus={() => {
                console.log("CardElement [focus]");
              }}
            />
          </label>
        </Box>
        <button type='submit' disabled={!stripe}>
          Pay
        </button>
      </form>
    </Box>
  );
};

export default PaymentTab;
