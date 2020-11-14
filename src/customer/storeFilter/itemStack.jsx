import React from 'react';
import { Grid } from '@material-ui/core';

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
