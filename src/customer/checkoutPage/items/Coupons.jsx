import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useElements, CardElement } from '@stripe/react-stripe-js';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Box, TextField, Button, Paper } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import appColors from '../../../styles/AppColors';
import CartItem from './cartItem';
import storeContext from '../../storeContext';
import checkoutContext from '../CheckoutContext';

function calculateSubTotal(items) {
  var result = 0;

  for (const item of items) {
    result += item.count * item.price;
  }

  return result;
}

export default function Coupons(props) {
  const store = useContext(storeContext);

  // TODO:  Coupon properties: Title, Message, expiration
  // TODO:  Sort coupons to be selected, available, unavailable
  // TODO:  Grab coupons from backend API
  // TODO:  Implement and add how much needed (threshold - subtotal): ex.Buy $10 more produce to be eligible
  // TODO:  Add expiration date
  const [avaiCouponData, setAvaiCouponData] = useState([]);
  const [unavaiCouponData, setUnavaiCouponData] = useState([]);

  useEffect(() => {
    if (store.profile.email !== '') {
      console.log('coupons fetched');
      const url =
        process.env.REACT_APP_SERVER_BASE_URI +
        'available_Coupons/' +
        store.profile.email;
      axios
        .get(url)
        .then((res) => {
          const availableCoupons = [];
          const unavailableCoupons = [];
          const couponsRes = res.data.result;

          // notes: title
          // discount_amount: apply first if applicable
          // discount_percent: apply to subtotal - discount_amount
          // discount_shipping: apply if applicable
          // valid: check and show if true
          // limits:  if num_used < limits show coupon
          // num_used:  increment by 1 on each order
          // recurring: is one time use
          // expired coupons wont send through
          for (const i in couponsRes) {
            const couponData = {
              index: i,
              title: couponsRes[i].notes,
              threshold: couponsRes[i].threshold,
              discountPercent: couponsRes[i].discount_percent,
              discountAmount: couponsRes[i].discount_amount,
              discountShipping: couponsRes[i].discount_shipping,
              expDate: new Date(couponsRes[i].expire_date),
              status:
                props.subTotal > couponsRes[i].threshold
                  ? 'available'
                  : 'unavailable',
            };
            if (couponData.status === 'available') {
              availableCoupons.push(couponData);
            } else {
              unavailableCoupons.push(couponData);
            }
          }
          setAvaiCouponData(availableCoupons);
          setUnavaiCouponData(unavailableCoupons);
        })
        .catch((e) => {
          console.log('Error getting coupons: ', e);
        });
    }
  }, [store.profile.email]);

  const Coupon = (coupProps) => {
    const isFreeDelivery = coupProps.percentOff == -1;

    function onCouponClick() {
      const newCouponData = [];
      for (const coupon of avaiCouponData) {
        const newCoupon = coupon;
        if (coupon.index !== coupProps.index) {
          if (coupon.status !== 'unavailable') {
            newCoupon.status = 'available';
            if (coupon.percentOff === -1) props.setDeliveryFee(1.5);
          }
        } else {
          newCoupon.status =
            coupon.status === 'selected' ? 'available' : 'selected';
          if (newCoupon.status === 'selected') {
            if (coupon.percentOff === -1) {
              props.setDeliveryFee(0);
              props.setPromoApplied(0);
            } else {
              props.setPromoApplied(props.subTotal * (coupon.percentOff / 100));
            }
          } else {
            if (coupon.percentOff === -1) {
              props.setDeliveryFee(1.5);
            } else {
              props.setPromoApplied(0);
            }
          }
        }
        newCouponData.push(newCoupon);
      }
      setAvaiCouponData(newCouponData);
    }

    return (
      <Box
        mx={1}
        style={{ cursor: coupProps.status != 'unavailable' ? 'pointer' : '' }}
        onClick={onCouponClick}
      >
        <Box
          style={{
            width: '200px',
            height: '96px',
            backgroundImage: `url(${
              './coupon_img/' + coupProps.status + '.png'
            })`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <Box textlign="left" pl={3} pr={6} pt={2}>
            <Box fontSize={12} fontWeight="bold">
              {coupProps.title}
            </Box>
            <Box fontSize="12px">Any order above ${coupProps.threshold}</Box>
            <Box fontSize="10px">
              {/* +1 because JS date object function returns months from 0-11 and similarly for days */}
              exp: {coupProps.expDate.getDay() + 1}/
              {coupProps.expDate.getMonth() + 1}/
              {coupProps.expDate.getFullYear()}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Paper
      style={{
        marginTop: 10,
        backgroundColor: appColors.componentBg,
        height: '100px',
        overflow: 'auto',
      }}
    >
      {/* START: Coupons */}
      <Box display="flex" justifyContent="center">
        {avaiCouponData.map(Coupon)}
        {unavaiCouponData.map(Coupon)}
      </Box>
      {/* END: Coupons */}
    </Paper>
  );
}
