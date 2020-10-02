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
        switch (tab) {
            case 0: return <FarmerHome />;
            case 1: return <FarmerReport />;
            case 2: return <FarmerSettings />;
            default: return <FarmerHome />;
        }
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