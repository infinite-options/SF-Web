import React, { useState, useContext } from 'react';
import someContexts from '../makeContext';
import { Box } from '@material-ui/core';
import appColors from '../../styles/AppColors';

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
    <Box width="170px" flexGrow={1} m={1}>
      <Box
        height="170px"
        style={{ borderRadius: 10, border: '1px solid ' + appColors.border }}
      >
        <Box
          display="flex"
          alignItems="flex-start"
          position="relative"
          zIndex="modal"
        >
          <img width="170px" height="170px" src={props.img} alt={tempName} />
        </Box>
        <Box position="relative" zIndex="tooltip" top={-90}>
          <Box alignSelf="flex-start">
            <h3>{count}</h3>
          </Box>
          <Box alignSelf="flex-end">
            <div>
              <button onClick={decrease}>-</button>
              <button onClick={increase}>+</button>
            </div>
            {/* <hr className="hrProduct" /> */}
          </Box>
        </Box>
      </Box>
      <Box
        p={0.1}
        style={{
          fontSize: '12px',
          backgroundColor: 'white',
          borderRadius: 3,
          border: '1px solid ' + appColors.border,
        }}
      >
        {props.name}
        {props.price} {props.meaning}
      </Box>
    </Box>
  );
}

export default Entry;
