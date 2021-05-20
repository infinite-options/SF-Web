import Modal from "react-bootstrap/Modal";
// import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useContext } from 'react';
import classes from './Ambasadormodal.module.css';
import {Button} from 'react-bootstrap'
import Card from "react-bootstrap/Card";
import cross from '../icon/cross.svg';
import Signup from '../auth/Signup';
import { Paper } from "@material-ui/core";
import AdminLogin from '../auth/AdminLogin';
import Draggable from 'react-draggable';


const LoginAmbasador=(props)=>{
    let [modalSignup,modalSignupMessage]=useState('');
    let [modalLogin,modalLoginMessage]=useState('');
const modalSign= () => {
    modalSignupMessage("true");
    console.log(modalSignupMessage,modalSignup);
    // props.modalClear();
    
}
const modalLgn= () => {
    modalLoginMessage("true");
    console.log(modalSignupMessage,modalSignup);
    // props.modalClear();
    
}

    return(
        
        <>
        <Draggable>
         <Card className={classes.modal} style={{border:'1px solid #E1E7E7', borderRadius: '10px' ,marginBottom:'20px',height:'580px',width:'400px'}}>
        <div>
          <img
            src={cross}
            onClick={props.close}
            style={{
              float: 'right',
              height: '30px',
              width: '30px',
              color: 'black',
              marginTop: '10px',
              marginRight: '10px',
            }}
          ></img>
        </div>
        <div>
          <h2 style={{ fontWeight: 'bold',marginRight:'auto',marginLeft:'auto',marginBottom:'0px',marginTop:'70px' ,fontSize:'22px'}}>Love Serving Fresh?</h2>
        </div>
        <div>
          <h2 style={{ fontWeight: 'bold',marginRight:'auto',marginLeft:'auto',marginBottom:'25px' ,fontSize:'24px',color:'#136D74',textDecoration:'underline'}}>Become an Ambassador</h2>
        </div>
        <div style={{ width: '300px',marginRight:'auto',marginLeft:'auto' ,marginBottom:'20px',fontSize:'20px'}}>
       <p style={{marginBottom:'35px'}}>Give 20, Get 20</p>
       <p>Refer a friend and both you and your friend get $10 off on your next two orders.</p>  
        </div>
        
        
        <div>
        <button
            onClick={modalLgn}
            style={{
              width: '300px',
              marginTop:'20px',
            //   marginBottom: '20px',
              height: '60px',
              borderRadius: '15px',
              backgroundColor: '#FF8500',
              color: 'white',
              border:' 1px solid #E1E7E7',
              fontSize:'20px',
              fontWeight:'bolder'
            }}
          >
            Login
          </button>
          <p style={{fontSize:'20px',fontWeight:'bold'}}>OR</p>
          <button
            onClick={modalSign}
            style={{
              width: '300px',
              marginTop:'0px',
            //   marginBottom: '20px',
              height: '60px',
              borderRadius: '15px',
              backgroundColor: '#FF8500',
              color: 'white',
              border:' 1px solid #E1E7E7',
              fontSize:'20px',
              fontWeight:'bolder',
              
            }}
          >
            Sign Up
          </button>
        </div>
      </Card>
      </Draggable>
      
          
        {modalSignup && <Signup/>}
       {modalLogin&& <AdminLogin/>}
       
       
       
      
       
       
       </>
    )
}

export default LoginAmbasador;