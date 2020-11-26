import React, { useState, useContext } from 'react';
import storeContext from '../../storeContext';
import { Box, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
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

function Entry(props) {
  const classes = useStyles();

  const store = useContext(storeContext);

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
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
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
            mb={13.7}
            lineHeight="30px"
          >
            {props.id in store.cartItems
              ? store.cartItems[props.id]['count']
              : 0}
          </Box>
          <Box display="flex" alignItems="flex-start">
            <Button
              className={classes.button}
              variant="contained"
              size="small"
              onClick={decrease}
              style={{
                width: '86px',
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
            >
              <RemoveIcon fontSize="small" cursor="pointer" color="primary" />
            </Button>
            <Button
              className={classes.button}
              variant="contained"
              size="small"
              onClick={increase}
              style={{
                width: '86px',
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
            >
              <AddIcon fontSize="small" cursor="pointer" color="primary" />
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
