import React from 'react';
import { Grid, Paper, Box } from '@material-ui/core';
import appColors from '../../../styles/AppColors';

const ItemStack = (Items) => {
  console.error('items binky');
  console.log(Items);

  return (
    <Box style = {{display: 'flex', flexDirection: 'row'}}>
      <Items style = {{border:'2px solid green'}}/>
    </Box>
  );
};

export default ItemStack;
