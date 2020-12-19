import React, {
  Component,
  useContext,
  useState,
  useEffect,
  forwardRef,
} from 'react';
import NumberFormat from 'react-number-format';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import appColors from '../../styles/AppColors';
import { AuthContext } from '../../auth/AuthContext';
import { AdminFarmContext } from '../AdminFarmContext';
import axios from 'axios';
import {
  Grid,
  Paper,
  Button,
  Typography,
  Card,
  CardActions,
  CardMedia,
  CardContent,
  Modal,
  TextField,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AuthUtils from 'utils/AuthUtils';

const booleanVals = new Set(['taxable', 'favorite']);

const AddItemModel = forwardRef(({ farmID, ...props }, ref) => {
  const auth = useContext(AuthContext);

  const [file, setFile] = useState({ obj: undefined, url: '' }); // NOTE: url key is probably useless
  const classes = useStyles();
  const [itemProps, setItemProps] = useState({
    itm_business_uid: farmID,
    item_name: '',
    item_status: 'Active',
    item_type: '',
    item_desc: '',
    item_unit: '',
    item_price: '',
    business_price: '',
    item_sizes: '',
    favorite: 'FALSE',
    taxable: 'FALSE',
    item_photo: { obj: undefined, url: '' },
    exp_date: '',
  });
  const handleChange = (event) => {
    const { name, value, checked } = event.target;

    let newValue = value;
    if (booleanVals.has(name)) newValue = checked ? 'TRUE' : 'FALSE';
    if (name === 'item_status') newValue = checked ? 'Active' : 'Past';
    console.log('setEditData(props.data): ', name, newValue);
    setItemProps({ ...itemProps, [name]: newValue });
  };

  const onFileChange = (event) => {
    setFile({
      obj: event.target.files[0],
      url: URL.createObjectURL(event.target.files[0]),
    });
    console.log(event.target.files[0].name);
  };

  const insertAPI = process.env.REACT_APP_SERVER_BASE_URI + 'addItems/Insert';

  // NOTE: Which item inputs are optional/required?

  //post new item to endpoint
  const addItem = () => {
    const itemInfo = {
      itm_business_uid: farmID,
      item_name: itemProps.item_name,
      item_status: itemProps.item_status,
      item_type: itemProps.item_type,
      item_desc: itemProps.item_desc,
      item_unit: itemProps.item_unit,
      item_price: parseFloat(itemProps.item_price).toFixed(2),
      business_price: parseFloat(
        auth.authLevel == 2 ? itemProps.business_price : itemProps.item_price
      ).toFixed(2),
      item_sizes: itemProps.item_sizes,
      favorite: itemProps.favorite,
      taxable: itemProps.taxable,
      item_photo: file.obj,
      exp_date: itemProps.exp_date,
      // image_category: "item_images", // NOTE: temporary
    };
    let formData = new FormData();
    Object.entries(itemInfo).forEach((entry) => {
      formData.append(entry[0], entry[1]);
    });

    // console.log(itemInfo);
    axios
      .post(
        insertAPI,
        formData // itemInfo
      )
      .then((response) => {
        // console.log(response);

        // appending new item to the business's items list
        // NOTE: currently getting info by searching through sql string response
        const sqlString = response.data.sql;
        itemInfo.item_uid = sqlString.substring(
          sqlString.indexOf("item_uid = '") + 12,
          sqlString.indexOf("item_uid = '") + 22
        );
        itemInfo.created_at = sqlString.substring(
          sqlString.indexOf("created_at = '") + 14,
          sqlString.indexOf("created_at = '") + 24
        );
        itemInfo.item_photo = sqlString.substring(
          sqlString.indexOf("item_photo = '") + 14,
          sqlString.indexOf("item_photo = '") + 78
        );
        itemInfo.item_price = parseFloat(itemInfo.item_price);
        itemInfo.business_price = parseFloat(itemInfo.business_price);

        props.setData((prevData) => [...prevData, itemInfo]);

        props.handleClose();
      })
      .catch((er) => {
        console.log(er);
      });
  };

  return (
    <div className={classes.paper}>
      <Grid container>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <h3>Add Item</h3>
          </Box>
        </Grid>

        <Grid container item xs={6} spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <TextField
                name="item_name"
                label="Item Name"
                onChange={handleChange}
                value={itemProps.item_name}
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
                  onChange={handleChange}
                  autoWidth
                  value={itemProps.item_type}
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
                // style={{width: '150px', midWidth: '50px', width: 'auto',}}
                InputProps={{
                  inputComponent: NumberFormatCustomPrice,
                }}
                onChange={handleChange}
                value={itemProps.item_price}
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
                  onChange={handleChange}
                  value={itemProps.business_price}
                />
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            {' '}
            <Box display="flex" justifyContent="center">
              {file.url !== '' ? (
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
                onChange={handleChange}
                autoWidth
                value={itemProps.item_desc}
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
                onChange={handleChange}
                autoWidth
                value={itemProps.item_unit}
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
                  onChange={handleChange}
                  autoWidth
                  value={itemProps.item_sizes}
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
          {/* <Grid item xs={12}>
            <TextField
              id="date"
              label="Expiration Date"
              type="date"
              value={itemProps.exp_date}
              defaultValue=""
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid> */}

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
                checked={itemProps.taxable === 'TRUE'}
                onChange={handleChange}
                // onChange={}
                name="taxable"
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
              Active
              <Box flexGrow={1} />
              <Checkbox
                checked={itemProps.item_status === 'Active'}
                onChange={handleChange}
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
                checked={itemProps.favorite === 'TRUE'}
                onChange={handleChange}
                // onChange={}
                name="favorite"
                color="primary"
              />
            </Box>
          </Grid>
          <Grid item xs={12} style={{ height: '100px', marginRight: '55px' }}>
            <Button
              size="small"
              variant="contained"
              /* component="label"*/ style={{ marginTop: '20px' }}
              onClick={addItem}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
});

//styling
const paperStyle = {
  height: '2000px',
  width: '95%',
  maxWidth: '2000px',
  textAlign: 'center',
  display: 'inline-block',
  padding: '7px',
  marginTop: '30px',
  backgroundColor: 'white',
};
const labelStyle = {
  backgroundColor: 'white',
  width: '80%',
  textAlign: 'left',
  marginLeft: '25px',
  marginBottom: '20px',
};
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: '75%',
    maxWidth: '500px',
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
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
//NumberFormatCustomPrice is used to validate user input
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

export default AddItemModel;
