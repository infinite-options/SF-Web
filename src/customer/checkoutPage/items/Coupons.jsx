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
  const [couponData, setCouponData] = useState([]);

  useEffect(() => {
    if (store.profile.email !== '') {
      console.log('coupons fetched');
      const url =
        process.env.REACT_APP_SERVER_BASE_URI +
        '/v2/available_Coupons/' +
        store.profile.email;
      axios
        .get(url)
        .then((res) => {
          const availableCoupons = [];
          const unavailableCoupons = [];

          for (const coupon in res) {
            const couponData = {
              percentOff: coupon.discount_percent,
              expDate: Date.parse(coupon.expire_date),
            };

            if (props.subTotal > coupon.threshold) {
              couponData['status'] = 'available';
            }
          }
          setCouponData(res.result);
        })
        .catch((e) => {
          console.log('Error getting coupons: ', e);
          setCouponData([]);
        });
    }
  }, [store.profile.email]);

  const Coupon = (coupProps) => {
    const isFreeDelivery = coupProps.percentOff == -1;

    const message = isFreeDelivery
      ? 'Free delivery'
      : '$' + coupProps.percentOff + ' off';
    const fontSize = isFreeDelivery ? 20 : 25;
    const marginBottom = isFreeDelivery ? 0.2 : 0;
    const marginTop = isFreeDelivery ? 0.5 : 0;
    const marginLeft = isFreeDelivery ? 2 : 0;

    function onCouponClick() {
      if (coupProps.status !== 'unavailable') {
        const newCouponData = [];
        for (const coupon of couponData) {
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
                props.setPromoApplied(
                  props.subTotal * (coupon.percentOff / 100)
                );
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
        setCouponData(newCouponData);
      }
    }

    return (
      <Box
        mx={1}
        style={{ cursor: coupProps.status != 'unavailable' ? 'pointer' : '' }}
        onClick={onCouponClick}
      >
        <Box position="relative" zIndex="tooltip">
          <img
            src={'./coupon_img/' + coupProps.status + '.png'}
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
          <Box fontSize="12px">On any order above ${coupProps.amount}</Box>
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
      {/* START: Coupons */}
      <Box display="flex" justifyContent="center">
        {couponData.map(Coupon)}
      </Box>
      {/* END: Coupons */}
    </Paper>
  );
}
