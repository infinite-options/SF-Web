import React, { useRef, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useConfirmation } from '../services/ConfirmationService';

const MobilePaypalCheckout = () => {
  const confirm = useConfirmation();

  const { props } = {};
  props.cartItems = {};
  props.value = 10;
  props.profile = {};
  const [loaded, setLoaded] = useState(false);

  let paypalRef = useRef();
  //[{"qty": "3", "name": "Opo Gourd", "price": "0.5", "item_uid": "310-000087", "itm_business_uid": "200-000005"}]
  const items = Object.values(props.cartItems || {}).map((item) => {
    return {
      qty: item.count.toString(),
      name: item.name,
      unit: item.unit,
      price: item.price.toString(),
      item_uid: item.id,
      itm_business_uid: item.business_uid,
      description: item.desc,
      img: item.img,
    };
  });

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
                      value: props.value,
                    },
                  },
                ],
              });
            },
            onApprove: async (data, actions) => {
              await actions.order.capture();
              // sending the request to write everything to database

              const dataSending = {
                pur_customer_uid: props.profile.customer_uid,
                pur_business_uid: props.business_uid,
                items,
                order_instructions: '',
                delivery_instructions: 'Keep Fresh',
                order_type: 'produce',
                delivery_first_name: props.profile.firstName,
                delivery_last_name: props.profile.lastName,
                delivery_phone_num: props.profile.phoneNum,
                delivery_email: props.profile.email,
                delivery_address: props.profile.address,
                delivery_unit: props.profile.unit,
                delivery_city: props.profile.city,
                delivery_state: props.profile.state,
                delivery_zip: props.profile.zip,
                delivery_latitude: props.profile.latitude,
                delivery_longitude: props.profile.longitude,
                purchase_notes: 'purchase_notes',
                start_delivery_date: props.startDeliveryDate,
                pay_coupon_id: '',
                amount_due: props.amountDue,
                amount_discount: props.discount,
                amount_paid: props.amountPaid,
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
                process.env.REACT_APP_SERVER_BASE_URI + 'checkout',
                dataSending
              );
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

export default MobilePaypalCheckout;
