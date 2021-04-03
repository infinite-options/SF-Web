import React, { useState, useContext, useEffect } from 'react';
import storeContext from '../../storeContext';
import { Box, Button, Card, Grid, Icon, IconButton, Typography, SvgIcon } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
// import InfoIcon from '@material-ui/icons/Info';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import appColors from '../../../styles/AppColors';
import ProduceSelectContext from '../ProdSelectContext';
import { CallMissedSharp } from '@material-ui/icons';

import {ReactComponent as AddIcon } from '../../../sf-svg-icons/sfcolored-plus.svg';
import {ReactComponent as RemoveIcon } from '../../../sf-svg-icons/sfcolored-minus.svg';

import FavoriteSrc from '../../../sf-svg-icons/heart-whitebackground.svg';
import FavoriteBorderedSrc from '../../../sf-svg-icons/heart-whitebackground-bordered.svg';
import InfoSrc from '../../../sf-svg-icons/info-whitebackground.svg';

const useStyles = makeStyles((theme) => ({
  button: {
    border: '1px solid' + appColors.border,
    borderRadius: 5,
    backgroundColor: 'white',
    color: appColors.primary,
    opacity: 0.9,
  },

  foodNameTypography: {
    fontWeight: 'bold',
  },

  itemCountAndPrice: {
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: '1fr 2fr',
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
  const classes = useStyles();

  const store = useContext(storeContext);
  const productSelect = useContext(ProduceSelectContext);

  const [isShown, setIsShown] = useState(false);
  const [hearted, setHearted] = useState(false);

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

  const toggleHearted = () => {
    setHearted(!hearted);
  };

  return (
    <Grid xs = {6} md = {4} lg = {3} xl = {2} hidden = {!isShown} item style = {{
    }}>
      <Card
        style = {{borderRadius: '12px',}}
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
          {/* <Box>
            <Card className = {classes.itemInfoCard}>
              <IconButton
                className = {classes.itemInfoBtn}
                onClick = {toggleHearted}
              >
                {
                  hearted ?
                    <FavoriteIcon style = {{color: '#E88330'}} fontSize = 'large'/> :
                    <FavoriteBorderIcon style = {{color: '#E88330'}} fontSize = 'large'/>
                }
              </IconButton>
            </Card>
          </Box> */}
          {/* <Box style = {{display: 'flex', justifyContent: 'flex-end'}}>
            <Card className = {classes.itemInfoCard} style = {{justifyContent: 'flex-end'}}>
              <IconButton className = {classes.itemInfoBtn}>
                <InfoIcon fontSize = 'large' style = {{color: '#397D87'}}/>
              </IconButton>
            </Card>
          </Box> */}
        </Box>
        <Box style = {{
          height: '180px',
        }}>
          <img src = {`${props.img.replace(' ', '%20')}`} style = {{width: '100%', height: '100%'}} />
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
    </Grid>
    // <>
    //   <Grid hidden={!isShown} item>
    //     <Box
    //       className="center-cropped"
    //       display="flex"
    //       alignItems="flex-start"
    //       position="relative"
    //       zIndex="modal"
    //     >
    //       <img src={props.img.replace(' ', '%20')} width='170' height='170' alt={props.name}></img>
    //     </Box>
        
    //     <Box position="relative" zIndex="tooltip" top={-91} height={110}>
    //       <Box
    //         className={classes.button}
    //         width={30}
    //         height={30}
    //         ml={17.5}
    //         mt={-10.1}
    //         mb={13.7}
    //         lineHeight="30px"
    //       >
            // {props.id in store.cartItems
            //   ? store.cartItems[props.id]['count']
            //   : 0}
    //       </Box>
    //       <Box display="flex" alignItems="flex-start">
    //         <Button
    //           className={classes.button}
    //           variant="contained"
    //           size="small"
    //           onClick={decrease}
    //           style={{
    //             width: '86px',
    //             borderTopLeftRadius: 10,
    //             borderBottomLeftRadius: 10,
    //             borderTopRightRadius: 0,
    //             borderBottomRightRadius: 0,
    //           }}
    //         >
    //           <RemoveIcon fontSize="small" cursor="pointer" color="primary" />
    //         </Button>
    //         <Button
    //           className={classes.button}
    //           variant="contained"
    //           size="small"
    //           onClick={increase}
    //           style={{
    //             width: '86px',
    //             borderTopRightRadius: 10,
    //             borderBottomRightRadius: 10,
    //             borderTopLeftRadius: 0,
    //             borderBottomLeftRadius: 0,
    //           }}
    //         >
    //           <AddIcon fontSize="small" cursor="pointer" color="primary" />
    //         </Button>
    //       </Box>
    //       <Box
    //         width="168px"
    //         p={0.1}
    //         style={{
    //           fontSize: '12px',
    //           backgroundColor: 'white',
    //           borderRadius: 5,
    //           border: '1px solid ' + appColors.border,
    //         }}
    //       >
    //         <Box display="flex">
    //           <Box textAlign="left">{props.name}</Box>
    //           <Box flexGrow={1} />
    //           <Box textAlign="right">
                // $ {props.price.toFixed(2)} {props.unit === 'each' ? '' : '/ '}
                // {props.unit}
    //           </Box>
    //         </Box>
    //       </Box>
    //     </Box>
    //   </Grid>
    // </>
  );
}

export default Entry;
