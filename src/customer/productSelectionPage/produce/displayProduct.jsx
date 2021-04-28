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
import CarouselGrid from 'react-grid-carousel'
import polygonImage from '../../../images/Polygon.svg'


const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 3000, min: 1430 },
    items: 4.5,
  },
  desktop: {
    breakpoint: { max: 1430, min: 1150 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1150, min: 800 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 800, min: 0 },
    items: 2,
  },
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
    marginLeft: '6rem',
   },
}));

// DONE: add unit, each is as is, anything else is '/' or 'per'
function createProduct2(product) {
  console.warn(product);
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

  const [state, setState] = useState(); 
  var temp = 0;
  


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



  function handleClick() {
    return(

   <Paper
          elevation={0}
          className = {classes.productsPaperContainer}
        >
          <Box justifyContent="center">
            <Grid container direction="row" justify="flex-start"  
              // spacing={5}
            >
              {store.productsFruit.map(createProduct2)}
            </Grid>
          </Box>
        </Paper>
   
    );
  }


  if (!store.productsLoading && !productSelect.itemError) {
    return (
      <>
        <Box
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
          <div>
          <h1 style={{display:"flex" }}> Vegetables </h1>
          <span style={{width:'100%',height:"1px",backgroundColor:"#000000",display:"block"}} /> 
          </div>
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
                {store.productsVegetable.map(createProduct2)}
              </Grid>
            </Box>
          </Paper>

          <div>

          <h1 style={{display:"flex"}}> Fruits </h1>
          <span style={{width:'100%',height:"1px",backgroundColor:"#000000",display:"block"}} /> 
          </div>
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
                {store.productsFruit.map(createProduct2)}
              </Grid>
            </Box>
          </Paper>

          <div>

        <h1 style={{display:"flex"}}> Diary </h1>
        <span style={{width:'100%',height:"1px",backgroundColor:"#000000",display:"block"}} /> 
        </div>
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
                {store.productsDessert.map(createProduct2)}
              </Grid>
            </Box>
          </Paper>

          <div>
          <h1 style={{display:"flex"}}> Snacks </h1>
        <span style={{width:'100%',height:"1px",backgroundColor:"#000000",display:"block"}} /> 
        </div>
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
//       <Box
//         className = {classes.itemDisplayContainer}
//       >
   
// <Simple/>
//         {/* <Paper
//           elevation={0}
//           className = {classes.productsPaperContainer}
//         >
//           <Box justifyContent="center">
//             <Grid container direction="row" justify="flex-start"  
//               // spacing={5}
//             >
//               {store.productsFruit.map(createProduct2)}
//             </Grid>
//           </Box>
//         </Paper> */}
// <div style = {{display:'flex',justifyContent:"space-between"}}>
//     <h1 > Vegetables </h1>
//     <Button style={{color:"#ff8500"}}  onClick = {handleClick}> See all Fruits </Button>
//     </div>

//     <Carousel
//             itemClass={classes.imageItem}
//             centerMode={true} 
//             responsive={responsive}>
            
//            {store.productsVegetable.map(createProduct2)}
             
//           </Carousel> 

          


//           <div style = {{display:'flex',justifyContent:"space-between"}}>
//     <h1 > Fruits </h1>
//     <Button style={{color:"#ff8500"}}  onClick = {handleClick}> See all Fruits </Button>
//     </div>

//          <Carousel
//         itemClass={classes.imageItem}
//         centerMode={true} 
//         responsive={responsive}>
  
//         {store.productsFruit.map(createProduct2)}
//         </Carousel>

//           <div style = {{display:'flex',justifyContent:"space-between"}}>
//     <h1 > Desserts </h1>
//     <Button style={{color:"#ff8500"}}  onClick = {handleClick}> See all Fruits </Button>
//     </div>

//            <Carousel
//             itemClass={classes.imageItem}
//             centerMode={true} 
//             responsive={responsive}>
            
//            {store.productsDessert.map(createProduct2)}
             
//           </Carousel>

//           <div style = {{display:'flex',justifyContent:"space-between"}}>
//     <h1 > Other </h1>
//     <Button style={{color:"#ff8500"}}  onClick = {handleClick}> See all Fruits </Button>
//     </div>

//            <Carousel
//             itemClass={classes.imageItem}
//             centerMode={true} 
//             responsive={responsive}>
            
//             {store.products.map(createProduct2)}
             
//           </Carousel> 
  
//       </Box>
    );
  } else {
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

export class Simple  extends React.Component{
 //  store = useContext(storeContext);

    constructor(props){
      super(props)    
      this.state = {msg : 'Hello'}
      this.handleClick = this.handleClick.bind(this)
    }
    
    handleClick(){
            this.setState({msg :"Success"})
    }
    render(){
      return (
        <div>
          <h2>Message :</h2>
            <p>{this.state.msg}</p>
              <button onClick={this.handleClick}>
            Click here!
          </button>
        </div>
      )
    }
 }
