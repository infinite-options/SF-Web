import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ItemCategoryItem from './cards/ItemCategoryCard';

const useStyles = makeStyles((theme) => ({
  paper: {
    textAlign: 'center',
    fontSize: 10,
  },
}));

const createItemCategoryItem = (item) => {
  return (
    <ItemCategoryItem
      onAsset={item.onAsset}
      offAsset={item.offAsset}
      altName={item.altName}
      label={item.label}
      type={item.type}
      id={item.type}
      key={item.type}
    />
  );
};

const ItemCategory = () => {
  const classes = useStyles();

  const categories = [
    {
      onAsset: '../../footer_icon/orangeFruit.png',
      offAsset: '../../footer_icon/Asset 7.png',
      altName: 'fruit-img',
      label: 'Fruits',
      type: 'fruit',
    },
    {
      onAsset: '../../footer_icon/orangeVegetable.png',
      offAsset: '../../footer_icon/Asset 4.png',
      altName: 'vegetable-img',
      label: 'Vegetables',
      type: 'vegetable',
    },
    {
      onAsset: '../../footer_icon/orangeDessert.png',
      offAsset: '../../footer_icon/Asset 6.png',
      altName: 'desert-img',
      label: 'Desserts',
      type: 'dessert',
    },
    {
      onAsset: '../../footer_icon/orangeOthers.png',
      offAsset: '../../footer_icon/Asset 5.png',
      altName: 'bread-img',
      label: 'Others',
      type: 'other',
    },
  ];

  return (
    <React.Fragment>{categories.map(createItemCategoryItem)}</React.Fragment>
  );
};

export default ItemCategory;
