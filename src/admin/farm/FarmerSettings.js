import React, { useState, useEffect, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
// import Input from '@material-ui/core/Input';
import axios from 'axios';
import { AdminFarmContext } from '../AdminFarmContext'
import AcceptTime from "./components/AcceptTime";
import DeliveryTime from "./components/DeliveryTime";
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const BUSINESS_DETAILS_URL = "https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/business_details_update/";



function createDateTimeAccept(props){
    return(
        <AcceptTime
            weekday = {props.dayInWeek}
            start = {props.start}
            end ={props.end}
            id={props.dayInWeek}
            key={props.dayInWeek}
        />);
}

function createDateTimeDelivery(props){
    return(
        <DeliveryTime
            weekday = {props.dayInWeek}
            start = {props.start}
            end ={props.end}
            id={props.dayInWeek}
            key={props.dayInWeek}
        />);
}

export default function FarmerSettings({ farmID, farmName, ...props }) {
    const context =useContext(AdminFarmContext);
    const [settings, setSettings] = useState({});
    const [error, setError]=useState(false);
    const [loaded,setLoaded]=useState(false);
    var businessID = "200-000004";
    //use this state below to set up information of middle collumn
    const [businessAndFarmDetail, setBusFarm] = useState({});
    const [passwordHere,setPass]=useState("");
    const [errorStatus,setErrorPass]=useState(false);

    const handleChange = (event) => {
        if(event.target.name==="phone"){
            var holdNumber= event.target.value;
            var createCorrectFormat= "("+holdNumber.slice(0,3)+") "+ holdNumber.slice(3,6)+"-"+holdNumber.slice(6,10);
            setBusFarm({ ...businessAndFarmDetail, [event.target.name]: createCorrectFormat });
        }else if(event.target.name==="password"){
            setPass(event.target.value);
        }else if(event.target.name==="passwordConfirm"){
            if(event.target.value !== passwordHere){
                setErrorPass(true);
            }else{
                setErrorPass(false);
            }
        }else if(event.target.name==="email"){

        } else{
            setBusFarm({ ...businessAndFarmDetail, [event.target.name]: event.target.value });
        }
        
    };
    // console.log(businessAndFarmDetail);

    const [deliverStrategy, setDeliveryStrategy] = useState({
        pickupStatus: true,
        deliverStatus: false,
    });

    const [storage, setStorage] = useState({
        reusable: true,
        disposable: false,
    });

    const [cancellation, setCancellation] = useState({
        allowCancel: true,
        noAllowCancel: false,
    });

    //this three function is to check/uncheck box and update state
    const handleChangeCancel = (event) => {
        var optionPick =event.target.name; 
        var newCancelObj={};
        if(optionPick ==="allowCancel"){
            newCancelObj={
                allowCancel: true,
                noAllowCancel: false,
            }
        }else{
            newCancelObj={
                allowCancel: false,
                noAllowCancel: true,
            }
        }
        setCancellation(newCancelObj);
    };
    const handleChangeStorage = (event) => {
        var optionPick =event.target.name; 
        var newStorageObj={};
        if(optionPick ==="reusable"){
            newStorageObj={
                reusable: true,
                disposable: false,
            }
        }else{
            newStorageObj={
                reusable: false,
                disposable: true,
            }
        }
        setStorage(newStorageObj);
    };
    const handleChangeDelivery = (event) => {
        var optionPick =event.target.name; 
        var newDeliveryObj={};
        if(optionPick ==="pickupStatus"){
            newDeliveryObj={
                pickupStatus: true,
                deliverStatus: false,
            }
        }else{
            newDeliveryObj={
                pickupStatus: false,
                deliverStatus: true,
            }
        }
        setDeliveryStrategy(newDeliveryObj);
    };

    useEffect(() => {
        getFarmSettings();
    }, [farmID])
    
    const getFarmSettings = () => {
        axios.post(BUSINESS_DETAILS_URL + "Get", { business_uid: businessID })
        .then(response => {
            console.log("Settings:", response.data.result[0]);
            setSettings(response.data.result[0]);
            context.setTimeChange(JSON.parse(response.data.result[0].business_accepting_hours));
            context.setDeliveryTime(JSON.parse(response.data.result[0].business_delivery_hours));
            var holdData=response.data.result[0];
            var BusAndFarmObj ={
                business_name: holdData.business_name,
                description : holdData.business_desc,
                firstName: holdData.business_contact_first_name,
                lastName:  holdData.business_contact_last_name,
                phone: holdData.business_phone_num,
                street: holdData.business_address,
                city: holdData.business_city,
                state: holdData.business_state,
                zip: holdData.business_zip,
                email:holdData.business_email,
                password: holdData.business_password
            }
            setBusFarm(BusAndFarmObj);
            setLoaded(true);
        })
        .catch(err => {
            console.log(err.response || err);
            setError(true);
        });
    };

    if(error && !loaded){
        return (
            <div hidden={props.hidden}>
                <div style={labelStyle}>
                    <h1>Update Business Settings</h1>
                    <hr></hr>
                </div>
                <Grid container style={{/* textAlign: "left",*/ fontFamily: "monospace" }}>
                    <Grid container item xs={12} sm={6} lg={3}>
                        <Grid item xs={12}>
                            <div style={{ color: "grey", fontSize: "1rem", margin: "0.3rem 0 0.7rem" }}>Orders Accepting Hours</div>    
                            {/* <OneDay weekday="Sunday" /> */}
                            <DayHours weekday="Monday" />
                            <DayHours weekday="Tuesday" />
                            <DayHours weekday="Wednesday" />
                            <DayHours weekday="Thursday" />
                            <DayHours weekday="Friday" />
                            <DayHours weekday="Saturday" />
                            {/* {arrObj.map(createDateTime)} */}
                        </Grid>
                        <Grid item xs={12}>
                            <div style={{ color: "grey", fontSize: "1rem", margin: "0.3rem 0 0.7rem" }}>Delivery Hours</div>
                            <DayHours weekday="Sunday" />
                            <DayHours weekday="Monday" />
                            <DayHours weekday="Tuesday" />
                            <DayHours weekday="Wednesday" />
                            <DayHours weekday="Thursday" />
                            <DayHours weekday="Friday" />
                            <DayHours weekday="Saturday" />
                            {/* {arrObj.map(createDateTime)} */}
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} sm={6} lg={3}>
                        <Grid item xs={12}>
                            <h3>Business Name</h3>
                            <TextField 
                                size="small" margin="dense"
                                label="Business Name" 
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                variant="outlined" size="small" margin="dense" 
                                multiline rows={4} 
                                label="Description" 
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <h3>Delivery Strategy</h3>
                        </Grid>
                        <Grid item xs={12}>
                            <h3>Storage</h3>
                        </Grid>
                        <Grid item xs={12}>
                            <h3>Cancellation</h3>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} sm={6} lg={3}>
                        <Grid item xs={12}>
                            <TextField 
                                size="small" margin="dense" 
                                label="First Name" 
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                size="small" margin="dense" 
                                label="Last Name" 
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                size="small" margin="dense" 
                                label="Phone Number" 
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <h3>Street</h3>
                        </Grid>
                        <Grid item xs={6}>
                            <h3>Unit</h3>
                        </Grid>
                        <Grid item xs={4}>
                            <h3>City</h3>
                        </Grid>
                        <Grid item xs={4}>
                            <h3>State</h3>
                        </Grid>
                        <Grid item xs={4}>
                            <h3>ZIP Code</h3>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} sm={6} lg={3}>
                        <Grid item xs={12}>
                            <h3>Profile Picture</h3>
                        </Grid>
                        <Grid item xs={12}>
                            <h3>Email</h3>
                        </Grid>
                        <Grid item xs={12}>
                            <h3>New Password</h3>
                        </Grid>
                        <Grid item xs={12}>
                            <h3>Confirm New Password</h3>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }
    var AcceptTimeObj = [];
    var DeliveryTime =[];
    const dayInWeekArray=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var currentAcceptTime = context.timeChange;
    var currentDeliveryTime = context.deliveryTime;

    for(var i =0;i<dayInWeekArray.length;i++){
        for(const object in currentAcceptTime){
            if(object === dayInWeekArray[i]){
                // console.log(currentAcceptTime[object][0].slice(0,5));
                var startTime=currentAcceptTime[object][0].slice(0,5);
                var endTime=currentAcceptTime[object][1].slice(0,5);
                var newObj={};
                if(startTime === endTime){
                    newObj = {
                        dayInWeek: dayInWeekArray[i],
                        start: "",
                        end: ""
                    }
                }else{
                    newObj = {
                        dayInWeek: dayInWeekArray[i],
                        start: startTime,
                        end: endTime
                    }
                }
                AcceptTimeObj.push(newObj);
                // console.log(defaultValStart+" "+defaultValEnd);
            }
        }

        for(const object in currentDeliveryTime){
            if(object === dayInWeekArray[i]){
                // console.log(currentAcceptTime[object][0].slice(0,5));
                var startDelivery=currentDeliveryTime[object][0].slice(0,5);
                var endDelivery=currentDeliveryTime[object][1].slice(0,5);
                var newDeliveryObj={};
                if(startDelivery === endDelivery){
                    newDeliveryObj = {
                        dayInWeek: dayInWeekArray[i],
                        start: "",
                        end: ""
                    }
                }else{
                    newDeliveryObj = {
                        dayInWeek: dayInWeekArray[i],
                        start: startDelivery,
                        end: endDelivery
                    }
                }
                // console.log(newObj);
                DeliveryTime.push(newDeliveryObj);
                // console.log(defaultValStart+" "+defaultValEnd);
            }
        }
    }

    return (
        <div hidden={props.hidden} className="alignLeft">
            <div style={labelStyle}>
                <h1>Update Business Settings</h1>
                <hr></hr>
            </div>
            <Grid container style={{/* textAlign: "left",*/ fontFamily: "monospace" }}>
                <Grid container item xs={12} sm={6} lg={3} style={{ textAlign: "center" }}>
                    <Grid item xs={12}>
                        <div style={{ color: "grey", fontSize: "1rem", margin: "0.3rem 0 0.7rem" }}>Orders Accepting Hours</div>    
                        {/* <OneDay weekday="Sunday" />
                        <DayHours weekday="Monday" />
                        <DayHours weekday="Tuesday" />
                        <DayHours weekday="Wednesday" />
                        <DayHours weekday="Thursday" />
                        <DayHours weekday="Friday" />
                        <DayHours weekday="Saturday" /> */}
                        {AcceptTimeObj.map(createDateTimeAccept)}
                    </Grid>
                    <Grid item xs={12}>
                        <div style={{ color: "grey", fontSize: "1rem", margin: "0.3rem 0 0.7rem" }}>Delivery Hours</div>
                        {/* <DayHours weekday="Sunday" />
                        <DayHours weekday="Monday" />
                        <DayHours weekday="Tuesday" />
                        <DayHours weekday="Wednesday" />
                        <DayHours weekday="Thursday" />
                        <DayHours weekday="Friday" />
                        <DayHours weekday="Saturday" /> */}
                        {DeliveryTime.map(createDateTimeDelivery)}
                    </Grid>
                </Grid>
                <Grid container item xs={12} sm={6} lg={3} spacing={2}>
                    <h3>Business Detail</h3>
                    <Grid item xs={12} >  
                    {/* <hr></hr> */}
                        <div>Business Name</div>
                        <TextField 
                            size="small" margin="dense"
                            label={businessAndFarmDetail.business_name} 
                            variant="outlined"
                            style={{ height: "60px" }}
                            name="business_name"
                            onChange={handleChange}
                        />
                        
                    </Grid>
                    <Grid item xs={12} sm={12} sl={12}>
                        <div>Description</div>
                        <TextField 
                            variant="outlined" size="small" margin="dense" 
                            multiline rows={4} 
                            name="description"
                            // label={businessAndFarmDetail.description} 
                            // style={{ font-size: "" }}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <div>Businesss Rep First Name</div>
                        <TextField 
                            size="small" margin="dense" 
                            label={businessAndFarmDetail.firstName} 
                            variant="outlined"
                            name="firstName"
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <div>Businesss Rep Last Name</div>
                        <TextField 
                            size="small" margin="dense" 
                            label={businessAndFarmDetail.lastName}
                            variant="outlined"
                            name="lastName"
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <div>Businesss Rep Phone Number</div>
                        <TextField 
                            size="small" margin="dense" 
                            label={businessAndFarmDetail.phone}
                            variant="outlined"
                            name="phone"
                            onChange={handleChange}
                        />
                    </Grid>

                    <h3>Farm Detail</h3>
                    <Grid item xs={12}>
                        <div>Street</div>
                        <TextField 
                            size="small" margin="dense" 
                            label={businessAndFarmDetail.street}
                            variant="outlined"
                            name="street"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <div>Farm City</div>
                        <TextField 
                            size="small" margin="dense" 
                            label={businessAndFarmDetail.city}
                            variant="outlined"
                            name="city"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6} sl={4}>
                        <div>State</div>
                        <TextField 
                            size="small" margin="dense" 
                            label={businessAndFarmDetail.state}
                            variant="outlined"
                            name="state"
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={6} sl={4 }>
                        <div>Zip</div>
                        <TextField 
                            size="small" margin="dense" 
                            label={businessAndFarmDetail.zip}
                            variant="outlined"
                            name="zip"
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                <Grid container item xs={12} sm={6} lg={3} spacing={4}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Delivery Strategy</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox checked={deliverStrategy.pickupStatus} onChange={handleChangeDelivery} name="pickupStatus" />}
                                label="Pickup at Farmer's Market"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={deliverStrategy.deliverStatus} onChange={handleChangeDelivery} name="deliverStatus" />}
                                label="Deliver to Customer"
                            />
                        </FormGroup>

                        <FormLabel component="legend">Storage</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox checked={storage.reusable} onChange={handleChangeStorage} name="reusable" />}
                                label="Reusable"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={storage.disposable} onChange={handleChangeStorage} name="disposable" />}
                                label="Disposable"
                            />
                        </FormGroup>

                        <FormLabel component="legend">Cancellation</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox checked={cancellation.allowCancel} onChange={handleChangeCancel} name="allowCancel" />}
                                label="Allow cancellation within ordering hours"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={cancellation.noAllowCancel} onChange={handleChangeCancel} name="noAllowCancel" />}
                                label="Cancellations not allowed"
                            />
                        </FormGroup>
                    </FormControl>
                </Grid>
                <Grid container item xs={12} sm={6} lg={3}>
                    <Grid item xs={12}>
                        <h3>Profile Picture</h3>
                    </Grid>
                    <div>
                        <div>Email Address</div>
                            <TextField 
                                size="small" margin="dense" 
                                label={businessAndFarmDetail.email}
                                variant="outlined"
                                name="email"
                                onChange={handleChange}
                            />
                        <div>New Password</div>
                        <TextField 
                            error={errorStatus}
                            size="small" margin="dense" 
                            label={errorStatus?"Not matching":""}
                            variant="outlined"
                            name="password"
                            onChange={handleChange}
                        />

                        <div>Confirm Password</div>
                        <TextField 
                            error={errorStatus}
                            size="small" margin="dense" 
                            label={errorStatus?"Not matching":""}
                            variant="outlined"
                            name="passwordConfirm"
                            onChange={handleChange}
                        />
                        
                    </div>
                    <Grid item xs={12}>
                        <button>Update</button>
                    </Grid>
                    {/* <button>Update</button> */}
                    {/* <Grid item xs={12}>
                        <div>Email Address</div>
                        <TextField 
                            size="small" margin="dense" 
                            label={businessAndFarmDetail.email}
                            variant="outlined"
                            name="email"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <div>New Password</div>
                        <TextField 
                            error={errorStatus}
                            size="small" margin="dense" 
                            label={errorStatus?"Not matching":""}
                            variant="outlined"
                            name="password"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <div>Confirm Password</div>
                        <TextField 
                            error={errorStatus}
                            size="small" margin="dense" 
                            label={errorStatus?"Not matching":""}
                            variant="outlined"
                            name="passwordConfirm"
                            onChange={handleChange}
                        />
                    </Grid> */}
                    {/* <Grid item xs={12}>
                        <h3>Email</h3>
                    </Grid>
                    <Grid item xs={12}>
                        <h3>New Password</h3>
                    </Grid>
                    <Grid item xs={12}>
                        <h3>Confirm New Password</h3>
                    </Grid> */}
                </Grid>
            </Grid>
        </div>
    )
}


function DayHours(props) {
    return (
        <div style={{ marginBottom: "0.25rem" }}>
            <b style={{ marginRight: "0.5rem"}}>{props.weekday}</b>
            <TextField 
                size="small" type="time"
                defaultValue="00:00"
                style={{ width: "100px" }}
                InputProps={{ style: { height: "20px", fontSize: "0.7rem" } }}
            />
            <b style={{ margin: "0.75rem" }}>—</b>
            <TextField 
                size="small" type="time"
                defaultValue="12:00"
                style={{ width: "100px" }}
                InputProps={{ style: { height: "20px", fontSize: "0.7rem" } }}
            />
        </div>
    )
};


// styling
const labelStyle = {
    backgroundColor: 'white',
    width: '80%',
    textAlign: 'left',
    marginLeft: '25px',
    marginBottom: '20px',
}
