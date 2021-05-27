import React, { useState, useEffect } from 'react';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
import { makeStyles } from '@material-ui/core/styles';
import {Button} from 'react-bootstrap'
import Card from "react-bootstrap/Card";
import fb from '../icon/facebook.svg';
import insta from '../icon/instagram.svg';
import globe from '../icon/globe.svg';


import Slider from 'react-slick';
import Carousel from 'react-multi-carousel';
import axios from 'axios';
import { get } from 'js-cookie';

var responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};
// var settings = {
//   dots: true,
//   slidesToShow: 3,
//   slidesToScroll: 1,
//   autoplay: true,
//   autoplaySpeed: 3000,

//   responsive: [
//     {
//       breakpoint: 1024,
//       settings: {
//         slidesToShow: 3,
//       },
//     },
//     {
//       breakpoint: 600,
//       settings: {
//         slidesToShow: 2,
//       },
//     },
//     {
//       breakpoint: 480,
//       settings: {
//         slidesToShow: 1,
//       },
//     },
//   ],
// };

// const useStyles = makeStyles((theme) => ({
//   Farmers: {
//     // width: '800px',
//     // margin: '30px',
//     // border:'1px solid black'
//   },
//   imgcard: {
//     //border: '1px solid #136D74',
//     borderRadius: '14px',
//     backgroundColor: '#F1F4F4',
//     overflow: ' hidden',
//     transition: '0.3s',
//     padding: '60px',
//     border:'1px solid black'
//   },

//   farmerimg: {
//     width: '400px',
//     height: '400px',
//     border: '2px solid #136D74',
//     // borderRadius: '10px',
//     // marginLeft: '130px',
//     // marginRight: '130px',
//   },

//   cardbody: {
//     padding: '15px',
//     //backgroundColor: '#ffffff',
//     marginRight: '130px',
//     marginLeft: '130px',
//     //border: '1px solid #136D74',
//     // borderRadius: '10px',
//     marginLeft: '130px',
//     border:'1px solid black'
//   },
//   cardname: {
//     fontSize: '30px',
//     fontWeight: '600',
//     textAlign:'left',
//     border:'1px solid black'
//   },
//   cardcity: {
//     marginTop: '15px',
//     fontSize: '20px',
//     // width:'',
//     textAlign:'left',
//     color:'#236c73',
//     border:'1px solid black'
//     //textAlign: 'left',
//     //marginLeft: '130px',
//   },
//   cardcontact: {
//     fontSize: '20px',
//     textAlign:'right'
//     //textAlign: 'left',
//     //marginLeft: '130px',
//   },
// }));
export default function Farmers() {
  

  useEffect(() => {
    farmerObj();
    }, []);
  let [farmerInfo,setfarmerInfo]=useState([]);

  const farmerObj= async ()=> {await axios
  .get ("https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/businesses")
  .then((response)=>{console.log(response);
    setfarmerInfo(response.data.result.result);
  })}
  
  
  
  // const farm = () =>
  //   [
  //     {
  //       farmerimg: './farmer1.jpg',
  //       name: 'ABC Farm',
  //       city: 'ABC',
  //       contact: '123',
  //     },
  //     {
  //       farmerimg: './farmer2.jpg',
  //       name: 'DEF Farm',
  //       city: 'DEF',
  //       contact: '456',
  //     },
  //     {
  //       farmerimg: './farmer3.jpg',
  //       name: 'GHI Farm',
  //       city: 'GHI',
  //       contact: '789',
  //     },
  //     {
  //       farmerimg: './farmer4.jpg',
  //       name: 'IJK Farm',
  //       city: 'IJK',
  //       contact: '987',
  //     },
  //     {
  //       farmerimg: './farmer5.jpg',
  //       name: 'LMN Farms',
  //       city: 'LMN',
  //       contact: '654',
  //     },
  //     {
  //       farmerimg: './farmer6.jpg',
  //       name: 'OPQ Farms',
  //       city: 'OPQ',
  //       contact: '321',
  //     },
  //     {
  //       farmerimg: './farmer7.jpg',
  //       name: 'RST Farms',
  //       city: 'RST',
  //       contact: '147',
  //     },
  //     {
  //       farmerimg: './farmer8.jpg',
  //       name: 'UVW Farms',
  //       city: 'UVW',
  //       contact: '258',
  //     },
  //   ]
    
    const farm=()=>farmerInfo.map((x, i) => (
      // <div key="{i}" style={{  width: '20rem',margin:'10px', padding:'12px',border:'1px solid black'}}>
      //   <div style={{width:'15rem',height:'15rem'}}>
      //     <img  src={x.farmerimg} style={{width:'15rem',height:'15rem',border:'2px solid rgb(242,151,56)',aspectRatio:'1/1',float:'left'}}/>
      //   </div>
      //   <div style={{color:'rgb(242,151,56)',fontWeight:'bold',fontSize:'25px',float:'left',width:'100%',border:'1px solid black'}}>
      // <div style={{color:'rgb(242,151,56)',fontWeight:'bold',fontSize:'25px',float:'left'}}>{x.city}</div>
      // </div>
      // <div>
      // <div style={{float:'left',color:'rgb(35,109,115)',fontWeight:'bold',fontSize:'20px',width:'50%'}}>City:{x.city}</div>
      // <div style={{float:'left',color:'rgb(35,109,115)',width:'50%'}}>
      //     {/* <div style={{float:'right',padding:'2px',width:'20px',maxHeight:'10px'}}><img src={fb}></img></div>
      //     <div style={{float:'right',padding:'2px'}}><img src={insta}></img></div> */}
      //     </div>
      // </div>
      <div key={i} style={{marginLeft:'35px',width:'20rem'}}>
         <div>
          <img  src={x.business_image} style={{width:'17rem',height:'15rem',border:'2px solid rgb(242,151,56)',aspectRatio:'1/1',float:'left'}}/>
        </div>
      
        
        <div style={{color:'rgb(242,151,56)',fontWeight:'bold',fontSize:'22px',float:'left',width:'100%'}}>
          <p style={{float:'left'}}>{x.business_name}</p>
          </div>
          <div>
          <div style={{float:'left',color:'rgb(35,109,115)',fontWeight:'bold',fontSize:'16px'}}>City:{x.business_city}</div>
          <div style={{marginRight:'30%',float:'right',padding:'2px',width:'20px',maxHeight:'10px'}}>
            <a href={`mailto:${x.business_email}`}><img alt="email" src={globe} style={{height:'20px',width:'20px'}}>

            </img>
            </a>
            </div>
        <div style={{float:'right',padding:'2px'}}>
          <img src={insta} style={{height:'20px',width:'20px'}}></img>
          </div>
        <div style={{float:'right',padding:'2px'}}>
          <img src={fb} style={{height:'20px',width:'20px'}}></img>
          </div>
          </div> 

          
      </div>
      
    ));
    console.log(farmerInfo);

  return (
    
    <Carousel responsive={responsive}>
      {farm()}
      </Carousel>


);
}
