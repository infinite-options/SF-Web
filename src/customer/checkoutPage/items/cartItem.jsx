import React, { useState, useContext } from 'react';
import storeContext from '../../storeContext';
import { Box, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import appColors from '../../../styles/AppColors';

function CartItem(props) {
  const store = useContext(storeContext);
  var totalPrice = props.price * store.cartItems[props.id]['count'];

  function decrease() {
    if (props.id in store.cartItems) {
      if (store.cartItems[props.id]['count'] > 0) {
        if (store.cartItems[props.id]['count'] == 1) {
          delete store.cartItems[props.id];
        } else {
          const item = {
            ...props,
            count: store.cartItems[props.id]['count'] - 1,
          };
          store.setCartItems({
            ...store.cartItems,
            [props.id]: item,
          });
        }
        store.setCartTotal(store.cartTotal - 1);
      }
    }
  }

  function increase() {
    const item =
      props.id in store.cartItems
        ? { ...props, count: store.cartItems[props.id]['count'] + 1 }
        : { ...props, count: 1 };

    store.setCartItems({
      ...store.cartItems,
      [props.id]: item,
    });
    store.setCartTotal(store.cartTotal + 1);
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
            {props.id in store.cartItems
              ? store.cartItems[props.id]['count']
              : 0}
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
