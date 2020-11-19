import React, { setState, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import appColors from '../../../styles/AppColors';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    paddingTop: '20px',
    paddingLeft: '50px',
    paddingRight: '50px',
  },
  button: {
    color: appColors.primary,
    width: '300px',
  },
});

export default function PaymentTab() {
  const classes = useStyles();

  const onSubmit = (card) => {
    const { number, exp_month, exp_year, cvc, name, zip } = card;
  };

  return <></>;
}
