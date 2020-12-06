import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/styles';
import appColors from '../../../styles/AppColors';
import storeContext from '../../storeContext';
import CartItem from './cartItem';

const useStyles = makeStyles((theme) => ({
  card: {
    borderBottom: '6px solid' + appColors.checkoutSectionBorder,
    marginBottom: '50px',
    paddingBottom: '20px',
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  date: {
    textAlign: 'left',
    fontSize: '22px',
    color: appColors.paragraphText,
    marginBottom: '10px',
  },
  deliveryInstructions: {
    textAlign: 'left',
    fontSize: '16px',
    color: appColors.paragraphText,
    marginBottom: '10px',
  },
  items: { paddingLeft: '0', paddingRight: '0' },
  total: { fontWeight: 'bold' },
  savingDetails: { fontSize: '18px', fontWeight: 'regular' },
  section: {
    borderBottom: '1px solid' + appColors.checkoutSectionBorder,
    paddingTop: '5px',
    paddingBottom: '5px',
  },
}));

function listItem(item) {
  return (
    <>
      <CartItem
        name={item.name}
        unit={item.unit}
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

  return (
    <Box className={classes.card}>
      <Box className={classes.date}>
        {props.purchaseDate.toLocaleString('default', { month: 'long' })}{' '}
        {props.purchaseDate.toLocaleString('default', { day: 'numeric' })},{' '}
        {props.purchaseDate.getFullYear()}
        {/* {props.purchaseDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        })} */}
      </Box>
      <Box className={classes.deliveryInstructions}>
        Delivery Instructions:{' '}
        {props.deliveryInstructions === ''
          ? 'None provided.'
          : props.deliveryInstructions}
      </Box>
      <Box className={classes.items}>{props.items.map(listItem)}</Box>
      <Box
        className={clsx(classes.items, classes.savingDetails, classes.section)}
        display="flex"
      >
        Total
        <Box flexGrow={1} />${props.total.toFixed(2)}
      </Box>
      <Box
        className={clsx(classes.items, classes.savingDetails, classes.section)}
        display="flex"
      >
        Savings
        <Box flexGrow={1} />
        -${props.savings.toFixed(2)}
      </Box>
      <Box
        className={clsx(classes.items, classes.total, classes.section)}
        display="flex"
      >
        You Paid
        <Box flexGrow={1} />${props.amountPaid.toFixed(2)}
      </Box>
    </Box>
  );
};

export default HistoryCard;
