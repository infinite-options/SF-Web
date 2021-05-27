import React, { useState, useContext,useEffect } from 'react';
import storeContext from '../../storeContext';
import { Box, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import appColors from '../../../styles/AppColors';
import ProductSelectContext from '../../productSelectionPage/ProdSelectContext'

function CartItem(props) {
  const store = useContext(storeContext);
  const products = store.products;
  const productSelect = useContext(ProductSelectContext);
  var itemPrice = parseFloat(props.price);
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
    console.log("props",props)
    console.log("products",products);

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

  // const {
  //   setIsInDay,
  //  } = useContext(storeContext);

  const [isInDay, setIsInDay] = useState(false);


  useEffect(() => {
    let isInDay = false;
    console.log("props name day",props.business_uid) 

   // for (const farm in props.itm_business_uid) {
     if (store.farmDaytimeDict[props.business_uid] != undefined){

       store.farmDaytimeDict[props.business_uid].forEach((daytime) => {
         if (store.dayClicked === daytime)
         isInDay = true;
       });
     }
   // }


    setIsInDay(isInDay);
    console.log("props name", props.name, isInDay) 


  }, [
    store.dayClicked,
     productSelect.farmsClicked,
     productSelect.categoriesClicked,
  //  store.cartItems,
  ]);


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
        {  props.isCountChangeable ? 
        <Box
          width="50%"
          display="flex"
          flex ='2'
          ml={2}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'left',
           textDecorationLine:isInDay?'' : 'line-through', textDecorationStyle: 'solid',
          }}
        >
        <Box >{ props.name}{' '} </Box>
         
          
         { props.unit !== undefined && props.unit !== ''
            ? '($' +
              itemPrice.toFixed(2) +
              ' ' +
              (props.unit === 'each' ? '' : '/ ') +
              props.unit +
              ')'
            : ''  } 
        </Box> 
        :  <Box
        width="50%"
        display="flex"
        flex ='2'
        ml={2}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'left',
        }}
      >
      <Box >{ props.name}{' '} </Box>
       
        
       { props.unit !== undefined && props.unit !== ''
          ? '($' +
            itemPrice.toFixed(2) +
            ' ' +
            (props.unit === 'each' ? '' : '/ ') +
            props.unit +
            ')'
          : ''  } 
      </Box>   }




        <Box width="30%" flex='0.5' display="flex" justifyContent="center">
          {props.isCountChangeable && (
            <Box>
              { isInDay ?
              <RemoveIcon
                fontSize="small"
                cursor="pointer"
                color="primary"
                onClick={decrease}
                style={{ backgroundColor: '#136D74', borderRadius: '5px' }}
              /> :' '}
            </Box>
          )}
          <Box mx={1}  color="#000000" fontWeight="500" fontSize="14px">
          
            { isInDay ? props.count : ' '}
          </Box>
          {props.isCountChangeable && (
            <Box>
              { isInDay ?
              <AddIcon
                fontSize="small"
                cursor="pointer"
                color="primary"
                onClick={increase}
                style={{ backgroundColor: '#136D74', borderRadius: '5px' }}
              /> : ' '}
            </Box>
          )}
        </Box>

        <Box textAlign="right" width="20%" flex='2' display="flex" flexDirection='column' >
          {props.isCountChangeable ? 
          <Box>
          <Box style={{textDecorationLine:isInDay?'' : 'line-through', textDecorationStyle: 'solid'}}>
          ${totalPrice.toFixed(2)}
          </Box > 
          <Box style={{fontSize:'10px', textAlign:'left', color:'#ff8500'}} hidden={isInDay} > Item not avaliable on this day 
          </Box>
          </Box> :
          <Box>
          <Box >
          ${totalPrice.toFixed(2)}
          </Box > 
          </Box>
            }
        </Box>
      </Box>
    </Box>
  );
}

export default CartItem;
