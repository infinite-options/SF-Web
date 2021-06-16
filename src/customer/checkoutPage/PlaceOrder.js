import axios from 'axios';

// This is only to keep the information sent in the database, this
// does not actually pay for the order.
export default function PlaceOrder(paymentType, paymentInfo) {
  const postInfo = {
    pur_customer_uid: paymentInfo.uid,
    pur_business_uid: null,
    items: paymentInfo.cartItems,
    order_instructions: '',
    delivery_instructions: paymentInfo.deliveryInstructions,
    order_type: 'produce',
    delivery_first_name: paymentInfo.firstName,
    delivery_last_name: paymentInfo.lastName,
    delivery_phone_num: paymentInfo.phoneNum,
    delivery_email: paymentInfo.email,
    delivery_address: paymentInfo.address,
    delivery_unit: paymentInfo.unit,
    delivery_city: paymentInfo.city,
    delivery_state: paymentInfo.state,
    delivery_zip: paymentInfo.zip,
    delivery_latitude: paymentInfo.latitude,
    delivery_longitude: paymentInfo.longitude,
    purchase_notes: 'purchase_notes',
    start_delivery_date: '2020-08-02 00:00:00',
    pay_coupon_id: '',
    amount_due: paymentInfo.finalPrice,
    amount_discount: '0',
    amount_paid: paymentInfo.finalPrice,
    info_is_Addon: 'FALSE',
    cc_num: paymentInfo.ccNum,
    cc_exp_date: paymentInfo.ccExpDate, //'2028-07-01 00:00:00'
    cc_cvv: paymentInfo.ccCvv,
    cc_zip: paymentInfo.ccZip,
    charge_id: '',
    payment_type: paymentType,
  };

  axios
    .post(process.env.REACT_APP_SERVER_BASE_URI + 'purchase_Data_SF', postInfo)
    .then((response) => {
      return 'SUCCESS';
    })
    .catch((error) => {
      return 'FAIL';
    });
}
