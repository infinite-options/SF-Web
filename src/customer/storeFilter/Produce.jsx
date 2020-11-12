import React, { useContext, useState } from 'react';
import someContexts from '../makeContext';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';
import iconSizes from '../../styles/IconSizes';

const useStyles = makeStyles((theme) => ({
  paper: {
    textAlign: 'center',
    fontSize: 10,
  },
}));

const ProduceCategory = () => {
  const classes = useStyles();

  const cartContext = useContext(someContexts);
  var itemsAmount = cartContext.cartTotal;
  const [fruitClick, set1] = useState(true);
  const [vegeClick, set2] = useState(true);
  const [dessertClick, set3] = useState(true);
  const [othersClick, set4] = useState(true);

  function fruitClicking() {
    set1(!fruitClick);
    cartContext.setValFruit(!fruitClick);
  }
  function vegeClicking() {
    set2(!vegeClick);
    cartContext.setValVege(!vegeClick);
  }
  function dessertClicking() {
    set3(!dessertClick);
    cartContext.setValDessert(!dessertClick);
  }
  function othersClicking() {
    set4(!othersClick);
    cartContext.setValOther(!othersClick);
  }

  const categories = [
    {
      onclick: fruitClicking,
      itemState: fruitClick,
      onAsset: '../../footer_icon/Asset 7.png',
      offAsset: '../../footer_icon/orangeFruit.png',
      altName: 'fruit-img',
      label: 'Fruits',
    },
    {
      onclick: vegeClicking,
      itemState: vegeClick,
      onAsset: '../../footer_icon/Asset 4.png',
      offAsset: '../../footer_icon/orangeVegetable.png',
      altName: 'vegetable-img',
      label: 'Vegetables',
    },
    {
      onclick: dessertClicking,
      itemState: dessertClick,
      onAsset: '../../footer_icon/Asset 6.png',
      offAsset: '../../footer_icon/orangeDessert.png',
      altName: 'desert-img',
      label: 'Desserts',
    },
    {
      onclick: othersClicking,
      itemState: othersClick,
      onAsset: '../../footer_icon/Asset 5.png',
      offAsset: '../../footer_icon/orangeOthers.png',
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
