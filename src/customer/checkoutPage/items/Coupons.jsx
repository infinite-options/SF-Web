import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Carousel from 'react-multi-carousel';
import { Box } from '@material-ui/core';
import storeContext from '../../storeContext';

function calculateSubTotal(items) {
  var result = 0;

  for (const item of items) {
    result += item.count * item.price;
  }

  return result;
}

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 3000, min: 1370 },
    items: 4,
    partialVisibilityGutter: 10,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1370 },
    items: 3,
    partialVisibilityGutter: 10,
  },
  tablet: {
    breakpoint: { max: 1370, min: 1000 },
    items: 2,
    partialVisibilityGutter: 40,
  },
  mobile: {
    breakpoint: { max: 1000, min: 0 },
    items: 1,
    partialVisibilityGutter: 100,
  },
};

export default function Coupons(props) {
  const store = useContext(storeContext);

  // DONE:  Coupon properties: Title, Message, Expiration, Saving
  // DONE:  if threshold is 0 "No minimum purchase"
  // TODO:  if amountNeeded is 0 take out needed message
  // DONE:  Sort coupons to be selected, available, unavailable
  // DONE:  Grab coupons from backend API
  // DONE:  Implement and add how much needed (threshold - subtotal): ex.Buy $10 more produce to be eligible
  // TODO testing:  change saving with need to be eligible
  // DONE:  Add how much saved
  // DONE:  Add expiration date
  // TODO:  See if dots in carosel view can move down
  // BUG:   amountSaved is the same on every coupon on first
  //
  const [avaiCouponData, setAvaiCouponData] = useState([]);
  const [unavaiCouponData, setUnavaiCouponData] = useState([]);

  useEffect(() => {
    const allCoupons = avaiCouponData.concat(unavaiCouponData);
    console.log('allCoupons: ', allCoupons);
    const availableCoupons = [];
    const unavailableCoupons = [];

    for (const coupon of allCoupons) {
      const couponData = {
        index: coupon.index,
        title: coupon.title,
        threshold: coupon.threshold,
        discountPercent: coupon.discountPercent,
        discountAmount: coupon.discountAmount,
        discountShipping: coupon.discountShipping,
        amountSaved: calculateAmountSaved(
          coupon.discountAmount,
          coupon.discountPercent,
          coupon.discountShipping
        ),
        amountNeeded: coupon.threshold - props.subtotal,
        expDate: coupon.expDate,
        status:
          props.subtotal >= coupon.threshold ? 'available' : 'unavailable',
      };
      if (couponData.status === 'available') {
        availableCoupons.push(couponData);
      } else {
        unavailableCoupons.push(couponData);
      }
    }

    // auto select max savings on available coupons
    if (availableCoupons.length > 0) {
      const maxIndex = FindMaxSavingCouponsIndex(availableCoupons);
      availableCoupons[maxIndex].status = 'selected';
      ApplySaving(availableCoupons[maxIndex]);
      ArrayMove(availableCoupons, maxIndex, 0);
    } else {
      props.setDeliveryFee(
        props.subtotal === 0 ? 0 : props.originalDeliveryFee
      );
      props.setPromoApplied(0);
    }

    setAvaiCouponData(availableCoupons);
    setUnavaiCouponData(unavailableCoupons);
  }, [props.subtotal]);

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
          // discount_shipping: apply if applicable to service fee
          // valid: check and show if true
          // limits:  if num_used < limits show coupon
          // num_used:  increment by 1 on each order
          // recurring: is one time use
          // expired coupons wont send through
          for (const i in couponsRes) {
            // Check if coupon is expired
            const today = new Date();
            const expDate = new Date(couponsRes[i].expire_date);
            if (today <= expDate) {
              const couponData = {
                index: i,
                title: couponsRes[i].notes,
                threshold: couponsRes[i].threshold,
                discountPercent: couponsRes[i].discount_percent,
                discountAmount: couponsRes[i].discount_amount,
                discountShipping: couponsRes[i].discount_shipping,
                expDate: expDate,
                amountSaved: calculateAmountSaved(
                  couponsRes[i].discountAmount,
                  couponsRes[i].discountPercent,
                  couponsRes[i].discountShipping
                ),
                amountNeeded: couponsRes[i].threshold - props.subtotal,
                status:
                  props.subtotal >= couponsRes[i].threshold
                    ? 'available'
                    : 'unavailable',
              };

              if (couponData.status === 'available') {
                availableCoupons.push(couponData);
              } else {
                unavailableCoupons.push(couponData);
              }
            }
          }

          // auto select max savings on available coupons
          if (availableCoupons.length > 0) {
            const maxIndex = FindMaxSavingCouponsIndex(availableCoupons);
            availableCoupons[maxIndex].status = 'selected';
            ApplySaving(availableCoupons[maxIndex]);
            ArrayMove(availableCoupons, maxIndex, 0);
          }

          setAvaiCouponData(availableCoupons);
          setUnavaiCouponData(unavailableCoupons);
        })
        .catch((e) => {
          console.log('Error getting coupons: ', e);
        });
    }
  }, [store.profile.email]);

  const CreateCouponCard = (coupProps) => {
    return (
      <Coupon
        key={coupProps.index}
        index={coupProps.index}
        status={coupProps.status}
        threshold={coupProps.threshold}
        expDate={coupProps.expDate}
        amountSaved={coupProps.amountSaved}
        amountNeeded={coupProps.amountNeeded}
        title={coupProps.title}
        discountPercent={coupProps.discountPercent}
        discountAmount={coupProps.discountAmount}
        discountShipping={coupProps.discountShipping}
      />
    );
  };

  const Coupon = (coupProps) => {
    function onCouponClick() {
      if (coupProps.status !== 'unavailable') {
        const newCouponData = [];
        for (const coupon of avaiCouponData) {
          const newCoupon = coupon;
          if (coupon.index !== coupProps.index) {
            newCoupon.status = 'available';
          } else {
            newCoupon.status =
              coupon.status === 'selected' ? 'available' : 'selected';
            if (newCoupon.status === 'selected') {
              ApplySaving(newCoupon);
            } else {
              props.setDeliveryFee(props.originalDeliveryFee);
              props.setPromoApplied(0);
            }
          }
          newCouponData.push(newCoupon);
        }
        setAvaiCouponData(newCouponData);
      }
    }

    return (
      <Box key={props.key} height="115px" mt={2} property="div" mx={1}>
        <Box
          onClick={onCouponClick}
          style={{
            width: '200px',
            height: '96px',
            backgroundImage: `url(${
              './coupon_img/' + coupProps.status + '.png'
            })`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            cursor: coupProps.status != 'unavailable' ? 'pointer' : '',
          }}
        >
          <Box textlign="left" pl={3} pr={6} pt={1}>
            <Box fontSize={12} fontWeight="bold">
              {coupProps.title}
            </Box>
            <Box fontSize="12px">
              {coupProps.threshold === 0
                ? 'No minimum purchase'
                : 'Any order above $' + coupProps.threshold}
            </Box>
            <Box fontSize="10px">
              {/* +1 because JS date object function returns months from 0-11 and similarly for days */}
              Expires: {coupProps.expDate.getDay() + 1}/
              {coupProps.expDate.getMonth() + 1}/
              {coupProps.expDate.getFullYear()}
            </Box>
            <Box
              hidden={coupProps.status !== 'unavailable'}
              fontSize="10px"
              fontStyle="oblique"
            >
              {/* +1 because JS date object function returns months from 0-11 and similarly for days */}
              Spend ${coupProps.amountNeeded.toFixed(2)} to activate
            </Box>
            <Box
              hidden={coupProps.status === 'unavailable'}
              fontSize="10px"
              fontStyle="oblique"
            >
              {/* +1 because JS date object function returns months from 0-11 and similarly for days */}
              Amount saved: ${coupProps.amountSaved.toFixed(2)}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  function ApplySaving(coupon) {
    const deliveryOff = props.originalDeliveryFee - coupon.discountShipping;
    console.log('availableCoupons[coupon]: ', coupon);
    console.log('deliveryOff]: ', deliveryOff);
    props.setDeliveryFee(deliveryOff <= 0 ? 0 : deliveryOff);
    const discountAmountOff = props.subtotal - coupon.discountAmount;
    props.setPromoApplied(
      discountAmountOff < 0
        ? props.subtotal
        : coupon.discountAmount +
            discountAmountOff * (coupon.discountPercent / 100)
    );
  }

  function FindMaxSavingCouponsIndex(avaiCoupons) {
    let maxIndex = 0;
    let maxSavings = 0;
    for (const i in avaiCoupons) {
      if (avaiCoupons[i].amountSaved > maxSavings) {
        maxSavings = avaiCoupons[i].amountSaved;
        maxIndex = i;
      }
    }
    return maxIndex;
  }

  function calculateAmountSaved(amount, percent, shipping) {
    const discountOff = props.subtotal - amount;
    const promoOff =
      props.subtotal > amount
        ? amount + discountOff * (percent / 100)
        : props.subtotal;

    const deliveryOff =
      props.originalDeliveryFee > shipping
        ? shipping
        : props.originalDeliveryFee;

    return promoOff + deliveryOff;
  }

  function ArrayMove(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
  }

  return (
    // if the Carousel view is acting up in localhost, replace this componant with: <></>, save the file,
    // then undo to original, and save again and it should work as expected
    <>
      {(avaiCouponData.length > 0 || unavaiCouponData.length > 0) && (
        <Carousel
          arrows={true}
          partialVisible={true}
          swipeable={true}
          draggable={true}
          showDots={true}
          responsive={responsive}
        >
          {avaiCouponData.concat(unavaiCouponData).map(CreateCouponCard)}
        </Carousel>
      )}
    </>
  );
}
