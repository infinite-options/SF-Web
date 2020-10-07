import React, { Component, useContext, useState, useEffect } from 'react'
import NumberFormat from 'react-number-format';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Switch from '@material-ui/core/Switch';
import {AdminFarmContext} from './AdminFarmContext.js'
import axios from 'axios';
import {Grid, Paper, Button, Typography, Card, CardActions, CardMedia, CardContent, Modal, TextField, CircularProgress} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


export default function AddItemModel({ farmID, ...props }) {
    const [file, setFile] = useState({ obj: undefined, url: "" }); // NOTE: url key is probably useless
    const [favorite, setFavorite] = useState(false);
    const classes = useStyles();
    const [value, setValue] = useState({
        itm_business_uid : '',
        item_name : '',
        item_status : '',
        item_type : '',
        item_desc : '',
        item_unit : '',
        item_price : '',
        item_sizes : '',
        favorite : '',
        item_photo : '',
        exp_date : '',
    });
    const handleChange = (e) => {
        setValue({...value, [e.target.name]: e.target.value})
    }

    const handleFavChange = (e) => {
        setFavorite(!favorite);
    }
    
    const onFileChange = (event) => {
        setFile({
            obj: event.target.files[0],
            url: URL.createObjectURL(event.target.files[0]),
        });
        console.log(event.target.files[0])
        console.log(event.target.files[0].name)
    }
    const insertAPI = 'https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/addItems/Insert'

    // NOTE: Which item inputs are optional/required?
    const itemInfo = {
        itm_business_uid : farmID,
        item_name : value.item_name,
        item_status : "active",
        item_type : value.item_type,
        item_desc : value.item_desc,
        item_unit : value.item_unit,
        item_price : value.item_price,
        item_sizes : value.item_sizes,
        favorite : favorite.toString().toUpperCase(),
        item_photo : file.obj, 
        exp_date : "",
        image_category: "item_images", // NOTE: temporary
    }

    //post new item to endpoint
    const addItem = () => {
        // NOTE: call turn-file-to-s3-url API Endpoint
        // THEN -> itemInfo.item_photo = URL response
        
        let formData = new FormData();
        Object.entries(itemInfo).forEach(entry => {
            formData.append(entry[0], entry[1]);
        });

        console.log(itemInfo)
        axios.post(insertAPI,
            formData // itemInfo
        ).then(response => {
            console.log(response);
            
            // appending new item to the business's items list
            // NOTE: currently getting info by searching through sql string response
            const sqlString = response.data.sql;
            itemInfo.item_uid = sqlString.substring(sqlString.indexOf("item_uid = '") + 12, sqlString.indexOf("item_uid = '") + 22);
            itemInfo.created_at = sqlString.substring(sqlString.indexOf("created_at = '") + 14, sqlString.indexOf("created_at = '") + 24);
            itemInfo.item_photo = sqlString.substring(sqlString.indexOf("item_photo = '") + 14, sqlString.indexOf("item_photo = '") + 84);
            props.setData(prevData => ([...prevData, itemInfo]));
            
            props.handleClose();
        }).catch(er => {
            console.log(er);
        });
    }
    
    return (
        <div className={classes.paper} >
            <Grid container style={{textAlign: 'center'}}>
                <Grid item xs={12}>
                    <h3>Add Item</h3>
                </Grid>
                <Grid container item xs={6} spacing={2}>
                    <Grid item xs={12}>
                        <TextField  name="item_name" /*style={{width: '150px', midWidth: '50px'}}*/ label="Name of Meal" onChange={handleChange} value={value.item_name} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                        name="item_price"
                        label="Price"
                        // style={{width: '150px', midWidth: '50px', width: 'auto',}}
                        InputProps={{
                            inputComponent: NumberFormatCustomPrice,
                        }}
                        onChange={handleChange}
                        value={value.item_price}
                        />
                    </Grid>
                    <Grid item xs={12} style={{/*height: '100px', */textAlign: "left", marginLeft: "25px"}}>
                        <FormControlLabel control={<Switch name="favorite" checked={favorite} onChange={handleFavChange} />} label="Favorite" />
                    </Grid>
                    <Grid item xs={12}>
                        {file.url ? (
                            <img src={file.url} alt="Produce Image" width="140px" height="100px" style={{ border: "3px solid grey", objectFit: "cover" }}/>
                        ) : (
                            <div style={{ border: "3px solid grey", width: "140px", height: "100px", margin: "auto", textAlign: "center", lineHeight: "100px", color: "grey" }}>
                                Upload an Image
                            </div>
                        )}                    
                    </Grid>
                    <Grid item xs={12}>
                        <Button size="small" variant="contained" component="label"/* style={{marginTop: '20px'}}*/>
                            Add Picture
                                <input onChange={onFileChange} type="file" id="uploadedPhoto" accept="image/gif, image/jpeg, image/png" style={{ display: "none" }}/>
                         </Button>
                    </Grid>
                </Grid>
                <Grid container item xs={6} spacing={2} style={{textAlign:'right'}}>
                    <Grid item xs={12} >
                        <div style={{height: '100px', backgroundColor: 'white'}}>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="demo-simple-select-label">Type of Food</InputLabel>
                                <Select name="item_type" onChange={handleChange} autoWidth  value={value.item_type}>
                                    <MenuItem value={"vegetable"}>Vegetable</MenuItem>
                                    <MenuItem value={"fruit"}>Fruit</MenuItem>
                                    <MenuItem value={"dessert"}>Dessert</MenuItem>
                                    <MenuItem value={"other"}>Other</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </Grid>
                    <Grid item xs={12} style={{height: '100px'}}>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-label">Farming Method</InputLabel>
                            <Select name="item_desc" onChange={handleChange} autoWidth value={value.item_desc}>
                                <MenuItem value={"Organic"}>Organic</MenuItem>
                                <MenuItem value={"cOrganic"}>Certified Organic</MenuItem>
                                <MenuItem value={"notOrganic"}>Not Organic</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} style={{height: '100px'}}>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-label">Unit</InputLabel>
                            <Select name="item_unit" onChange={handleChange} autoWidth  value={value.item_unit}>
                                <MenuItem value={"lbs"}>lbs</MenuItem>
                                <MenuItem value={"bunch"}>Bunch</MenuItem>
                                <MenuItem value={"basket"}>Basket</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} >
                        <div style={{height: '100px', backgroundColor: 'white'}}>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="demo-simple-select-label">Size</InputLabel>
                                <Select name="item_sizes" onChange={handleChange} autoWidth value={value.item_sizes}>
                                    <MenuItem value={"XS"}>X-Small</MenuItem>
                                    <MenuItem value={"S"}>Small</MenuItem>
                                    <MenuItem value={"M"}>Medium</MenuItem>
                                    <MenuItem value={"L"}>Large</MenuItem>
                                    <MenuItem value={"XL"}>X-Large</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </Grid>
                    <Grid item xs={12} style={{height: '100px', marginRight: "55px"}}>
                        <Button size="small" variant="contained"/* component="label"*/ style={{marginTop: '20px'}} onClick={addItem}>Save</Button>
                    </Grid>
                </Grid>
            </Grid>
            
        </div>
    )
}


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
}
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

