import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import appColors from '../../../styles/AppColors';

const ItemStack = (Items) => {
  return (
    <Grid container>
      <Grid container item>
        <Items />
      </Grid>
    </Grid>
  );
};

export default ItemStack;
