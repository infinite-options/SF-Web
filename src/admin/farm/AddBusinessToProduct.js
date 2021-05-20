import React, { useState, useEffect, useContext } from 'react';
import NumberFormat from 'react-number-format';
// import FavoriteIcon from '@material-ui/icons/Favorite';
import StarRateIcon from '@material-ui/icons/StarRate';
import RefreshIcon from '@material-ui/icons/Refresh';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
// import {Grid, Paper, Button, Typography, Card, CardActions, CardMedia, CardContent, Modal, TextField, CircularProgress} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
// import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Modal,
  TextField,
} from '@material-ui/core';
import Axios from 'axios';

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import { AuthContext } from '../../auth/AuthContext';
import appColors from 'styles/AppColors';

const BASE_URL =
  'https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/';
const ITEM_EDIT_URL = BASE_URL + 'addItems_Prime/';

const booleanVals = new Set(['taxable', 'favorite']);

export default function AddBusinessToProduct(props) {
console.log('IN side abtp',props)
  const auth = useContext(AuthContext);
  const [editData, setEditData] = useState(props.data);
  const [open, setOpen] = useState(true);
  const [file, setFile] = useState({
    obj: undefined,
    url: props.data.item_photo || '',
  });
  const [itemImage, setItemImage] = useState(
    props.data.item_photo ||
      'https://via.placeholder.com/400?text=No+Image+Available'
  );
console.log('editdata',editData)
  useEffect(() => {
    setItemImage(
      props.data.item_photo ||
        'https://via.placeholder.com/400?text=No+Image+Available'
    );
  }, [props.data.item_photo]);

  const classes = useStyles();

  useEffect(() => {
    setFile({
      obj: undefined,
      url: props.data.item_photo || '',
    });
  }, [props.data.item_photo]);

  useEffect(() => {
    setEditData(props.data);
  }, [props.data]);

  
  const handleEditChange = (event) => {
    console.log('IN handleeditchange')
    const { name, value, checked } = event.target;
    console.log('checking check', event.target)
    let newValue = value;
    if (booleanVals.has(name)) newValue = checked ? 'TRUE' : 'FALSE';
    if (name === 'item_status') newValue = checked ? 'Active' : 'Past';
    console.log('setEditData(props.data): ', name, newValue);
    setEditData({ ...editData, [name]: newValue });
    console.log('new editdata', editData)
  };

  const onFileChange = (event) => {
    setFile({
      obj: event.target.files[0],
      url: URL.createObjectURL(event.target.files[0]),
    });
    console.log(event.target.files[0].name);
  };

  const handleSaveButton = () => {
    // NOTE: call turn-file-to-s3-url API Endpoint
    updateData(editData);
    setOpen(false);
    console.log('IN save')
    props.handleClose();
  };

 

  // helper function
  // NOTE: Parva currently working on update endpoint so I don't need to upload image for every item update
  const updateData = (data) => {
    const postData = { ...data };
    const created_at = postData.created_at;
    delete postData.created_at;
    postData.item_photo = file.obj; // change to File object

    let formData = new FormData();
    
    Object.entries(postData).forEach((item) => {
      console.log('item ', item);
      if (typeof item[1] !== 'string' && item[0] !== 'item_photo') {
        console.log('postData[item[0]] ', postData[item[0]]);
        postData[item[0]] = item[1] ? String(item[1]) : '';
        console.log('postData[item[0]] ', postData[item[0]]);
      }
      formData.append(item[0], item[1]);
    });
    console.log('postData ', postData,formData);

    console.log('formData ', formData.get('item_taxable'));
    postData['itm_uid']=postData['item_uid']
    postData['bus_price']=postData['business_price']
    
    formData.append('new_item','FALSE')
    formData.append('bus_uid',postData['bus_uid'])
    formData.append('itm_uid',postData['item_uid'])
    formData.append('bus_price',postData['business_price'])
    if (postData['item_status']== undefined) postData['item_status'] = 'Past';
    formData.append('item_status',postData['item_status'])
    console.log('posting form data', formData)
    Axios.post(ITEM_EDIT_URL + 'Insert', formData)
      .then((response) => {
        const sqlString = response.data.sql;
        const photo = sqlString.substring(
          sqlString.indexOf("item_photo = '") + 14,
          sqlString.indexOf("item_photo = '") + 98
        );
        console.log(response);
        props.setData((prevData) => {
          const updatedData = [...prevData];

          updatedData[props.index] = {
            ...postData,
            // Converts price input from String to Number, to deal with empty string input cases.
            // Without this conversion in this case, price value would not be displayed since item_price = "".
            item_price: Number(postData.item_price),
            business_price: Number(postData.business_price),
            item_photo: photo,
            new_item:postData.new_item,
            itm_uid:postData.item_uid,
            bus_uid:postData.bus_uid,
          };
          return updatedData;
        });
        setItemImage(photo);
      })
      .catch((err) => {
        console.error(err.response || err);
      });
  };
  
  //modal that pops up when farmer edits an item
  

  return (
   // <Grid item xs={6} sm={4} md={3} lg={2}>
    //  <Modal open={open} onClose={handleCloseEditModel}>
      //  {modelBody}
      //</Modal>
    //</Grid>
    <div className={classes.paper}>
    <Grid container>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center">
          <h3>Edit Item</h3>
        </Box>
      </Grid>
      <Grid container item xs={6} spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <TextField
              name="item_name"
              label="Item Name"
              onChange={handleEditChange}
              value={editData.item_name}
              disabled="readonly"
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <FormControl
              className={classes.formControl}
              style={{ marginLeft: 0 }}
            >
              <InputLabel id="demo-simple-select-label">
                Type of Food
              </InputLabel>
              <Select
                name="item_type"
                onChange={handleEditChange}
                autoWidth
                value={editData.item_type}
                disabled="readonly"
              >
                <MenuItem value={'vegetable'}>Vegetable</MenuItem>
                <MenuItem value={'fruit'}>Fruit</MenuItem>
                <MenuItem value={'dessert'}>Dessert</MenuItem>
                <MenuItem value={'other'}>Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <TextField
              name="item_price"
              label="Item Price"
              disabled="readonly"
              // style={{width: '150px', midWidth: '50px', width: 'auto',}}
              InputProps={{
                inputComponent: NumberFormatCustomPrice,
              }}
              onChange={handleEditChange}
              value={editData.item_price}
            />
          </Box>
        </Grid>
        {auth.authLevel == 2 && (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <TextField
                name="business_price"
                label="Business Price"
                // style={{width: '150px', midWidth: '50px', width: 'auto',}}
                InputProps={{
                  inputComponent: NumberFormatCustomPrice,
                }}
                onChange={handleEditChange}
                value={editData.business_price}
              />
            </Box>
          </Grid>
        )}
        <Grid
          item
          xs={12}
          style={{
            /*height: '100px', */ textAlign: 'left',
            marginLeft: '25px',
          }}
        >
          {/* <FormControlLabel control={<Switch name="favorite" checked={editData.favorite.toLowerCase() === "true"} onChange={handleEditChange} />} label="Favorite" /> */}
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            {file.url ? (
              <img
                src={file.url}
                alt="Produce"
                width="140px"
                height="100px"
                style={{ border: '3px solid grey', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  border: '3px solid grey',
                  width: '140px',
                  height: '100px',
                  margin: 'auto',
                  textAlign: 'center',
                  lineHeight: '100px',
                  color: 'grey',
                }}
              >
                Upload an Image
              </div>
            )}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <Button
              size="small"
              variant="contained"
              disabled="readonly"
              component="label" /* style={{marginTop: '20px'}}*/
            >
              Add Picture
              <input
                onChange={onFileChange}
                type="file"
                id="uploadedPhoto"
                accept="image/gif, image/jpeg, image/png"
                style={{ display: 'none' }}

              />
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Grid container item xs={6} spacing={2} style={{ textAlign: 'right' }}>
        <Grid item xs={12} style={{ height: '100px' }}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">
              Item Description
            </InputLabel>
            <Select
              name="item_desc"
              onChange={handleEditChange}
              autoWidth
              value={editData.item_desc}
              disabled="readonly"
            >
              <MenuItem value={'Organic'}>Organic</MenuItem>
              <MenuItem value={'cOrganic'}>Certified Organic</MenuItem>
              <MenuItem value={'notOrganic'}>Not Organic</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} style={{ height: '100px' }}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Unit</InputLabel>
            <Select
              name="item_unit"
              onChange={handleEditChange}
              autoWidth
              value={editData.item_unit}
              disabled="readonly"
            >
              <MenuItem value={'each'}>each</MenuItem>
              <MenuItem value={'lbs'}>lbs</MenuItem>
              <MenuItem value={'bunch'}>Bunch</MenuItem>
              <MenuItem value={'basket'}>Basket</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <div style={{ height: '100px', backgroundColor: 'white' }}>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Size</InputLabel>
              <Select
                name="item_sizes"
                onChange={handleEditChange}
                autoWidth
                value={editData.item_sizes}
                disabled="readonly"
              >
                <MenuItem value={''}>N/A</MenuItem>
                <MenuItem value={'XS'}>X-Small</MenuItem>
                <MenuItem value={'S'}>Small</MenuItem>
                <MenuItem value={'M'}>Medium</MenuItem>
                <MenuItem value={'L'}>Large</MenuItem>
                <MenuItem value={'XL'}>X-Large</MenuItem>
              </Select>
            </FormControl>
          </div>
        </Grid>
        

        <Grid item xs={12}>
          <Box
            pl={9}
            display="flex"
            lineHeight="250%"
            color={appColors.paragraphText}
          >
            Taxable
            <Box flexGrow={1} />
            <Checkbox
              checked={editData.taxable === 'TRUE'}
              onChange={handleEditChange}
              // onChange={}
              name="taxable"
              color="primary"
              disabled = "true"
              
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            pl={9}
            display="flex"
            lineHeight="250%"
            color={appColors.paragraphText}
          >
            Active
            <Box flexGrow={1} />
            <Checkbox
              checked={editData.item_status === 'Active'}
              onChange={handleEditChange}
              // onChange={}
              name="item_status"
              color="primary"
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            pl={9}
            display="flex"
            lineHeight="250%"
            color={appColors.paragraphText}
          >
            Favorite
            <Box flexGrow={1} />
            <Checkbox
              checked={editData.favorite === 'TRUE'}
              onChange={handleEditChange}
              // onChange={}
              name="favorite"
              color="primary"
              disabled = "readonly"
            />
          </Box>
        </Grid>
        <Grid item xs={12} style={{ height: '100px', marginRight: '55px' }}>
          <Button
            size="small"
            variant="contained"
            /* component="label"*/ style={{ marginTop: '20px' }}
            onClick={handleSaveButton}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Grid>
  </div>
  );
}

function NumberFormatCustomQuantity(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      isNumericString
    />
  );
}
function NumberFormatCustomPrice(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: '75%',
    maxWidth: '500px',
    //   height: '350px',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    borderRadius: '20px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: `${50}%`,
    left: `${50}%`,
    transform: `translate(-${50}%, -${50}%)`,
    outline: 'none',
  },
  card: {
    maxHeight: '600px',
  },
  formControl: {
    margin: theme.spacing(1),
    width: 150,
    minWidth: 75,
  },
  card: {
    minHeight: '300px',
    border: '1px solid #ccc',
    borderRadius: '16px',
  },
  itemName: {
    backgroundColor: 'white',
    fontSize: '0.83rem',
    padding: '0',
    margin: '0',
  },
  itemDesc: {
    fontSize: '0.75rem',
    color: '#a3a3a3',
    textAlign: 'left',
  },
  itemPrice: {
    float: 'left',
    fontWeight: 'bold',
    fontSize: '0.83rem',
    padding: '0',
    margin: '0.2rem',
  },
  itemIcon: {
    float: 'right',
    padding: '0',
    margin: '0.2rem',
  },
}));
