import React, { useState, useContext } from 'react';
import storeContext from '../../storeContext';
import { Box, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import appColors from '../../../styles/AppColors';

// imtemsCart() will return an array of all localStorage key that include only products
// and already been parse by JSON
// it will only take product incart that has more than 0 in value
function itemsCart(cur) {
  var numOfItem = 0,
    keys = Object.keys(localStorage),
    index = keys.length;
  var item = JSON.stringify(cur);
  for (var i = 0; i < index; i++) {
    if (item === keys[i]) {
      numOfItem = parseInt(window.localStorage.getItem(keys[i]));
    }
  }
  return numOfItem;
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

function CartItem(props) {
  const cartContext = useContext(storeContext);
  var getQuantity = itemsCart(props);
  var totalPrice = props.price * getQuantity;
  const [counter, setCounter] = useState(getQuantity);

  function decrease() {
    var holdCount2 = counter - 1;
    if (holdCount2 >= 0) {
      setCounter(holdCount2);
      var holdItem2 = props;
      window.localStorage.setItem(JSON.stringify(holdItem2), holdCount2);
      cartContext.setCartTotal(calTotal());
    } else {
      console.log("You can't order negative amount of products");
    }
  }

  function increase() {
    var holdCount1 = counter + 1;
    setCounter(holdCount1);
    var holdItem1 = props;
    window.localStorage.setItem(JSON.stringify(holdItem1), holdCount1);
    cartContext.setCartTotal(calTotal());
  }

  return (
    <Box
      display="flex"
      mb={2}
      py={1}
      style={{ borderBottom: '1px solid' + appColors.paragraphText }}
    >
      <Box
        className="center-cropped"
        style={{
          width: '90px',
          height: '90px',
          backgroundImage: `url(${props.img})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          borderRadius: 15,
        }}
      />
      <Box display="flex" flexGrow={1} py={4.5}>
        <Box width="30%" display="flex" ml={2}>
          {props.name} {props.meaning}
        </Box>
        <Box width="30%" display="flex" flexGrow={1} justifyContent="center">
          <RemoveIcon
            fontSize="small"
            cursor="pointer"
            color="primary"
            onClick={decrease}
          />
          <Box mx={1} color={appColors.primary}>
            {counter}
          </Box>
          <AddIcon
            fontSize="small"
            cursor="pointer"
            color="primary"
            onClick={increase}
          />
        </Box>

        <Box width="5%">${totalPrice}</Box>
      </Box>
    </Box>
  );
}

export default CartItem;
