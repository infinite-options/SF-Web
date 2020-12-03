import React, { useRef, useEffect, useState, useContext } from 'react';
import checkoutContext from '../CheckoutContext';
import storeContext from '../../storeContext';
import axios from 'axios';
const PayPal = ({ value, setPaypal, setCartItems }) => {
  const [loaded, setLoaded] = useState(false);
  const { amountPaid, amountDue, discount } = useContext(checkoutContext);
  const { profile, startDeliveryDate, cartItems } = useContext(storeContext);
  let paypalRef = useRef();
  const items = Object.values(cartItems).map((item) => item);

  const CLIENT = {
    sandbox: process.env.REACT_APP_PAYPAL_CLIENT_ID_TESTING,
    production: process.env.REACT_APP_PAYPAL_CLIENT_ID_LIVE,
  };

  const CLIENT_ID =
    process.env.NODE_ENV === 'production' ? CLIENT.production : CLIENT.sandbox;

  useEffect(() => {
    const script = document.createElement('script');

    script.src = `https://www.paypal.com/sdk/js?client-id=${CLIENT.sandbox}&currency=USD`;
    script.addEventListener('load', () => setLoaded(true));
    document.body.appendChild(script);

    if (loaded) {
      setTimeout(() =>
        window.paypal
          .Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    description: 'Testing',
                    amount: {
                      currency_code: 'USD',
                      value: value,
                    },
                  },
                ],
              });
            },
            onApprove: async (data, actions) => {
              await actions.order.capture();
              // sending the request to write everything to database
              const dataSending = {
                pur_customer_uid: profile.customer_uid,
                pur_business_uid:
                  cartItems[Object.keys(cartItems)[0]].business_uid,
                items,
                order_instructions: 'fast',
                delivery_instructions: 'Keep Fresh',
                order_type: 'meal',
                delivery_first_name: profile.firstName,
                delivery_last_name: profile.lastName,
                delivery_phone_num: profile.phoneNum,
                delivery_email: profile.email,
                delivery_address: profile.address,
                delivery_unit: profile.unit,
                delivery_city: profile.city,
                delivery_state: profile.state,
                delivery_zip: profile.zip,
                delivery_latitude: profile.latitude,
                delivery_longitude: profile.longitude,
                purchase_notes: 'purchase_notes',
                start_delivery_date: startDeliveryDate,
                pay_coupon_id: '',
                amount_due: amountDue,
                amount_discount: discount,
                amount_paid: amountPaid,
                info_is_Addon: 'FALSE',
                cc_num: 'NULL',
                cc_exp_date: 'NULL',
                cc_cvv: 'NULL',
                cc_zip: 'NULL',
                charge_id: 'NULL',
                payment_type: 'PAYPAL',
              };
              console.log('data sending: ', dataSending);
              await axios.post(
                'https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/checkout',
                dataSending
              );
              setPaypal(false);
              setCartItems({});
            },
          })
          .render(paypalRef)
      );
    }
  });
  return (
    <div>
      <div ref={(v) => (paypalRef = v)} />
    </div>
  );
};

export default PayPal;
