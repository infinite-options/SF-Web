import React, { useState, useContext, useEffect } from 'react';
import storeContext from '../../storeContext';
import { Box, Button, Card, Grid, Icon, IconButton, Typography, SvgIcon } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
// import InfoIcon from '@material-ui/icons/Info';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import axios from 'axios';
import appColors from '../../../styles/AppColors';
import ProduceSelectContext from '../ProdSelectContext';
import { CallMissedSharp, InfoOutlined } from '@material-ui/icons';

import {ReactComponent as AddIcon } from '../../../sf-svg-icons/sfcolored-plus.svg';
import {ReactComponent as RemoveIcon } from '../../../sf-svg-icons/sfcolored-minus.svg';

import FavoriteSrc from '../../../sf-svg-icons/heart-whitebackground.svg';
import FavoriteBorderedSrc from '../../../sf-svg-icons/heart-whitebackground-bordered.svg';
import InfoSrc from '../../../sf-svg-icons/info-whitebackground.svg';

import busiRes from '../../../utils/BusiApiReqs'

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;


const useStyles = makeStyles((theme) => ({
  button: {
    border: '1px solid' + appColors.border,
    borderRadius: 5,
    backgroundColor: 'white',
    color: appColors.primary,
    opacity: 0.9,
  },

  foodGridItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

  foodNameTypography: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    display: 'flex',
    overflow:'hidden',
    whiteSpace:'nowrap',
    fontWeight: 'bold',
  },

  itemCountAndPrice: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    display: 'grid',
    alignItems: 'flex-end',
    gridTemplateColumns: '1fr 2fr',
    flexGrow: 1,
    flexBasis: 1,
    paddingBottom: theme.spacing(1),
  },

  itemCount: {
    display: 'grid',
    alignItems: 'center',
    justifyContent: 'center',
    gridTemplateColumns: '1fr 1fr 1fr',
  },

  itemCountBtn: {
    color: "#E88330",
    background: '#397D87',
    width: '60px',
    height: '40px',
    variant: 'contained',
    borderRadius: '0px',
  },

  itemCountTypog: {
    fontWeight: 'bold',
    marginLeft: theme.spacing(1.5),
    marginRight: theme.spacing(1.5),
  },

  itemPrice: {
    fontWeight: 'bold',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    textAlign: 'end',
  },

  test: {
    backgroundColor: '#397D87',
    color: '#E88330',
    fontSize: '2em',
  },

  checkoutInfo: {
    borderRadius: '12px',
    border: '1px solid #e8cfba',
    width: '250px',
    height: '88px',
    display: 'flex',
    flexDirection: 'column',
    background: props => (props.hearted || props.id != 0) ? '#F4860933' : 'white',
  },

  itemInfo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },

  itemInfoCard: {
    width: '60px',
    height: '60px',
    borderRadius: '10px',
  },
}));

