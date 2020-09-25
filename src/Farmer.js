import React, { Component, useContext, useState, useEffect } from 'react'
import {AdminFarmContext} from './AdminFarmContext.js'
import axios from 'axios';
import {Grid, Paper, Button, Typography, Card, CardMedia, CardContent, Modal, TextField, CircularProgress} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FarmerHome from './FarmerHome.js'
import FarmerNavBar from './FarmerNavBar.js'

export default function Farmer() {

    return (
        <div>
            <Paper style={paperStyle} elevation={3}>
                <FarmerNavBar/>
                <FarmerHome/>
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