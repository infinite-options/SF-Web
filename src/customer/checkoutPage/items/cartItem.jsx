import React, { useState, useContext } from 'react';
import storeContext from '../../storeContext';
import { Box, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import appColors from '../../../styles/AppColors';

function CartItem(props) {
  const store = useContext(storeContext);
  const itemPrice = parseFloat(props.price);
  var totalPrice = itemPrice * props.count;

  function decrease() {
    if (props.id in store.cartItems) {
      const itemCount = store.cartItems[props.id]['count'];
      if (itemCount > 0) {
        if (itemCount == 1) {
          let clone = Object.assign({}, store.cartItems);
          delete clone[props.id];
          store.setCartItems(clone);
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
      justifyContent="space-evenly"
      mb={2}
      py={1}
      style={{ borderBottom: '1px solid' + appColors.border }}
    >
      <Box
        className="center-cropped"
        style={{
          width: '50px',
          height: '50px',
          backgroundImage: `url(${props.img})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: 15,
          marginTop: 35,
        }}
      />
      <Box display="flex" flexGrow={1} py={4.5}>
        <Box
          width="50%"
          display="flex"
          ml={2}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'left',
          }}
        >
          {props.name} <br></br>
          {props.unit !== undefined && props.unit !== ''
            ? '($' +
              itemPrice.toFixed(2) +
              ' ' +
              (props.unit === 'each' ? '' : '/ ') +
              props.unit +
              ')'
            : ''}
        </Box>
        <Box width="30%" display="flex" justifyContent="center">
          {props.isCountChangeable && (
            <Box>
              <RemoveIcon
                fontSize="small"
                cursor="pointer"
                color="primary"
                onClick={decrease}
                style={{ backgroundColor: '#136D74', borderRadius: '10px' }}
              />
            </Box>
          )}
          <Box mx={1} color="#000000" fontWeight="500" fontSize="20px">
            {props.count}
          </Box>
          {props.isCountChangeable && (
            <Box>
              <AddIcon
                fontSize="small"
                cursor="pointer"
                color="primary"
                onClick={increase}
                style={{ backgroundColor: '#136D74', borderRadius: '10px' }}
              />
            </Box>
          )}
        </Box>

        <Box textAlign="right" width="20%">
          ${totalPrice.toFixed(2)}
        </Box>
      </Box>
    </Box>
  );
}

export default CartItem;
