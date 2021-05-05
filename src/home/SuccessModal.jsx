import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useContext } from 'react';
import classes from './ErrorModal.module.css';
import {Button} from 'react-bootstrap'
import Card from "react-bootstrap/Card";
import cross from '../icon/cross.svg';

const SuccessModal=(props)=>{
    return(
       <Card className={classes.modal} style={{borderRadius:'10px'}}>
           <div >
            <img src={cross} onClick={props.onConfirm} style={{float:'right',height:'25px',width:'25px',color:'black',marginTop:'3px',marginRight:'3px'}}></img>
           </div>
           <div>
            <h2 style={{fontWeight:'bold'}}>{props.title}</h2>
           </div>
           <div style={{width:'300px'}}>
           Looks like we deliver to your address. Click the button below to see the variety of fresh organic fruits and vegetables we offer.
           </div>
           <div >
           <button onClick={props.onConfirm} style={{width:'250px',marginTop:'20px',marginBottom:'20px',height:'30px',borderRadius:'5px',backgroundColor:'#FF8500',color:'white',borderColor:'#E1E7E7'}}>Explore Local Produce</button>
           </div>
           <div>
               <button onClick={props.onConfirm} style={{width:'250px',marginBottom:'20px',height:'30px',borderRadius:'5px',backgroundColor:'#FF8500',color:'white',borderColor:'#E1E7E7'}}>Sign Up</button>
           </div>
       </Card>
    )
}

export default SuccessModal;