import React, { Component, useContext, useState, useEffect } from 'react'
import {AdminFarmContext} from './AdminFarmContext.js'
import axios from 'axios';
import {Grid, Paper, Button, Typography, Card, CardMedia, CardContent, Modal, TextField, CircularProgress} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FarmerHome from './FarmerHome.js';
import FarmerReport from './FarmerReport.js';
import FarmerSettings from './FarmerSettings.js';
import FarmerNavBar from './FarmerNavBar.js';

export default function Farmer() {
    const {farmID, setFarmID} = useContext(AdminFarmContext);
    const farmName = (() => {
        switch (farmID) {
            case '200-000003': return 'Esquivel Farm';
            case '200-000004': return 'Resendiz Family';
            default: return null;
        }
    })();
    /* 
     * tab values:
     *   0 -> home
     *   1 -> reports
     *   2 -> settings
     */
    const [tab, setTab] = useState(Number(localStorage.getItem("farmerTab")) || 0);

    useEffect(() => {
        localStorage.setItem("farmerTab", tab);
    }, [tab]);

    const handleTab = () => {
        // switch (tab) {
        //     case 0: return <FarmerHome />;
        //     case 1: return <FarmerReport />;
        //     case 2: return <FarmerSettings />;
        //     default: return <FarmerHome />;
        // }
        return (
            <React.Fragment>
                {/* if farmerTab is tampered with & is out of scope, defaults to FarmerHome */}
                <FarmerHome farmID={farmID} farmName={farmName} hidden={tab === 1 || tab === 2}/>
                <FarmerReport farmID={farmID} farmName={farmName} hidden={tab !== 1}/>
                <FarmerSettings farmID={farmID} farmName={farmName} hidden={tab !== 2}/>
            </React.Fragment>
        )
    };

    return (
        <div>
            <Paper style={paperStyle} elevation={3}>
                <FarmerNavBar changeTab={setTab}/>
                {handleTab()}
            </Paper>
            
        </div>
        
    )
}
const paperStyle = {
    height: '2000px',
    width: '95%',
    maxWidth: '2000px',
    textAlign: 'center',
    display: 'inline-block',
    padding: '0px',
    marginTop: '30px',
    backgroundColor: 'white',
};