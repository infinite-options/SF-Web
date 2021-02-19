import React, { useState, useContext, useEffect } from 'react';
import storeContext from '../../storeContext';
import { Box, Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import appColors from '../../../styles/AppColors';
import ProduceSelectContext from '../ProdSelectContext';

const useStyles = makeStyles({
  button: {
    border: '1px solid' + appColors.border,
    borderRadius: 5,
    backgroundColor: 'white',
    color: appColors.primary,
    opacity: 0.9,
  },
});

function Entry(props) {
  const classes = useStyles();

  const store = useContext(storeContext);
  const productSelect = useContext(ProduceSelectContext);

  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    let isInDay = false;
    let isInFarm = false;
    let isInCategory = false;
    for (const farm in props.business_uids) {
      store.farmDaytimeDict[farm].forEach((daytime) => {
        if (store.dayClicked === daytime) isInDay = true;
      });
    }

    productSelect.farmsClicked.forEach((farm) => {
      if (farm in props.business_uids) {
        isInFarm = true;
      }
    });
    if (productSelect.categoriesClicked.has(props.type)) isInCategory = true;

    setIsShown(
      (isInDay && isInFarm && isInCategory) ||
        (isInDay &&
          productSelect.farmsClicked.size == 0 &&
          productSelect.categoriesClicked.size == 0) ||
        (isInDay && productSelect.farmsClicked.size == 0 && isInCategory) ||
        (isInDay && isInFarm && productSelect.categoriesClicked.size == 0)
    );
  }, [
    store.dayClicked,
    productSelect.farmsClicked,
    productSelect.categoriesClicked,
    store.cartItems,
  ]);

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
      <Grid hidden={!isShown} item>
        <Box
          className="center-cropped"
          display="flex"
          alignItems="flex-start"
          position="relative"
          zIndex="modal"
        >
          <img src={props.img.replace(' ', '%20')} width='170' height='170' alt={props.name}></img>
        </Box>
        
        <Box position="relative" zIndex="tooltip" top={-91} height={110}>
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
                $ {props.price.toFixed(2)} {props.unit === 'each' ? '' : '/ '}
                {props.unit}
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
    </>
  );
}

export default Entry;
