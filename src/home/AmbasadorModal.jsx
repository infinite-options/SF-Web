
// import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from 'react';
import classes from './ErrorModal.module.css';
// import {Button} from 'react-bootstrap'
import Card from "react-bootstrap/Card";
import cross from '../icon/cross.svg';
import BusiApiReqs from '../utils/BusiApiReqs';
import Draggable from 'react-draggable';
import AuthUtils from '../utils/AuthUtils';

const AmbasadorModal =(props)=>{
  let [customerName,setCustomerName]=useState('');
    const BusiMethods = new BusiApiReqs();
    const AuthMethods = new AuthUtils();
    AuthMethods.getProfile().then(response=>{
      console.log((response.customer_first_name));
      setCustomerName(response.customer_first_name);
    });
    
   let createAmbassador=async ()=>{
        let ambassadorEmail=document.getElementById("ambassadorEmail").value;
        await BusiMethods.create_ambassador(ambassadorEmail);
       
        
    }


    







//     await BusiMethods.create_ambassador(ambassadorEmail)
    //     .then((response)=>
    //    {
    //        if(response.data=="SF Ambassdaor created"||response.data=="Customer already an Ambassador")
    //    {
    //        document.getElementById("sucess").value="Congrats you are an ambassador"
    //    }
    // });
    //    console.log( BusiMethods.create_ambassador(ambassadorEmail));



    return(
      <Draggable>
        <Card className={classes.modal} style={{border:'1px solid #E1E7E7', borderRadius: '10px' ,marginBottom:'20px',height:'621px',width:'400px'}}>
        <div>
        <img
            alt="close"
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
            <p style={{float:'left',color:'#136D74',marginLeft:'50px'}}>Ambassador Name:</p>
            <p style={{float:'left',marginLeft:'50px'}}>{customerName}</p>
        </div>
        <div>
          <input
            placeholder="Enter your email"
            id="ambassadorEmail"
            style={{
              width: '300px',
              height:'30px',
              marginBottom: '15px',
              marginTop: '0px',
              borderRadius: '15px',
              border: '2px solid #136D74',
            }}
          ></input>
          <div id="sucess" style={{fontSize:'20px',color:"red"}}></div>
        </div>
        <div>
        <div style={{marginLeft:'20%',marginRight:'10%'}}>
            <p style={{float:'left',color:'#136D74'}}>Your friends can use this email<br/> address as the Ambassador code <br/>when they sign up</p>
            
        </div>
          <button
            onClick={createAmbassador}
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
            Register as an Ambassador
          </button>
        </div>
      </Card>
      </Draggable>
    )
}

export default AmbasadorModal;