import React, { useContext, useEffect, useState } from 'react';
import Entry from './Entry';
import ProdSelectContext from '../ProdSelectContext';
import storeContext from '../../storeContext';
import { Box, Button, ButtonBase, Grid, Paper, Typography } from '@material-ui/core';
import appColors from '../../../styles/AppColors';
import { set } from 'js-cookie';
import {makeStyles} from '@material-ui/core/styles';
import ItemCategory from '../filter/ItemCategory';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';


const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
  };
  
  const useStyles = makeStyles((theme) => ({
  itemDisplayContainer: {
    backgroundColor:'#F1F4F4',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
    marginBottom: theme.spacing(2),
  },
  
  productsPaperContainer: {
    backgroundColor: appColors.componentBg,
    marginTop: theme.spacing(2),
  },
  
  imageItem: {
    backgroundColor: appColors.componentBg, borderRadius: 10, paddingBottom: '95px' 
    },
  }));
  
// DONE: add unit, each is as is, anything else is '/' or 'per'
function createProduct2(product) {
  return (
    <Entry
      favorite = {product.favorite}
      name={product.item_name}
      desc={product.item_desc}
      price={product.item_price}
      businessPrice={product.business_price}
      img={product.item_photo}
      type={product.item_type}
      unit={product.item_unit}
      isTaxable={product.taxable === 'TRUE'}
      business_uids={product.business_uids} // This is not from the database and not used, it is parsed in store within the last part of the getBusinesses method
      business_uid={product.lowest_price_business_uid} // This is the business ID with the lowest price, also parsed from the getBusinesses method
      id={product.item_uid}
      key={product.item_uid}
    />
  );
}
// TEST: We are considering matching on item_name, item_desc and item_price.
// If they are identical we should choose the one with the lowest business_price.
// If Identical still then we should select the one with the earliest created_at date

function DisplayProduct() {
  const classes = useStyles();

  const productSelect = useContext(ProdSelectContext);
  const store = useContext(storeContext);

  const [OtherDisplayType, setOtherDisplayType] = useState(false); 


  const [windowHeight, setWindowHeight] = React.useState(window.innerHeight);

  useEffect(() => {
    window.addEventListener('resize', updateWindowHeight);
    return () => window.removeEventListener('resize', updateWindowHeight);
  });

  const updateWindowHeight = () => {
    setWindowHeight(window.innerHeight);
  };

  const [displayMessage, setDisplayMessage] = useState('');

  // DONE: add date to expected delivery
  // DONE: clear out expected delivery if unclicked
  useEffect(() => {
    let message = '';
    if (store.dayClicked === '') {
      message = 'Start by selecting a delivery date and time.';

      if (store.cartTotal > 0) {
        message = 'Here are the items currently in your cart';
      }
    } else {
      message = 'Produce available for delivery on ' + store.expectedDelivery;
    }
    if (store.products.length === 0 && !store.productsLoading) {
      message =
        'Sorry, we could not find any produce that can be delivered to your provided address';
    }
    setDisplayMessage(message);
  }, [
    store.dayClicked,
    store.products,
    store.productsLoading,
    store.cartTotal,
  ]);

  function handleClickOther(){
    setOtherDisplayType(!OtherDisplayType);
  }
  

  if (!store.productsLoading && !productSelect.itemError) {
    return (
      <>

<Box>

<div style={{display:"flex", justifyContent:"space-between" }}>  
<h1 style={{textDecoration:"underline", color:appColors.secondary, paddingLeft:'2rem', paddingRight:'2rem'}}> Others </h1>
<Button style={{color:"#ff8500"}}  onClick = {handleClickOther}> See all Others </Button>
</div>
<Box hidden={OtherDisplayType  }>

{/* <Carousel
    itemClass={classes.imageItem}
    centerMode={true} 
    responsive={responsive}>
    
   {store.products.map(createProduct2)} 
 
  </Carousel>  */}
  </Box> 
<Box
className="responsive-display-produce"
// width="100%"
 hidden ={!OtherDisplayType}
height={windowHeight - 165}
// ml={2}
// p={3}
// pb={5}
mb={2}
style={{ backgroundColor: appColors.componentBg, borderRadius: 10, paddingBottom: '95px' }}
>

<Box mt={2} />

<Paper
  elevation={0}
  style={{
    backgroundColor: appColors.componentBg,
    maxHeight: '100%',
    width: '100%',
    overflow: 'auto',
  
  }}
>
  <Box  width="97%" justifyContent="center">
    
    <Grid container direction="row" justify="flex-start" 
    // spacing={5}
    spacing={2}
    >
      {store.products.map(createProduct2)}
    </Grid>
  </Box>
</Paper>
  </Box>
  </Box>
  </>
    );
        {/* <Box
          className="responsive-display-produce"
          // width="100%"
          height={windowHeight - 165}
          // ml={2}
          // p={3}
          // pb={5}
          mb={2}
          style={{ backgroundColor: appColors.componentBg, borderRadius: 10, paddingBottom: '95px' }}
        >
          <Box fontSize={22} color={appColors.paragraphText}>
            {displayMessage}
          </Box>
          <Box mt={2} />
          <Paper
            elevation={0}
            style={{
              backgroundColor: appColors.componentBg,
              maxHeight: '100%',
              width: '100%',
              overflow: 'auto',
            }}
          >
            <Box width="97%" justifyContent="center">
              <Grid container direction="row" justify="flex-start" 
              // spacing={5}
              spacing={2}
              >
                {store.products.map(createProduct2)}
              </Grid>
            </Box>
          </Paper>
        </Box>
      </>
    );
  } else {
    return (
      <Box
        ml={2}
        p={2}
        width="100%"
        style={{ backgroundColor: appColors.componentBg, borderRadius: 10 }}
      >
        <div>Thank you for waiting, we are loading the products for you.</div>
      </Box>
    );
  } */}
}

else {
  return (
    <Box
      p={2}
      style={{ display: 'flex', backgroundColor: appColors.componentBg, borderRadius: 10}}
    >
      <Typography>Thank you for waiting, we are loading the products for you.</Typography>
    </Box>
  );
}
}


export default DisplayProduct;
