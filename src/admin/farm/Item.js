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
const ITEM_EDIT_URL = BASE_URL + 'addItems/';

//TODO: Fields Needed ([X] business_price, [x] item_desc, [X] taxable, exp_date, status, favorite)
//TODO: Update Needed ( business_price, item_desc, taxable, exp_date, status, favorite)

export default function Item(props) {
  const auth = useContext(AuthContext);
  const [editData, setEditData] = useState(props.data);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState({
    obj: undefined,
    url: props.data.item_photo || '',
  });
  const classes = useStyles();

  useEffect(() => {
    setEditData(props.data);
  }, [props.data]);

  // useEffect(() => {
  //     // creating File object from item_photo URL
  //     fetch("https://cors-anywhere.herokuapp.com/" + props.data.item_photo)
  //     .then(response => response.blob())
  //     .then(blob => new File([blob], "item_photo.png", { type: "image/png" }))
  //     .then(file => setFile(prevFile => ({ ...prevFile, obj: file })))
  //     .catch(err => console.log(err.response || err));
  // }, []);

  const handleHeartChange = () => {
    const updatedData = { ...props.data };
    updatedData.favorite =
      props.data.favorite.toLowerCase() === 'true' ? 'FALSE' : 'TRUE';
    updateData(updatedData);
  };
  const handleRefresh = () => {
    if (props.data.item_status) {
      if (props.data.item_status.toLowerCase() !== 'hidden') {
        // Should always be true, but just in case!
        const newStatus =
          props.data.item_status.toLowerCase() !== 'past' ? 'Past' : 'Active'; // any status !== "Past" || "Hidden" is assumed "Current"
        updateStatus(newStatus);
      }
    } else {
      updateStatus('Active');
    }
  };
  const handleOpenEditModel = () => {
    setOpen(true);
  };
  const handleCloseEditModel = () => {
    setOpen(false);
    setEditData(props.data);
  };
  const handleEditChange = (event) => {
    setEditData({ ...editData, [event.target.name]: event.target.value });
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
  };
  const handleDelete = () => {
    updateStatus('Hidden');
  };

  // helper function
  // NOTE: Parva currently working on update endpoint so I don't need to upload image for every item update
  const updateData = (data) => {
    const postData = { ...data };
    const created_at = postData.created_at;
    delete postData.created_at;
    postData.item_photo = file.obj; // change to File object
    // postData.image_category = "item_images"; // NOTE: temporary
    // console.log(postData);

    let formData = new FormData();

    Object.entries(postData).forEach((item) => {
      if (typeof item[1] !== 'string') {
        postData[item[0]] = item[1] ? String(item[1]) : '';
      }
      formData.append(item[0], item[1]);
    });

    Axios.post(ITEM_EDIT_URL + 'Update', formData /*postData*/)
      .then((response) => {
        console.log(response);
        postData.created_at = created_at;
        props.setData((prevData) => {
          const updatedData = [...prevData];
          const sqlString = response.data.sql;
          updatedData[props.index] = {
            ...postData,
            // Converts price input from String to Number, to deal with empty string input cases.
            // Without this conversion in this case, price value would not be displayed since item_price = "".
            item_price: Number(postData.item_price),
            item_photo: sqlString.substring(
              sqlString.indexOf("item_photo = '") + 14,
              sqlString.indexOf("item_photo = '") + 72
            ),
          };
          return updatedData;
        });
      })
      .catch((err) => {
        console.error(err.response || err);
      });
  };
  const updateStatus = (status) => {
    // const postData = {
    //     item_uid: props.data.item_uid,
    //     item_status: status,
    // }
    let formData = new FormData();
    formData.append('item_uid', props.data.item_uid);
    formData.append('item_status', status);

    Axios.post(ITEM_EDIT_URL + 'Status', formData /*postData*/)
      .then((response) => {
        console.log(response);
        props.setData((prevData) => {
          const updatedData = [...prevData];
          updatedData[props.index].item_status = status;
          return updatedData;
        });
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };

  //modal that pops up when farmer edits an item
  const modelBody = (
    <div className={classes.paper}>
      <Grid container style={{ textAlign: 'center' }}>
        <Grid item xs={12}>
          <h3>Add Item</h3>
        </Grid>
        <Grid container item xs={6} spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="item_name"
              label="Item Name"
              onChange={handleEditChange}
              value={editData.item_name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="item_price"
              label="Item Price"
              // style={{width: '150px', midWidth: '50px', width: 'auto',}}
              InputProps={{
                inputComponent: NumberFormatCustomPrice,
              }}
              onChange={handleEditChange}
              value={editData.item_price}
            />
          </Grid>
          {auth.authLevel == 2 && (
            <Grid item xs={12}>
              <TextField
                name="business_price"
                label="Business Price"
                // style={{width: '150px', midWidth: '50px', width: 'auto',}}
                InputProps={{
                  inputComponent: NumberFormatCustomPrice,
                }}
                onChange={handleEditChange}
                value={editData.item_price}
              />
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
            {file.url ? (
              <img
                src={file.url}
                alt="Produce Image"
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
          </Grid>
          <Grid item xs={12}>
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
          </Grid>
        </Grid>
        <Grid container item xs={6} spacing={2} style={{ textAlign: 'right' }}>
          <Grid item xs={12}>
            <div style={{ height: '100px', backgroundColor: 'white' }}>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">
                  Type of Food
                </InputLabel>
                <Select
                  name="item_type"
                  onChange={handleEditChange}
                  autoWidth
                  value={editData.item_type}
                >
                  <MenuItem value={'vegetable'}>Vegetable</MenuItem>
                  <MenuItem value={'fruit'}>Fruit</MenuItem>
                  <MenuItem value={'dessert'}>Dessert</MenuItem>
                  <MenuItem value={'other'}>Other</MenuItem>
                </Select>
              </FormControl>
            </div>
          </Grid>
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
              >
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
                >
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
              Taxable?
              <Box flexGrow={1} />
              <Checkbox
                checked={editData.item_taxable === 'TRUE'}
                // onChange={}
                name="checkedB"
                color="primary"
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
  // let oldCardItem = (
  //     <Grid container  style={{backgroundColor: 'white',}}>
  //         <Grid item xs={12}>
  //             <CardContent style={{backgroundColor:'white', height: '20px', overflowY:'auto',}}>
  //                     <h5 style={{backgroundColor: 'white', padding:'0', margin: '0',}}>{props.data.item_name}</h5>
  //             </CardContent>
  //         </Grid>
  //         <Grid item xs={4} style={{backgroundColor:'white'}}>
  //             <CardContent>
  //                 <h5 style={{padding:'0', margin: '0',}}> <NumberFormat decimalScale={2}  fixedDecimalScale={true} value={props.data.item_price} displayType={'text'} thousandSeparator={true} prefix={'$'} /> </h5>
  //             </CardContent>
  //         </Grid>
  //         <Grid item xs={2} style={{backgroundColor:'white',}}>

  //         </Grid>
  //         <Grid item xs={6} style={{backgroundColor:'white',}}>
  //             <CardContent>

  //             </CardContent>
  //         </Grid>
  //         <Grid item xs={12}>
  //             <CardActions disableSpacing style={{justifyContent: "center"}}>
  //                 <IconButton onClick={handleHeartChange}>
  //                     <FavoriteIcon style={{color: props.data.favorite.toLowerCase() === "true" ? "red" : "grey"}} />
  //                 </IconButton>
  //                 <IconButton onClick={handleRefresh}>
  //                     <RefreshIcon />
  //                 </IconButton>
  //                 <IconButton onClick={handleOpenEditModel}>
  //                     <EditIcon/>
  //                 </IconButton>
  //                 <IconButton onClick={handleDelete}>
  //                     <DeleteIcon/>
  //                 </IconButton>
  //             </CardActions>
  //         </Grid>
  //     </Grid>
  // );

  const itemDescription = (description) => {
    // Description can be string or array
    try {
      let descriptionObject = JSON.parse(description);
      // console.log('Description array');
      // console.log(descriptionObject)
      let descriptionString = descriptionObject.reduce((acc, cur, idx) => {
        if (idx !== 0) {
          return acc + ', ' + cur;
        } else {
          return cur;
        }
      }, '');
      return descriptionString;
    } catch (e) {
      // Description is string, return directly
      return description;
    }
  };

  return (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <Modal open={open} onClose={handleCloseEditModel}>
        {modelBody}
      </Modal>
      <Card variant="outlined" className={classes.card}>
        <CardMedia
          image={
            props.data.item_photo ||
            'https://via.placeholder.com/400?text=No+Image+Available'
          }
          style={{ width: '100%', height: '200px', margin: 'auto' }}
        />
        <CardContent>
          <h5 className={classes.itemName}>{props.data.item_name}</h5>
          <p className={classes.itemDesc}>
            {itemDescription(props.data.item_desc)}
          </p>
        </CardContent>
        <NumberFormat
          decimalScale={2}
          fixedDecimalScale={true}
          value={props.data.item_price}
          displayType={'text'}
          thousandSeparator={true}
          prefix={'$'}
          className={classes.itemPrice}
        />
        <IconButton onClick={handleHeartChange} className={classes.itemIcon}>
          <StarRateIcon
            style={{
              color:
                props.data.favorite.toLowerCase() === 'true'
                  ? '#f7b300'
                  : 'grey',
            }}
          />
        </IconButton>
        <IconButton onClick={handleRefresh} className={classes.itemIcon}>
          <RefreshIcon />
        </IconButton>
        <IconButton onClick={handleDelete} className={classes.itemIcon}>
          <DeleteIcon />
        </IconButton>
        <IconButton onClick={handleOpenEditModel} className={classes.itemIcon}>
          <EditIcon />
        </IconButton>
      </Card>
    </Grid>
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

/*
<Grid container item xs={6}  style={{backgroundColor: 'green',}}>
                    <Grid item xs={12}>
                        <TextField
                        label="Name of Meal"
                        defaultValue={data.item_name}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                        label="Price"
                        defaultValue={data.item_price}
                        InputProps={{
                            inputComponent: NumberFormatCustomPrice,
                        }}
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Button onClick={handleSaveButton}>Save</Button>
                    </Grid>
                </Grid>

                <Grid  container item xs={6}  style={{textAlign:'center', backgroundColor: 'blue',}}>
                    <Grid item xs={12} >
                        <Select
                        defaultValue={"vegetable"} 
                        >
                            <MenuItem value={"vegetable"}>Vegetable</MenuItem>
                            <MenuItem value={"fruit"}>Fruit</MenuItem>
                            <MenuItem value={"dessert"}>Dessert</MenuItem>
                            <MenuItem value={"other"}>Other</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel control={<Switch />} label="Favorite" />
                    </Grid>

                    <Grid item xs={7} style={{backgroundColor: 'red'}}>
                        <Button variant="contained" component="label">
                            Edit Picture
                            <input onChange={onFileChange} type="file" id="uploadedPhoto" accept="image/gif, image/jpeg, image/png" style={{ display: "none" }}/>
                         </Button>
                    </Grid>
                    <Grid item xs={5}>
                        {file.name}
                    </Grid>
                </Grid>
*/
