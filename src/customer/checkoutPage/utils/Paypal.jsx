import React, { useRef, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { PayPalButton } from 'react-paypal-button-v2';

import { useConfirmation } from '../../../services/ConfirmationService';
import { onPurchaseComplete } from './onPurchaseComplete';
import checkoutContext from '../CheckoutContext';
import storeContext from '../../storeContext';
import { AuthContext } from 'auth/AuthContext';

const cookies = new Cookies();

const PayPal = ({ value, deliveryInstructions }) => {
  const store = useContext(storeContext);
  const checkout = useContext(checkoutContext);
  const auth = useContext(AuthContext);
  const confirm = useConfirmation();

  const [loaded, setLoaded] = useState(false);
  const { paymentDetails, chosenCoupon } = useContext(checkoutContext);
  const { profile, startDeliveryDate, cartItems } = useContext(storeContext);
  let paypalRef = useRef();
  //[{"qty": "3", "name": "Opo Gourd", "price": "0.5", "item_uid": "310-000087", "itm_business_uid": "200-000005"}]

  // DONE: Add unit (bunch), desc (cOrganic)
  const items = Object.values(cartItems).map((item) => {
    return {
      qty: item.count,
      name: item.name,
      unit: item.unit,
      price: item.price,
      business_price: item.businessPrice,
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

  const [CLIENT_ID, setCLIENT_ID] = useState(
    process.env.NODE_ENV === 'production' ? CLIENT.production : CLIENT.sandbox
  );

  useEffect(() => {
    if (deliveryInstructions === 'SFTEST') {
      if (CLIENT_ID !== CLIENT.sandbox) {
        setCLIENT_ID(CLIENT.sandbox);
      }
    } else if (
      CLIENT_ID !== CLIENT.production &&
      process.env.NODE_ENV === 'production'
    ) {
      setCLIENT_ID(CLIENT.production);
    }
  }, [deliveryInstructions]);

  //TODO: PayPal cart doesn't clear
  return (
    <div>
      <PayPalButton
        amount={value}
        // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
        onSuccess={(details, data) => {
          const dataSending = {
            pur_customer_uid: auth.isAuth
              ? cookies.get('customer_uid')
              : 'GUEST',
            pur_business_uid: 'WEB',
            items,
            order_instructions: 'fast',
            delivery_instructions: deliveryInstructions,
            order_type: 'produce',
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
            pay_coupon_id: chosenCoupon || ' ',
            amount_due: paymentDetails.amountDue.toString(),
            amount_discount: paymentDetails.discount.toString(),
            amount_paid: paymentDetails.amountDue.toString(),
            info_is_Addon: 'FALSE',
            cc_num: 'NULL',
            cc_exp_date: 'NULL',
            cc_cvv: 'NULL',
            cc_zip: 'NULL',
            charge_id: 'NULL',
            payment_type: 'PAYPAL',
            subtotal: paymentDetails.subtotal.toString(),
            service_fee: paymentDetails.serviceFee.toString(),
            delivery_fee: paymentDetails.deliveryFee.toString(),
            driver_tip: paymentDetails.driverTip.toString(),
            taxes: paymentDetails.taxes.toString(),
          };
          console.log('data sending: ', dataSending);
          axios
            .post(
              process.env.REACT_APP_SERVER_BASE_URI + 'purchase_Data_SF',
              dataSending
            )
            .then(() => {
              onPurchaseComplete({
                store: store,
                checkout: checkout,
                confirm: confirm,
              });
            });
        }}
        options={{
          clientId: CLIENT_ID,
        }}
      />
    </div>
  );
};

export default PayPal;
