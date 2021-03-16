import React, { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import appColors from '../styles/AppColors';
import BusiApiReqs from '../utils/BusiApiReqs';
import Product from './Product';

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
  root: {
    backgroundColor: appColors.componentBg,
    width: '100%',
    height: 'auto',
    paddingTop: '30px',
    paddingBottom: '30px',
  },

  title: {
    color: appColors.secondary,
    fontSize: '40px',
    fontWeight: '700',
  },
  bar: {
    borderBottom: '4px solid ' + appColors.secondary,
    marginBottom: '50px',
    width: '410px',
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
    <Box className={classes.root}>
      <Box className={classes.title} style={{ paddingTop: '30px' }}>
        Weekly Fresh Produce
      </Box>
      <Box mx="auto" className={classes.bar} />
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
        {itemsList.map((product) => {
          console.log(product);

          return (
            <Product
              img={product.item_photo}
              name={product.item_name}
              price={product.item_price}
              unit={product.item_unit}
              key={product.item_uid}
            />
          );
        })}
      </Carousel>
    </Box>
  );
};

export default ProductDisplay;
