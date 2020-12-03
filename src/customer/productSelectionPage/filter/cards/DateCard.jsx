import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { useConfirmation } from '../../../../services/ConfirmationService';
import appColors from '../../../../styles/AppColors';
import AlertDialog from '../../../../utils/dialog';
import ProdSelectContext from '../../ProdSelectContext';
import storeContext from '../../../storeContext';

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: '#e0e6e6',
    width: 70,
    height: 75,
    borderRadius: 10,
    cursor: 'pointer',
  },
  weekDay: {
    backgroundColor: appColors.secondary,
    borderRadius: 10,
    color: 'white',
    textAlign: 'center',
  },
  date: {
    textAlign: 'center',
    fontSize: 16,
  },
  time: {
    textAlign: 'center',
    fontSize: 10,
  },
}));

const DateCard = (props) => {
  const productSelect = useContext(ProdSelectContext);
  const store = useContext(storeContext);
  const confirm = useConfirmation();
  const todaysDayUpper = props.weekDayFull.toUpperCase();

  const [isClicked, setIsClicked] = useState(false);
  const [showCard, setShowCard] = useState(
    productSelect.farmsClicked.size == 0 ? true : false
  );

  const cardClicked = () => {
    onConfirmDayChange();
  };

  const onConfirmDayChange = () => {
    localStorage.removeItem('selectedDay');
    if (isClicked) {
      if (store.cartTotal !== 0) {
        displayDialog(clearCartAndDay);
      } else {
        clearCartAndDay();
      }
    } else {
      console.log('store.cartTotal: ', store.cartTotal);
      if (productSelect.dayClicked != '' && store.cartTotal !== 0) {
        displayDialog(changeDay);
      } else {
        changeDay();
      }
    }
  };

  function displayDialog(action) {
    confirm({
      variant: 'danger',
      catchOnCancel: true,
      title: 'About to Clear Cart',
      description:
        'If you change or deselect your delivery day your cart will be cleared. Would you like to proceed?',
    })
      .then(() => {
        action();
      })
      .catch(() => {});
  }

  function clearCartAndDay() {
    store.setExpectedDelivery('');
    productSelect.setDayClicked('');
    store.setCartTotal(0);
    store.setCartItems({});
    setIsClicked(false);
  }

  function changeDay() {
    productSelect.setDayClicked(props.id);
    setIsClicked(true);
    store.setExpectedDelivery(
      props.weekDayFull +
        ', ' +
        props.month +
        ' ' +
        props.day +
        ' from ' +
        props.time
    );
    store.setStartDeliveryDate(
      props.year +
        '-' +
        (props.monthInNumber < 10
          ? '0' + props.monthInNumber
          : props.monthInNumber) +
        '-' +
        (props.date < 10 ? '0' + props.date : props.date)
    );
    store.setCartTotal(0);
    store.setCartItems({});
    localStorage.setItem('selectedDay', props.id);
  }

  useEffect(() => {
    const selectedDay = localStorage.getItem('selectedDay');
    console.log(
      'selectedDay: ',
      selectedDay,
      props.id,
      productSelect.dayClicked
    );
    if (props.id !== productSelect.dayClicked) {
      setIsClicked(false);
    } else {
      setIsClicked(true);
      store.setExpectedDelivery(
        props.month +
          ' ' +
          props.day +
          ', ' +
          props.weekDayFull +
          ' from ' +
          props.time
      );
    }
  }, [productSelect.dayClicked]);

  // TODO testing: figure out a whether to do || or && for farms
  useEffect(() => {
    let _showCard = productSelect.farmsClicked.size == 0 ? true : false;
    let showCount = 0;
    productSelect.farmsClicked.forEach((farmId) => {
      const daytime = props.weekDayFullUpper + '&' + props.time;
      if (store.farmDaytimeDict[farmId].has(daytime)) {
        showCount += 1;
      }
    });
    _showCard = showCount === productSelect.farmsClicked.size;
    setShowCard(_showCard);
  }, [productSelect.farmsClicked]);
  const classes = useStyles();

  // IMPORTANT: if you're going to use the hidden field, make sure you either
  //            put a conditional on the display prop, wrap it alone in a Box tag,
  //            not use display
  return (
    <>
      <Box
        hidden={!showCard}
        justifyContent="center"
        width="100%"
        m={0.5}
        p={0.5}
      >
        <div className={classes.card} onClick={cardClicked}>
          <div className={classes.weekDay}>{props.weekDay}</div>
          <Box
            mt={1}
            className={classes.date}
            style={{
              color: isClicked ? appColors.primary : appColors.secondary,
            }}
          >
            {props.month} {props.day}
            <br />
            <Box
              className={classes.time}
              style={{
                color: isClicked ? appColors.primary : appColors.secondary,
              }}
            >
              {props.time}
            </Box>
          </Box>
        </div>
      </Box>
    </>
  );
};

export default DateCard;
