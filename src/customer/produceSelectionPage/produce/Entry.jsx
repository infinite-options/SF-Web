import React, { useState, useContext } from 'react';
import someContexts from '../../makeContext';
import { Box, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import appColors from '../../../styles/AppColors';

const useStyles = makeStyles({
  button: {
    border: '1px solid' + appColors.componentBg,
    borderRadius: 5,
    backgroundColor: 'white',
    color: appColors.primary,
    opacity: 0.9,
  },
});

//this function get an array of all items in localstorage
function itemsCart() {
  var arr = [],
    keys = Object.keys(localStorage),
    index = keys.length;
  for (var i = 0; i < index; i++) {
    if (keys[i].length > 30) {
      arr.push(JSON.parse(keys[i]));
    }
  }
  return arr;
}

//this function calculate the number of items in the cart and set it to global hook context
function calTotal() {
  var amount = 0,
    keys = Object.keys(localStorage),
    index = keys.length;
  for (var i = 0; i < index; i++) {
    if (keys[i].length > 30) {
      var quantity = window.localStorage.getItem(keys[i]);
      amount += parseInt(quantity);
      // arr.push(JSON.parse(keys[i]));
    }
  }
  return amount;
}

function Entry(props) {
  const classes = useStyles();

  const cartContext = useContext(someContexts);
  var tempName = props.img;
  //It will check the locolStorange every time it render to update state
  var holdItems = itemsCart();
  var quantity = 0;
  for (var i = 0; i < holdItems.length; i++) {
    if (holdItems[i].id === props.id) {
      var item = holdItems[i];
      item = JSON.stringify(item);
      var stringAmount = window.localStorage.getItem(item);
      quantity = parseInt(stringAmount, 10);
    }
  }
  cartContext.setCartTotal(calTotal());
  const [count, setCount] = useState(quantity);

  // Increase function will update state and udpate quantity to the localStorage
  function increase() {
    var holdCount1 = count + 1;
    setCount(holdCount1);
    var holdItem1 = props;
    window.localStorage.setItem(JSON.stringify(holdItem1), holdCount1);
    cartContext.setCartTotal(calTotal());
  }

  // Decrease function will update state and udpate quantity to the localStorage
  function decrease() {
    var holdCount2 = count - 1;
    if (holdCount2 >= 0) {
      setCount(holdCount2);
      var holdItem2 = props;
      window.localStorage.setItem(JSON.stringify(holdItem2), holdCount2);
      cartContext.setCartTotal(calTotal());
    } else {
      console.log("You can't order negative amount of products");
    }
  }

  return (
    <>
      <Box width="170px" flexGrow={1} m={1} mb={-8}>
        <Box
          className="center-cropped"
          display="flex"
          alignItems="flex-start"
          position="relative"
          zIndex="modal"
          style={{
            width: '170px',
            height: '170px',
            backgroundImage: `url(${props.img})`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            borderRadius: 5,
            border: '1px solid ' + appColors.border,
          }}
        />
        <Box position="relative" zIndex="tooltip" top={-91}>
          <Box
            className={classes.button}
            width={30}
            height={30}
            ml={17.5}
            mt={-10.1}
            mb={13.5}
            lineHeight="30px"
          >
            {count}
          </Box>
          <Box display="flex" alignItems="flex-start">
            <Button
              className={classes.button}
              variant="contained"
              size="small"
              onClick={decrease}
              style={{ width: '86px' }}
            >
              -
            </Button>
            <Button
              className={classes.button}
              variant="contained"
              size="small"
              onClick={increase}
              style={{ width: '86px' }}
            >
              +
            </Button>
          </Box>
          <Box
            width="168px"
            p={0.1}
            style={{
              fontSize: '12px',
              backgroundColor: 'white',
              borderRadius: 5,
              border: '1px solid ' + appColors.border,
            }}
          >
            <Box display="flex">
              <Box textAlign="left">{props.name}</Box>
              <Box flexGrow={1} />
              <Box textAlign="right">
                $ {props.price} {props.meaning}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Entry;
