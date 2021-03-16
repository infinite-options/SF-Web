import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import appColors from 'styles/AppColors';

const Product = (props) => {
  return (
    <Box key={props.key} property="div">
      <Grid item>
        <Box
          className="center-cropped"
          display="flex"
          alignItems="flex-start"
          position="relative"
        >
          <img
            src={props.img}
            alt={props.name}
            style={{
              width: '300px',
              height: '300px',
              borderRadius: '10px',
            }}
          />
        </Box>
        <Box
          width="300px"
          p={0.1}
          style={{
            fontSize: '12px',
            backgroundColor: 'white',
            borderRadius: '10px',
            paddingBottom: '5px',
            textFont: ' SFProDisplay-Regular',
            //border: '1px solid ' + appColors.border,
          }}
        >
          <Box display="flex">
            <Box textAlign="left" padding="4px">
              {props.name}({props.unit === 'each' ? '' : 'per '}
              {props.unit})
            </Box>
            <Box flexGrow={1} />
            <Box textAlign="right">$ {props.price}</Box>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default Product;
