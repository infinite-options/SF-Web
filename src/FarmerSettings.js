import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
// import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import axios from 'axios';

const BUSINESS_DETAILS_URL = "https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/business_details_update/";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     '& .MuiTextField-root': {
//     //   margin: theme.spacing(1),
//     //   width: '25ch',
//     },
//   },
// }));

export default function FarmerSettings({ farmID, farmName, ...props }) {
    const [settings, setSettings] = useState({});

    useEffect(() => {
        getFarmSettings();
    }, [farmID])
    
    const getFarmSettings = () => {
        axios.post(BUSINESS_DETAILS_URL + "Get", { business_uid: "200-000004" })
        .then(response => {
            console.log("Settings:", response.data.result[0]);
            setSettings(response.data.result[0]);
        })
        .catch(err => {
            console.log(err.response || err);
        });
    };

    // const classes = useStyles();
    return (
        <div hidden={props.hidden}>
            <div style={labelStyle}>
                <h1>Update Business Settings</h1>
            </div>
            <Grid container style={{/* textAlign: "left",*/ fontFamily: "monospace" }}>
                <Grid container item xs={12} sm={6} lg={3}>
                    <Grid item xs={12}>
                        <div style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>Orders Accepting Hours</div>
                        <DayHours weekday="Sun" />
                        <DayHours weekday="Mon" />
                        <DayHours weekday="Tue" />
                        <DayHours weekday="Wed" />
                        <DayHours weekday="Thu" />
                        <DayHours weekday="Fri" />
                        <DayHours weekday="Sat" />
                    </Grid>
                    <Grid item xs={12}>
                        <div style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>Delivery Hours</div>
                        <DayHours weekday="Sun" />
                        <DayHours weekday="Mon" />
                        <DayHours weekday="Tue" />
                        <DayHours weekday="Wed" />
                        <DayHours weekday="Thu" />
                        <DayHours weekday="Fri" />
                        <DayHours weekday="Sat" />
                    </Grid>
                </Grid>
                <Grid container item xs={12} sm={6} lg={3}>
                    <Grid item xs={12}>
                        <TextField 
                            size="small" 
                            label="Business Name" 
                        />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField 
                        size="small" 
                        multiline rows={4} 
                        label="Description" 
                        // added 5px of horizontal padding since multiline textfields shrink for whatever reason
                        InputProps={{ style: { paddingLeft: "5px", paddingRight: "5px" } }}
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
                            size="small" 
                            label="First Name" 
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            size="small" 
                            label="Last Name" 
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            size="small" 
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

function DayHours({ weekday, ...props }) {
    return (
        <div style={{ marginBottom: "0.25rem" }}>
            <span style={{ marginRight: "0.5rem" }}>{weekday}</span>
            <TextField 
                size="small"  type="time"
                style={{ width: "100px" }}
                InputProps={{ style: { height: "20px", fontSize: "0.7rem" } }}
            />
            <span style={{ margin: "0.5rem" }}>-</span>
            <TextField 
                size="small"  type="time"
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
