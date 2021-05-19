import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import appColors from 'styles/AppColors';
import Card from "react-bootstrap/Card";
import {Button} from 'react-bootstrap'

const Product = (props) => {
  return (


    



    <Box key={props.key} property="div" style={{margin:'20px',padding:'0px'}}>
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
              width: '170px',
              height: '170px',
              borderRadius: '10px',
            }}
          />
        </Box>
        <div >
        <Box
          width="300px"
          p={0.1}
          style={{
            fontSize: '12px',
            
            borderRadius: '10px',
            paddingBottom: '5px',
            textFont: ' SFProDisplay-Regular',
            
            
            //border: '1px solid ' + appColors.border,
          }}
        >
          <Box display="flex">
            <Box style={{float:'left',fontWeight:'bold'}}>
              {props.name}
            </Box>
            </Box>
            {/* <Box flexGrow={1} /> */}
            <div style={{width:'175px',float:'center',fontWeight:'bold'}}>
            <Box style={{float:'left',fontWeight:'bold',}}>${props.price}({props.unit === 'each' ? '' : 'per '}
              {props.unit})</Box>
            </div>
        </Box>
        </div>
      </Grid>
    </Box>
  );
};

export default Product;
