import React, {
    Component,
    useContext,
    useState,
    useEffect,
    forwardRef,
  } from 'react';
  import AddItemModel from './AddItemModel';
  import AddBusinessToProduct from './AddBusinessToProduct';
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
  
  
  
  
  const CheckItem = forwardRef(({ farmID, ...props }, ref) => {
    console.log('props in add item modal',props);
    const auth = useContext(AuthContext);
    const [produce, setProduce] = useState([]);
    const [selectedProduce ,setselectedProduce] = useState();
    const [file, setFile] = useState({ obj: undefined, url: '' }); // NOTE: url key is probably useless
    const classes = useStyles();
    const [itemsData, setItemsData] = useState()
    const [open, setOpen] = useState(false);
    const [openBus, setOpenBus] = useState(false);
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

    const handleOpenModel = () => {
        // console.log(farmData)
        setOpen(true);
      };
    const handleCloseModel = () => {
    setOpen(false);
    };
    
    const handleOpenModelBus = () => {
    setOpenBus(true);
    };
    const handleCloseModelBus = () => {
    setOpenBus(false);
    };
    

    const handleChangeProduce = (event) => {
        console.log("init", selectedProduce)
        setselectedProduce(event.target.value.split(",")[1]);
        console.log("exit", selectedProduce)
      };

    useEffect(() => {
        axios
          .get(
            "https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/getDistinctItems"
          )
          .then((res) => {
            console.log('distinct items are',res.data.result);
    
            console.log("produce1", produce, typeof produce);
            setProduce(res.data.result);
            })
            console.log('Produce is', produce)
            
      }, []);
    
    useEffect (() => {
    axios
        .get(process.env.REACT_APP_SERVER_BASE_URI + 'getItemsByUid/'+selectedProduce)
        .then((res) => {
            console.log('in getitemsbyuid', res)
            const temp = res.data.result
            temp['bus_uid']=farmID
            temp['new_item']="FALSE"
            setItemsData(temp)
            
            
        })
        .catch((err) => {
        console.log(err);
        });
    },[selectedProduce]);
      
    
      const modelBody = (
        <div>
            <AddItemModel
                farmID={farmID}
                handleClose={handleCloseModel}
            />
        </div>
    );
    
    const modelBodyBus = (
        
        <div>
        <AddBusinessToProduct
            data={itemsData}
            handleClose={handleCloseModelBus}
        />
        </div>
    );
    
    return (
      <div className={classes.paper}>
        <Grid container>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <h3>Add Item</h3>
            </Box>
          </Grid>
        </Grid>
        
        <Grid container>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                
                <select onChange={(event) => handleChangeProduce(event)}>
                {produce.map((pro) => (
                    <option
                        key={pro.item_uid}
                        value={
                        pro.item_name + "," + pro.item_uid + "," + pro.itm_business_uid
                        }
                    >
                        {pro.item_name} / {pro.item_unit}
                    </option> 
                    ))}
                </select>
              </Box>
            </Grid>
        </Grid>

        <Grid container>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
              <Button
              size="small"
              variant="contained"
              /* component="label"*/ style={{ marginTop: '20px' }}
              onClick={handleOpenModelBus}
            >
              Add Selected Item To Business
            </Button>
              </Box>
            </Grid>
        </Grid>
        
        <Grid container>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Button
                size="small"
                variant="contained"
                /* component="label"*/ style={{ marginTop: '20px' }}
                onClick={handleOpenModel}
                >
                Add New Item To SF
                </Button>
              </Box>
            </Grid>
        </Grid>
        
       
        <Modal open={open} onClose={handleCloseModel}>
        {modelBody}
        </Modal>

        <Modal open={openBus} onClose={handleCloseModelBus}>
        {modelBodyBus}
        </Modal>
        
        
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
  
  export default CheckItem;
  