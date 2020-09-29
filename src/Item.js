import React, { Component, useContext, useState, useEffect } from 'react'
import NumberFormat from 'react-number-format';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import RefreshIcon from '@material-ui/icons/Refresh';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {Grid, Paper, Button, Typography, Card, CardActions, CardMedia, CardContent, Modal, TextField, CircularProgress} from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Axios from 'axios';

const BASE_URL = "https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/";
const ITEM_EDIT_URL = BASE_URL + "addItems/";

export default function Item(props) {
    const [editData, setEditData] = useState(props.data);
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState({ obj: undefined, url: props.data.item_photo || "" });
    const classes = useStyles();

    // Fix for FarmerHome.js: Line 24
    useEffect(() => {
        setEditData(props.data);
    }, [props.data]);

    const handleHeartChange = () => {
        const updatedData = { ...props.data };
        updatedData.favorite = props.data.favorite.toLowerCase() === "true" ? "FALSE" : "TRUE";
        updateData(updatedData);
    }
    const handleRefresh = () => {
        if (props.data.item_status.toLowerCase() !== "hidden") { // Should always be true, but just in case!
            const newStatus = props.data.item_status.toLowerCase() !== "past" ? "Past" : ""; // any status !== "Past" || "Hidden" is assumed "Current"
            updateStatus(newStatus);
        }
    }
    const handleOpenEditModel = () => {
        setOpen(true);
    }
    const handleCloseEditModel = () => {
        setOpen(false);
        setEditData(props.data);
    }
    const handleEditChange = (event) => {
        setEditData({...editData, [event.target.name]: event.target.value});
    }
    const onFileChange = (event) => {
        setFile({
            obj: event.target.files[0],
            url: URL.createObjectURL(event.target.files[0]),
        });
        console.log(event.target.files[0].name)
    }
    const handleSaveButton = () => {
        // NOTE: call turn-file-to-s3-url API Endpoint
        updateData(editData);
        setOpen(false);
    }
    const handleDelete = () => {
        updateStatus("Hidden");
    }

    // helper function
    const updateData = (data) => { // FIXME: update item from parent component
        const postData = { ...data };
        const created_at = postData.created_at;
        delete postData.created_at;

        Object.entries(postData).forEach(item => {
            if (typeof item[1] !== "string") {
                postData[item[0]] = item[1] ? String(item[1]) : "";
            }
        });

        Axios.post(ITEM_EDIT_URL + "Update", postData)
        .then(response => {
            console.log(response);
            postData.created_at = created_at;
            props.setData(prevData => {
                const updatedData = [...prevData];
                updatedData[props.index] = postData;
                return updatedData;
            });
        })
        .catch(err => {
            console.error(err);
        });
    }
    const updateStatus = (status) => {
        const postData = {
            item_uid: props.data.item_uid,
            item_status: status,
        }
        Axios.post(ITEM_EDIT_URL + "Status", postData)
        .then(response => {
            console.log(response);
            props.setData(prevData => {
                const updatedData = [...prevData];
                updatedData[props.index].item_status = status;
                return updatedData;
            })
        })
        .catch(err => {
            console.log(err);
        });
    }

    //modal that pops up when farmer edits an item
    const modelBody = (
        <div className={classes.paper} >
            <Grid container style={{backgroundColor: 'white', height: '350px', textAlign: 'center', margin: 'none',}} spacing={0}>
                <Grid item xs={12} style={{textAlign: 'center', height: '45px', backgroundColor: 'white'}}>
                    <h3>Edit Item</h3>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                            label="Name of Meal"
                            name="item_name"
                            value={editData.item_name}
                            onChange={handleEditChange}
                            />
                </Grid>
                <Grid item xs={6}>
                    <Select name="item_type" onChange={handleEditChange} value={editData.item_type}>
                                <MenuItem value={"vegetable"}>Vegetable</MenuItem>
                                <MenuItem value={"fruit"}>Fruit</MenuItem>
                                <MenuItem value={"dessert"}>Dessert</MenuItem>
                                <MenuItem value={"other"}>Other</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    label="Price"
                    name="item_price"
                    value={editData.item_price}
                    onChange={handleEditChange}
                    InputProps={{
                        inputComponent: NumberFormatCustomPrice,
                    }}
                    />
                </Grid>
                <Grid item xs={6}>
                    {file.url ? (
                        <img src={file.url} alt="Produce Image" width="140px" height="100px" style={{ border: "3px solid grey", objectFit: "cover" }}/>
                    ) : (
                        <div style={{ border: "3px solid grey", width: "140px", height: "100px", margin: "auto", textAlign: "center", lineHeight: "100px", color: "grey" }}>
                            Upload an Image
                        </div>
                    )}    
                </Grid>
                <Grid item xs={6}>
                        <Button size="small" variant="contained" onClick={handleSaveButton}>Save</Button>
                </Grid>
                <Grid container item xs={6}>
                    <Grid item xs={12}>
                        <Button size="small" variant="contained" component="label">
                            Edit Picture
                            <input onChange={onFileChange} type="file" id="uploadedPhoto" accept="image/gif, image/jpeg, image/png" style={{ display: "none" }}/>
                         </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography style={{fontSize:'10px'}} varient="h6">{file.name}</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
    return (
        <Grid item xs={6} sm={4} md={3} lg={2}>
            <Modal open={open} onClose={handleCloseEditModel}>
                {modelBody}
            </Modal>
            <Card
                
                style={{height: '375px',}}
            >
            <CardMedia
                image={props.data.item_photo || "https://via.placeholder.com/400?text=No+Image+Available"}
                style={{width: '100%', height: '200px', margin: 'auto'}}
            />
            <Grid container  style={{backgroundColor: 'white',}}>
                <Grid item xs={12}>
                    <CardContent style={{backgroundColor:'white', height: '20px', overflowY:'scroll',}}>
                            <h5 style={{backgroundColor: 'white', overflowY:'scroll', padding:'0', margin: '0',}}>{props.data.item_name}</h5>
                    </CardContent>
                </Grid>
                <Grid item xs={4} style={{backgroundColor:'white',}}>
                    <CardContent>
                        <NumberFormat decimalScale={2}  fixedDecimalScale={true} value={props.data.item_price} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                    </CardContent>
                </Grid>
                <Grid item xs={2} style={{backgroundColor:'white',}}>
                    
                </Grid>
                <Grid item xs={6} style={{backgroundColor:'white',}}>
                    <CardContent>
                        
                    </CardContent>
                </Grid>
                <Grid item xs={12}>
                    <CardActions disableSpacing style={{overflowX: 'scroll',}}>
                        <IconButton onClick={handleHeartChange}>
                            <FavoriteIcon style={{color: props.data.favorite.toLowerCase() === "true" ? "red" : "grey"}} />
                        </IconButton>
                        <IconButton onClick={handleRefresh}>
                            <RefreshIcon />
                        </IconButton>
                        <IconButton onClick={handleOpenEditModel}>
                            <EditIcon/>
                        </IconButton>
                        <IconButton onClick={handleDelete}>
                            <DeleteIcon/>
                        </IconButton>
                    </CardActions>
                </Grid>
            </Grid>
            </Card>  
        </Grid>
    )
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
      height: '350px',
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