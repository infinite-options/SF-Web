import React, { useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Carousel from 'react-multi-carousel';
import { Box } from '@material-ui/core';
import { AuthContext } from '../../../auth/AuthContext';
import storeContext from '../../storeContext';
import checkoutContext from '../CheckoutContext';

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 3000, min: 1650 },
    items: 3,
    partialVisibilityGutter: 30,
  },
  desktop: {
    breakpoint: { max: 1650, min: 1400 },
    items: 2,
    partialVisibilityGutter: 90,
  },
  tablet: {
    breakpoint: { max: 1400, min: 1250 },
    items: 1,
    partialVisibilityGutter: 330,
  },
  mobile: {
    breakpoint: { max: 1250, min: 0 },
    items: 1,
    partialVisibilityGutter: 150,
  },
};

export default function Coupons(props) {
  const store = useContext(storeContext);
  const auth = useContext(AuthContext);
  const checkout = useContext(checkoutContext);

  // Coupon properties: Title, Message, Expiration, Saving
  // DONE:  if threshold is 0 "No minimum purchase"
  // DONE:  if amountNeeded is 0 take out needed message
  // DONE:  Sort coupons to be selected, available, unavailable
  // DONE:  Grab coupons from backend API
  // DONE:  Implement and add how much needed (threshold - subtotal): ex.Buy $10 more produce to be eligible
  // TEST:  change saving with need to be eligible
  // DONE:  Add how much saved
  // DONE:  Add expiration date
  // DONE:  See if dots in carosel view can move down
  // BUG:   amountSaved is the same on every coupon on first
  //
  const [avaiCouponData, setAvaiCouponData] = useState([]);
  const [unavaiCouponData, setUnavaiCouponData] = useState([]);

  useMemo(() => {
    const allCoupons = avaiCouponData.concat(unavaiCouponData);
    console.log('allCoupons: ', allCoupons);
    const availableCoupons = [];
    const unavailableCoupons = [];

    for (const coupon of allCoupons) {
      const couponData = {
        id: coupon.id,
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
          props.subtotal > 0 && props.subtotal >= coupon.threshold
            ? 'available'
            : 'unavailable',
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
      checkout.setChosenCoupon('');
    }

    setAvaiCouponData(availableCoupons);
    setUnavaiCouponData(unavailableCoupons);
  }, [props.subtotal]);
  const loadCoupons = () => {
    console.log('coupons fetched');
    const url =
      process.env.REACT_APP_SERVER_BASE_URI +
      'available_Coupons/' +
      (auth.isAuth ? store.profile.email : 'guest');
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
              id: couponsRes[i].coupon_uid,
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
                props.subtotal > 0 && props.subtotal >= couponsRes[i].threshold
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
        } else {
          props.setDeliveryFee(
            props.subtotal === 0 ? 0 : props.originalDeliveryFee
          );
          props.setPromoApplied(0);
          checkout.setChosenCoupon('');
        }

        setAvaiCouponData(availableCoupons);
        setUnavaiCouponData(unavailableCoupons);
      })
      .catch((e) => {
        console.log('Error getting coupons: ', e);
      });
  };

  useMemo(() => {
    loadCoupons();
  }, [store.profile.email]);

  const CreateCouponCard = (coupProps) => {
    return (
      <Coupon
        id={coupProps.id}
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
              checkout.setChosenCoupon('');
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
            width: '220px',
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
          <Box textlign="left" pl={2} pr={6} pt={1.5}>
            <Box fontSize={12} pr={1} height="30px" fontWeight="bold">
              {coupProps.title}
            </Box>
            <Box fontSize="12px">
              {coupProps.threshold === 0 ? 'No' : '$' + coupProps.threshold}{' '}
              minimum purchase
            </Box>
            <Box fontSize="10px">
              {/* +1 because JS date object function returns months from 0-11 and similarly for days */}
              Expires: {coupProps.expDate.getMonth() + 1}/
              {coupProps.expDate.getDate()}/{coupProps.expDate.getFullYear()}
            </Box>
            <Box
              hidden={
                coupProps.status !== 'unavailable' || coupProps.threshold === 0
              }
              fontSize="10px"
              fontStyle="oblique"
            >
              {/* +1 because JS date object function returns months from 0-11 and similarly for days */}
              Spend ${coupProps.amountNeeded.toFixed(2)} more to use
            </Box>
            <Box
              hidden={coupProps.status === 'unavailable'}
              fontSize="10px"
              fontStyle="oblique"
            >
              {/* +1 because JS date object function returns months from 0-11 and similarly for days */}
              You saved: ${coupProps.amountSaved.toFixed(2)}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  function ApplySaving(coupon) {
    const deliveryOff = props.originalDeliveryFee - coupon.discountShipping;
    props.setDeliveryFee(deliveryOff <= 0 ? 0 : deliveryOff);
    const discountAmountOff = props.subtotal - coupon.discountAmount;
    props.setPromoApplied(
      discountAmountOff < 0
        ? props.subtotal
        : coupon.discountAmount +
            parseFloat(
              (discountAmountOff * (coupon.discountPercent / 100)).toFixed(2)
            )
    );
    checkout.setChosenCoupon(coupon.id);
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
        <Box className={props.classes.section}>
          <Box fontWeight="bold" textAlign="left" mb={1} lineHeight={1.8}>
            Choose one of the eligible promos to apply:
          </Box>
          <Carousel
            arrows={true}
            swipeable={true}
            partialVisible={true}
            draggable={true}
            showDots={true}
            responsive={responsive}
          >
            {avaiCouponData.concat(unavaiCouponData).map(CreateCouponCard)}
          </Carousel>
        </Box>
      )}
    </>
  );
}
