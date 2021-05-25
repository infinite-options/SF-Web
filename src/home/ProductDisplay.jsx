import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import Carousel from 'react-multi-carousel';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import appColors from '../styles/AppColors';
import BusiApiReqs from '../utils/BusiApiReqs';
import Product from './Product';

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 3000, min: 1430 },
    items: 8,
  },
  desktop: {
    breakpoint: { max: 1430, min: 1150 },
    items: 6,
  },
  tablet: {
    breakpoint: { max: 1150, min: 800 },
    items: 5,
  },
  mobile: {
    breakpoint: { max: 800, min: 0 },
    items: 3,
  },
};

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: appColors.componentBg,
    width: '100%',
    height: '300px',
    paddingTop: '0px',
  },
  title: {
    color: appColors.secondary,
    fontSize: '22px',
    fontWeight: 'bold',
    

  },
  bar: {
    borderBottom: '4px solid ' + appColors.secondary,
    marginBottom: '30px',
    width: '230px',
    
  },
}));

const BusiMethods = new BusiApiReqs();

const ProductDisplay = () => {
  const classes = useStyles();
  const [itemsList, setItemsList] = useState([]);

  useEffect(() => {
  getItems();
  }, []);

  const getItems = () => {
    BusiMethods.getItems(
      ['fruit', 'desert', 'vegetable', 'other'],
      ['200-000016', '200-000017']
    ).then((itemsData) => {
      const itemsSet = new Set();
      const _itemList = [];
      for (const item of itemsData) {
        const uniqueItemProps =
          item.item_name + item.item_price + item.item_desc;
        if (!itemsSet.has(uniqueItemProps)) _itemList.push(item);
        itemsSet.add(item.item_name + item.item_price + item.item_desc);
      }
      setItemsList(_itemList);
    });
  };

  return (
    <Box className={classes.root} style={{backgroundColor:'#2F787F26',height:'300px'}}>
      
      {/* <Row className={classes.title} style={{border:'1px solid black'}}>Weekly Fresh Produce </Row> */}
      {/* <Box mx="auto" className={classes.bar} /> */}
      
      <Carousel
        arrows={true}
        swipeable={true}
        partialVisible={true}
        slidesToSlide={3}
        autoplay={true}
        autoPlaySpeed={1000}
        infinite={true}
        draggable={true}
        responsive={responsive}
      >
        {itemsList.map((product,i) => {
          return (
            <div key={i}>
            <Product 
            
              img={product.item_photo}
              name={product.item_name}
              price={product.item_price}
              unit={product.item_unit}
              
            />
            </div>
          );
        })}
      </Carousel>
      
    </Box>
  );
};

export default ProductDisplay;
