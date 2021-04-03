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
  dateCardContainer: {
    justifyContent: 'center',
    marginTop: theme.spacing(.5),
    marginBottom: theme.spacing(.5),
    marginRight: theme.spacing(2),
  },

  card: {
    backgroundColor: props => props.clicked ? appColors.primary : '#e0e6e6',
    width: 75,
    height: 78,
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
    fontWeight: 'bold',
    color: props => props.clicked ? 'white' : appColors.secondary,
    textAlign: 'center',
    fontSize: 16,
  },
  time: {
    textAlign: 'center',
    fontSize: 10,
  },
  accept: {
    textAlign: 'center',
    fontSize: 9,
  },
}));
const amPmTo24Hr = (time) => {
  if (time[2] !== 'a' && time[2] !== 'p') {
    time = '0' + time;
  }
  if (time[2] === 'a') {
    return time.substring(0, 2) + ':00:00';
  }
  if (time[2] === 'p') {
    return (parseInt(time.substring(0, 2)) + 12).toString() + ':00:00';
  }
};
const DateCard = (props) => {
  const [isClicked, setIsClicked] = useState(true);
  const classes = useStyles({clicked: isClicked});
  const productSelect = useContext(ProdSelectContext);
  const store = useContext(storeContext);
  const confirm = useConfirmation();

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
      if (store.dayClicked != '' && store.cartTotal !== 0) {
        displayDialog(changeDay);
      } else {
        changeDay();
      }
    }

    console.warn('Clickerino');
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
    store.setDayClicked('');
    store.setCartTotal(0);
    store.setCartItems({});
    setIsClicked(false);
  }

  function changeDay() {
    store.setDayClicked(props.id);
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
        ((props.date < 10 ? '0' : '') + props.date) +
        ' ' +
        amPmTo24Hr(props.time)
    );
    store.setCartTotal(0);
    store.setCartItems({});
    localStorage.setItem('selectedDay', props.id);
  }

  useEffect(() => {
    if (props.id !== store.dayClicked) {
      setIsClicked(false);
    } else {
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
    }
  }, [store.dayClicked]);
  

 useEffect(() => {
   if (props.unq == 0){
   console.log("---On mount once",props)
  cardClicked()
}
   },[])


  // DONE: figure out a whether to do || or && for farms
  useEffect(() => {
    let _showCard = productSelect.farmsClicked.size == 0 ? true : false;
    let showCount = 0;
    productSelect.farmsClicked.forEach((farmId) => {
      const daytime =
        props.month +
        '&' +
        props.day +
        '&' +
        props.weekDayFullUpper +
        '&' +
        props.time;
      if (store.farmDaytimeDict[farmId].has(daytime)) {
        showCount += 1;
      }
    });
    _showCard = showCount === productSelect.farmsClicked.size;
    setShowCard(_showCard);
  }, [productSelect.farmsClicked]);

  // IMPORTANT: if you're going to use the hidden field, make sure you either
  //            put a conditional on the display prop, wrap it alone in a Box tag,
  //            not use display
  return (
    <Box
      hidden={!showCard}
      className = {classes.dateCardContainer}
    >
      <div className={classes.card} onClick={cardClicked}>
        <div className={classes.weekDay}>{props.weekDay}</div>
        <Box
          mt={1}
          className={classes.date}
        >
          {props.month} {props.day}
          <br />
          <Box
            className={classes.time}
          >
            {props.time}
          </Box>
          <Box
            className={classes.accept}
          >
            order by {props.accept_hr.charAt(0) + props.accept_hr.substring(1).toLowerCase()}
          </Box>
        </Box>
      </div>
    </Box>
  );
};

export default DateCard;
