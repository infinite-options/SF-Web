import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useContext } from 'react';
import classes from './ErrorModal.module.css';
import {Button} from 'react-bootstrap'
import Card from "react-bootstrap/Card";
import cross from '../icon/cross.svg';

const Mymodal=(props)=>{
    return(
       <Card className={classes.modal} style={{borderRadius:'10px'}}>
           <div >
            <img src={cross} onClick={props.onConfirm} style={{float:'right',height:'25px',width:'25px',color:'black',marginTop:'3px',marginRight:'3px'}}></img>
           </div>
           <div>
            <h2 style={{fontWeight:'bold'}}>{props.title}</h2>
           </div>
           <div style={{width:'300px'}}>
           Sorry, it looks like we don’t deliver to your neighborhood yet. Enter your email address and we will let you know as soon as we come to your neighborhood.
           </div>
           <div >
               <input  placeholder="Enter your email"style={{width:'280px',marginBottom:'20px',marginTop:'20px',borderRadius:'5px',borderColor:'#E1E7E7'}}></input>
           </div>
           <div>
               <button onClick={props.onConfirm} style={{width:'250px',marginBottom:'20px',height:'30px',borderRadius:'5px',backgroundColor:'#FF8500',color:'white',borderColor:'#E1E7E7'}}>Submit</button>
           </div>
       </Card>
    )
}

export default Mymodal;