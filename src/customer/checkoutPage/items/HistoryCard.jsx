import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/styles';
import appColors from '../../../styles/AppColors';
import storeContext from '../../storeContext';
import CartItem from './cartItem';

const useStyles = makeStyles((theme) => ({
  card: {
    borderBottom: '6px solid' + appColors.checkoutSectionBorder,
    paddingLeft: '100px',
    paddingRight: '100px',
  },
  section: {
    textAlign: 'left',
    borderBottom: '1px solid' + appColors.border,
    marginBottom: '100px',
    paddingBottom: '10px',
  },
}));

function listItem(item) {
  return (
    <>
      <CartItem
        name={item.name}
        price={item.price}
        count={item.qty}
        img={item.img}
        key={item.item_uid}
        isCountChangable={false}
      />
    </>
  );
}

const HistoryCard = (props) => {
  const { profile } = useContext(storeContext);
  const classes = useStyles();

  return <Box className={classes.card}>{props.items.map(listItem)}</Box>;
};

export default HistoryCard;