function Entry(props) {
  const [hearted, setHearted] = useState(false);
  const store = useContext(storeContext);
  const BusiApiMethods = new busiRes();
  var favoriteArray = [];

  const stylesProps = {
    'id': props.id in store.cartItems
      ? store.cartItems[props.id]['count']
      : 0,
    'hearted': hearted,
  }

  const classes = useStyles(stylesProps);

  const productSelect = useContext(ProduceSelectContext);

  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    let isInDay = false;
    let isInFarm = false;
    let isInCategory = false;

    const isFavoritedAndInFavorites = productSelect.categoriesClicked.has("favorite") != undefined &&
    props.favorite == "TRUE";

    for (const farm in props.business_uids) {
      store.farmDaytimeDict[farm].forEach((daytime) => {
        if (store.dayClicked === daytime) isInDay = true;
      });
    }

    // productSelect.farmsClicked.forEach((farm) => {
    //   if (farm in props.business_uids) {
    //     isInFarm = true;
    //   }
    // });
    if (productSelect.categoriesClicked.has(props.type)) isInCategory = true;

    setIsShown(
      // (isInDay && isInFarm && isInCategory) ||
      //   (isInDay &&
      //     productSelect.farmsClicked.size == 0 &&
      //     productSelect.categoriesClicked.size == 0) ||
      //   (isInDay && productSelect.farmsClicked.size == 0 && isInCategory) ||
      //   (isInDay && isInFarm && productSelect.categoriesClicked.size == 0)

      isInDay && (
        (productSelect.categoriesClicked.size == 0) ||
        isInCategory || isFavoritedAndInFavorites
      )
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

    console.warn(store.cartItems);
  }

  const toggleHearted = () => {
    // console.warn(store.products);
    // const itemCount = props.id in store.cartItems ?
    //   store.cartItems[props.id]['count'] :
    //   false;

    // const item =
    // props.id in store.cartItems
    //   ? { ...props, count: 'count' in store.items[props.id] ? itemCount : undefined,
    //       favorited: !store.cartItems[props.id]['favorited']}
    //   : { ...props, favorited: true};
    // console.warn(item);

    // store.setCartItems({
    //   ...store.cartItems,
    //   [props.id]: item,
    // });

    for (let i = 0; i < store.products.length; i++) {
      if (store.products[i].item_uid == props.id) {
       store.products[i].favorite = store.products[i].favorite == "FALSE" ?
   //       store.products[i].favorite = props.favorite == "FALSE" ?     
          "TRUE" : "FALSE";
          console.log('FavoriteItems Products:',store.products[i].item_name)
          favoriteArray.push(store.products[i].item_name)
   
      }
    }

    console.log('FavoriteItems Customer:',props.business_uids)

    
    let reqBodyPost = {
      customer_uid: props.id,
      favorite:favoriteArray
    };

    let reqBodyGet = {
      customer_uid: props.id,
    };

    const postRequest = async() => {

      try{
      const response = await axios.post(BASE_URL + 'favorite_produce/post', reqBodyPost)
        console.log('Favorite Items:', response);
        }catch(err) {
          console.log(err.response || err);
        }
    }

    const getRequest = async() => {

      try{
      const response = await axios.post(BASE_URL + 'favorite_produce/get', reqBodyGet)
        console.log('Favorite Items:', response);
        }catch(err) {
          console.log(err.response || err);
        }
    }

    postRequest();
    getRequest();


    for (let i = 0; i < store.productsFruit.length; i++) {
      if (store.productsFruit[i].item_uid == props.id) {
       store.productsFruit[i].favorite = store.productsFruit[i].favorite == "FALSE" ?
   //       store.products[i].favorite = props.favorite == "FALSE" ?     
          "TRUE" : "FALSE";
      }
    }

    for (let i = 0; i < store.productsVegetable.length; i++) {
      if (store.productsVegetable[i].item_uid == props.id) {
       store.productsVegetable[i].favorite = store.productsVegetable[i].favorite == "FALSE" ?
   //       store.products[i].favorite = props.favorite == "FALSE" ?     
          "TRUE" : "FALSE";
      }
  }

  for (let i = 0; i < store.productsDessert.length; i++) {
    if (store.productsDessert[i].item_uid == props.id) {
     store.productsDessert[i].favorite = store.productsDessert[i].favorite == "FALSE" ?
 //       store.products[i].favorite = props.favorite == "FALSE" ?     
        "TRUE" : "FALSE";
    }
}
    setHearted(!hearted);
  };


 

  return ( isShown ?
    <Grid xs = {6} md = {4} lg = {4} item className = {classes.foodGridItem}>
      <Card
        style = {{
          borderRadius: '12px', backgroundImage: `url("${props.img.replace(' ', '%20')}")`,
          height: '200px', width: '250px',
          backgroundSize: '250px 200px',
          
        }}
        backgroundImage = {`url("${props.img.replace(' ', '%20')}")`}
      >
        <Box className = {classes.itemInfo}>
          <Box style = {{
            display: 'flex', justifyContent: 'flex-start',
          }}>
            <Button
              className = {classes.itemInfoBtn}
              onClick = {toggleHearted}
            >
              <img src = {hearted ? FavoriteSrc : FavoriteBorderedSrc} />
            </Button>
          </Box>

          <Box style = {{
            display: 'flex', justifyContent: 'flex-end',
          }}>
            <Button
              className = {classes.itemInfoBtn}
            >
              <img src = {InfoSrc} />
            </Button>
          </Box>
        </Box>
      </Card>

      <Card className = {classes.checkoutInfo}>
        <Typography className = {classes.foodNameTypography}>
          {props.name}
        </Typography>

        <Box className = {classes.itemCountAndPrice}>
          <Box className = {classes.itemCount}>
            <IconButton
              style = {{
                padding: '0px'
              }}
              onClick = {decrease}
            >
              <SvgIcon component = {RemoveIcon} fontSize = 'large'/>
            </IconButton>

            <Typography className = {classes.itemCountTypog}>
              {props.id in store.cartItems
                ? store.cartItems[props.id]['count']
                : 0}
            </Typography>

            <IconButton onClick = {increase} style = {{padding: '0px'}}>
              <SvgIcon component = {AddIcon} fontSize = 'large'/>
            </IconButton>
          </Box>

          <Typography className = {classes.itemPrice}>
            {
              `$${props.price.toFixed(2)} ${props.unit === 'each'
                ? '(' + props.unit + ')' : '/ ' + props.unit}`
            }
          </Typography>
        </Box>
      </Card>
    </Grid> : ''
  );
}

export default Entry;
