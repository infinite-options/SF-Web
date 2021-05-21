import Modal from "react-bootstrap/Modal";
// import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useContext } from 'react';
import classes from './ErrorModal.module.css';
import {Button} from 'react-bootstrap'
import Card from "react-bootstrap/Card";
import cross from '../icon/cross.svg';
import Draggable from "react-draggable";

const Mymodal=(props)=>{
    return (
      <Draggable>
      <Card className={classes.modal} style={{ borderRadius: '10px' ,marginBottom:'20px',height:'601px',width:'400px'}}>
        <div>
          <img
            src={cross}
            onClick={props.onConfirm}
            style={{
              float: 'right',
              height: '25px',
              width: '25px',
              color: 'black',
              marginTop: '3px',
              marginRight: '3px',
            }}
          ></img>
        </div>
        <div>
          <h2 style={{ fontWeight: 'bold',marginRight:'auto',marginLeft:'auto',marginBottom:'75px',marginTop:'100px' ,fontSize:'40px'}}>{props.title}</h2>
        </div>
        <div style={{ width: '300px',marginRight:'auto',marginLeft:'auto' ,marginBottom:'50px',fontSize:'20px'}}>
          Sorry, it looks like we don’t deliver to your neighborhood yet. Enter
          your email address and we will let you know as soon as we come to your
          neighborhood.
        </div>
        <div>
          <input
            placeholder="Enter your email"
            style={{
              width: '300px',
              height:'50px',
              marginBottom: '50px',
              marginTop: '20px',
              borderRadius: '15px',
              border: '1px solid #E1E7E7',
            }}
          ></input>
        </div>
        <div>
          <button
            onClick={props.onConfirm}
            style={{
              width: '300px',
            //   marginBottom: '20px',
              height: '60px',
              borderRadius: '15px',
              backgroundColor: '#FF8500',
              color: 'white',
              border:' 1px solid #E1E7E7',
              fontSize:'25px'
            }}
          >
            Submit
          </button>
        </div>
      </Card>
      </Draggable>
    );
}

export default Mymodal;