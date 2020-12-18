import React, { useState, useEffect } from 'react';
import Item from './Item';
import AddItemModel from './AddItemModel';
import NumberFormat from 'react-number-format';
// import IconButton from '@material-ui/core/IconButton';
// import Fab from '@material-ui/core/Fab';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';
// import InputLabel from '@material-ui/core/InputLabel';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormControl from '@material-ui/core/FormControl';
// import Switch from '@material-ui/core/Switch';
// import {AdminFarmContext} from '../AdminFarmContext'
// import {Grid, Paper, ButtonBase, Button, Typography, Card, CardActions, CardMedia, CardContent, Modal, TextField, CircularProgress, Divider} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ButtonBase, Divider, Grid, Modal } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import axios from 'axios';

//https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/itemsByBusiness/200-000003
//api/v2/businesses
//https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/businesses
const API_BASE_URL = process.env.REACT_APP_SERVER_BASE_URI + 'itemsByBusiness/';

//TODO: add fields to add modal, close modal with x
//DONE: for edit item price, if admin change item price and business price, if farm only change business price
//DONE: match fields in add produce to database values
//DONE: Check if extra values needs to be added to the endpoint for edit item
//TODO: Add each/ bunch/ lbs in the display
export default function FarmerHome({ farmID, farmName, ...props }) {
  // const {farmID, setFarmID} = useContext(AdminFarmContext);
  // NOTE:
  // Empty object inside array caused the first item component to render with no data.
  // This meant upon a page load/refresh, the heart icon would always be greyed out regardless of the data.favorite value.
  // Why does the farmData array initialize with an empty object? Was this required for something?
  // If this empty object was required, an alternative fix would be to add a useEffect with data prop dependency to Item.js.
  const [farmData, setFarmData] = useState([]);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState('');
  const [mealName, setMealName] = useState('');
  const [item, setItem] = useState({ name: '', quantity: '', price: '' });
  const classes = useStyles();

  // let farmName;
  // if(farmID === '200-000003') {farmName = 'Esquivel Farm'}
  // if(farmID === '200-000004') {farmName = 'Resendiz Family'}

  useEffect(() => {
    //get data from farm
    console.log('get farm data..');
    if (farmID !== '') getBusinessItems(API_BASE_URL + farmID, setFarmData);
  }, [farmID]);

  const getBusinessItems = (urlAPI, setData) => {
    axios
      .get(urlAPI)
      .then((response) => {
        console.log('reload');
        console.log('Home:', response.data.result.result);
        response.data.result.result.sort(function (a, b) {
          var textA = a.item_name.toUpperCase();
          var textB = b.item_name.toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
        setData(response.data.result.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOpenModel = () => {
    // console.log(farmData)
    setOpen(true);
  };
  const handleCloseModel = () => {
    setOpen(false);
  };

  const handleRefreshAll = () => {
    // let pastProduce =
    //     farmData.filter((itemData) => { // display 'past' status items AND items with no status tag
    //         return (!itemData.item_status || itemData.item_status.toLowerCase() === "past");
    //     });
    let refreshedPastProduce = farmData.map((itemData) => {
      // display 'past' status items AND items with no status tag
      if (
        !itemData.item_status ||
        itemData.item_status.toLowerCase() === 'past'
      ) {
        return {
          ...itemData,
          item_status: 'Active',
        };
      } else {
        return itemData;
      }
    });
    console.log(refreshedPastProduce);
    setFarmData(refreshedPastProduce);
    // To Do: put this in database
  };

  //model for when farmer adds new item
  const modelBody = (
    // adding parent <div> fixes 'Material-UI: The modal content node does not accept focus' warning.
    <div>
      <AddItemModel
        farmID={farmID}
        handleClose={handleCloseModel}
        setData={setFarmData}
      />
    </div>
  );

  return (
    <div hidden={props.hidden}>
      <div style={labelStyle}>
        <h2 className={classes.heading}>{farmName}</h2>
      </div>
      <Divider className={classes.divider} />
      <div style={labelStyle}>
        <h2 className={classes.subHeading}>Current Produce</h2>
      </div>
      <div style={labelStyle}>
        <ButtonBase onClick={handleOpenModel}>
          <h2 className={classes.subHeading}> + Add Product </h2>
        </ButtonBase>
      </div>
      {/* {!farmData.length ? ( */}
      <Grid container spacing={2} /* style={{ width: "100%", margin: 0 }}*/>
        {
          //map through each item and display it
          farmData &&
            farmData.map((itemData, idx) => {
              // display 'active' status items only
              if (
                itemData.item_status &&
                itemData.item_status.toLowerCase() === 'active'
              )
                return (
                  <Item
                    data={itemData}
                    key={idx}
                    index={idx}
                    setData={setFarmData}
                  />
                );
              return null;
            })
        }
      </Grid>
      {/* ) : (<CircularProgress/>)} */}
      <Modal open={open} onClose={handleCloseModel}>
        {modelBody}
      </Modal>
      {/* {!farmData.length ? ( */}
      {/* <Grid container spacing={2}>
                   
                </Grid> */}
      {/* ) : (<CircularProgress/>)} */}
      <Divider className={classes.divider} />
      <div style={labelStyle}>
        <h2 className={classes.subHeading}>Past Produce</h2>
      </div>
      <div style={labelStyle}>
        <ButtonBase onClick={handleRefreshAll}>
          <h2 className={classes.subHeading}>
            <RefreshIcon /> Renew All Products
          </h2>
        </ButtonBase>
      </div>
      {/* {!farmData.length ? ( */}
      <Grid container spacing={2}>
        {
          //map through each item and display it
          farmData &&
            farmData.map((itemData, idx) => {
              // display 'past' status items AND items with no status tag
              if (
                !itemData.item_status ||
                itemData.item_status.toLowerCase() === 'past'
              )
                return (
                  <Item
                    data={itemData}
                    key={idx}
                    index={idx}
                    setData={setFarmData}
                  />
                );
              return null;
            })
        }
        {/* NOTE: Any item with a status tag of not 'past' nor 'active' is considered deleted and will be hidden */}
      </Grid>
      {/* ) : (<CircularProgress/>)} */}
    </div>
  );
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
  heading: {
    color: '#337178',
  },
  subHeading: {
    color: '#a3a3a3',
  },
  divider: {
    backgroundColor: '#337178',
    margin: theme.spacing(3),
  },
}));

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
