import React, { useContext, useState } from 'react';
import prodSelectContext from '../prodSelectContext';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';
import iconSizes from '../../../styles/IconSizes';

const useStyles = makeStyles((theme) => ({
  paper: {
    textAlign: 'center',
    fontSize: 10,
  },
}));

const ProduceCategory = () => {
  const classes = useStyles();

  const cartContext = useContext(prodSelectContext);

  function fruitClicking() {
    cartContext.setValFruit(!cartContext.fruitSort);
  }
  function vegeClicking() {
    cartContext.setValVege(!cartContext.vegeSort);
  }
  function dessertClicking() {
    cartContext.setValDessert(!cartContext.dessertSort);
  }
  function othersClicking() {
    cartContext.setValOther(!cartContext.othersSort);
  }

  const categories = [
    {
      onclick: fruitClicking,
      itemState: cartContext.fruitSort,
      onAsset: '../../footer_icon/orangeFruit.png',
      offAsset: '../../footer_icon/Asset 7.png',
      altName: 'fruit-img',
      label: 'Fruits',
    },
    {
      onclick: vegeClicking,
      itemState: cartContext.vegeSort,
      onAsset: '../../footer_icon/orangeVegetable.png',
      offAsset: '../../footer_icon/Asset 4.png',
      altName: 'vegetable-img',
      label: 'Vegetables',
    },
    {
      onclick: dessertClicking,
      itemState: cartContext.dessertSort,
      onAsset: '../../footer_icon/orangeDessert.png',
      offAsset: '../../footer_icon/Asset 6.png',
      altName: 'desert-img',
      label: 'Desserts',
    },
    {
      onclick: othersClicking,
      itemState: cartContext.othersSort,
      onAsset: '../../footer_icon/orangeOthers.png',
      offAsset: '../../footer_icon/Asset 5.png',
      altName: 'bread-img',
      label: 'Others',
    },
  ];

  const produceItem = (props) => (
    <Box mb={1} m={0.5} p={0.5} width="100%">
      <Box
        display="flex"
        justifyContent="center"
        onClick={props.onclick}
        style={{ cursor: 'pointer' }}
      >
        <img
          width={iconSizes.filter}
          height={iconSizes.filter}
          src={props.itemState ? props.onAsset : props.offAsset}
          alt={props.altName}
        />
      </Box>
      <div style={{ width: '100%', fontSize: 12, textAlign: 'center' }}>
        {props.label}
      </div>
    </Box>
  );

  return <React.Fragment>{categories.map(produceItem)}</React.Fragment>;
};

export default ProduceCategory;
