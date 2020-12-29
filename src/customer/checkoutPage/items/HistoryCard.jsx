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
  title: {
    textAlign: 'left',
    fontSize: '22px',
    color: appColors.paragraphText,
    marginBottom: '10px',
  },
  date: {
    textAlign: 'left',
    fontSize: '16px',
    color: appColors.paragraphText,
    marginBottom: '10px',
  },
  items: {
    paddingLeft: '0',
    paddingRight: '0',
    fontSize: '16px',
  },
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
        price={parseFloat(item.price)}
        count={parseInt(item.qty)}
        img={item.img}
        key={item.item_uid}
        isCountChangeable={false}
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
        Expected Delivery Date:{' '}
        {props.deliveryDate.toLocaleString('default', { month: 'long' })}{' '}
        {props.deliveryDate.toLocaleString('default', { day: 'numeric' })},{' '}
        {props.deliveryDate.getFullYear()}
        {/* {' at '}
        {props.deliveryDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        })} */}
      </Box>
      <Box className={classes.date}>
        Purchase Date:{' '}
        {props.purchaseDate.toLocaleString('default', { month: 'long' })}{' '}
        {props.purchaseDate.toLocaleString('default', { day: 'numeric' })},{' '}
        {props.purchaseDate.getFullYear()}
        {' at '}
        {props.purchaseDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        })}
      </Box>
      <Box className={classes.date}>
        Delivery Address: {props.address}, {props.city}, {props.city}{' '}
        {props.zip}
      </Box>
      <Box className={classes.date}>
        Delivery Instructions:{' '}
        {props.deliveryInstructions === ''
          ? 'None provided.'
          : props.deliveryInstructions}
      </Box>
      <Box className={classes.date}>Order ID: {props.id}</Box>

      <Box className={classes.section} display="flex">
        <Box width="120px"></Box>
        <Box width="50%" textAlign="left">
          Name
        </Box>
        <Box width="20%" textAlign="center">
          Quantity
        </Box>
        <Box width="22%" textAlign="right">
          Price
        </Box>
      </Box>
      <Box className={classes.items}>{props.items.map(listItem)}</Box>
      <Box
        className={clsx(classes.items, classes.savingDetails, classes.section)}
        display="flex"
      >
        Subtotal
        <Box flexGrow={1} />${props.subtotal.toFixed(2)}
      </Box>
      <Box
        className={clsx(classes.items, classes.savingDetails, classes.section)}
        display="flex"
      >
        Promo Applied
        <Box flexGrow={1} />
        -${props.savings.toFixed(2)}
      </Box>
      <Box
        className={clsx(classes.items, classes.savingDetails, classes.section)}
        display="flex"
      >
        Delivery Fee
        <Box flexGrow={1} />${props.deliveryFee.toFixed(2)}
      </Box>
      <Box
        className={clsx(classes.items, classes.savingDetails, classes.section)}
        display="flex"
      >
        Service Fee
        <Box flexGrow={1} />${props.serviceFee.toFixed(2)}
      </Box>
      <Box
        className={clsx(classes.items, classes.savingDetails, classes.section)}
        display="flex"
      >
        Driver Tip
        <Box flexGrow={1} />${props.driverTip.toFixed(2)}
      </Box>

      <Box
        className={clsx(classes.items, classes.savingDetails, classes.section)}
        display="flex"
      >
        Taxes
        <Box flexGrow={1} />${props.taxes.toFixed(2)}
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
