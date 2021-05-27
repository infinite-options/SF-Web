import React from 'react';

// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

//import './styles.css';

import Slider from 'react-slick';
import Card from "react-bootstrap/Card";
import Carousel from 'react-multi-carousel';



var responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 3
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
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
export default function Testimonial() {
  const test = () =>
    [
      {
        text:
          'I feel good about supporting my local farmers. The produce is freshly picked, and delivered by the farmer to my doorstep!! The prices are very competitive to the neighborhood grocery stores. Ordering on this app is quick and super easy too.',
        customer: 'L. R. from San Jose, CA',
      },
      {
        text:
          'I love love love using Serving Now Quick, convenient and the produce always shows up fresh and ready to use.',
        customer: 'R. W. from San Jose, CA',
      },
      // {
      //   text:
      //     'Very convenient to order! Love it!',
      //   customer: 'L. M. from San Jose, CA',
      // },
      {
        text:
          'Great vegetables variety and awesome fruits! Deliveries to my home have made it easy for my family.',
        customer: 'N. F. from Cupertino, CA',
      },
      {
        text:
          'Hi! Serving Now is an awesome app, delivering High-quality Organic fruits and vegetables at the doorstep. The quality of the produce is great. ',
        customer: 'A. S. from Sunnyvale, CA',
      },
      {
        text:
          'Used this last week and it’s been great to have such fresh veggies!!',
        customer: 'D. M. from San Jose, CA',
      },
    ].map((x, num) => (
      
      <div key="{num}" style={{ float:'left' , width: '80%', margin:'10px', padding:'12px'}} >
      
      
      <div style={{border:'0px solid black'}}>
        
      <div style={{color:'black',fontWeight:'bold',fontSize:'25px',float:'left',marginBottom:'20px'}}>{x.text}</div>
      <div>
      <div style={{textAlign:'center',color:'rgb(35,109,115)',fontWeight:'bold',fontSize:'20px'}}>-{x.customer}</div>
      
      </div>

          </div>
      </div>
            // <div style={{width:'30%',float:'left',margin:'100px',left:'140px',height:'169px'}}>
            // <div>{x.text}</div>
            // <div>{x.customer}</div>
            // </div>
          
      
    ));

  return (
    
      // <div style={{width:'100%',marginRight:'auto',marginLeft:'auto',border:'1px solid black'}}
      //   // dots={true}
      //   // slidesToShow={1}
      //   // slidesToScroll={1}
      //   // autoplay={false}
      //   // autoplaySpeed={8000}
      // >
        <Carousel responsive={responsive}>{test()}</Carousel>
       
        
      // </div>
    
  );
}
