import React, { useContext, useEffect, useState } from 'react';
import storeContext from '../../../storeContext';
import ProdSelectContext from '../../ProdSelectContext';
import iconSizes from '../../../../styles/IconSizes';
import { Box } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  itemCatCardContainer: {
    marginTop: theme.spacing(.5),
    marginBottom: theme.spacing(.5),
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),

    padding: theme.spacing(.5),
  },
}));

const ItemCategoryItem = (props) => {
  const classes = useStyles();
  const productSelect = useContext(ProdSelectContext);
  const store = useContext(storeContext);

  const [isClicked, setIsClicked] = useState(false);
  const [isShown, setIsShown] = useState(
    productSelect.farmsClicked.size > 0 || store.dayClicked === ''
  );

  function onCategoryClicked() {
    const newCategoriesClicked = new Set(productSelect.categoriesClicked);

    if (isClicked) {
      newCategoriesClicked.delete(props.type);
    } else {
      newCategoriesClicked.add(props.type);
    }
    // console.log('newCategoriesClicked: ', newCategoriesClicked);
    // console.warn(productSelect);
    productSelect.setCategoriesClicked(newCategoriesClicked);
    setIsClicked(!isClicked);
  }

  useEffect(() => {
    setIsShown(store.dayClicked !== '');
  }, [store.farmsClicked, store.dayClicked]);

  return (
    <Box hidden={!isShown}className = {classes.itemCatCardContainer}>
      <Box
        display="flex"
        justifyContent="center"
        onClick={onCategoryClicked}
        style={{ cursor: 'pointer' }}
      >
        <img
          width={iconSizes.filter}
          height={iconSizes.filter}
          src={isClicked ? props.onAsset : props.offAsset}
          alt={props.altName}
        />
      </Box>
      <div style={{width: '100%', fontSize: 12, textAlign: 'center' }}>
        {props.label}
      </div>
    </Box>
  );
};

export default ItemCategoryItem;
