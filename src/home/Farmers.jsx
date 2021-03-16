import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { makeStyles } from '@material-ui/core/styles';

import Slider from 'react-slick';

var settings = {
  dots: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,

  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const useStyles = makeStyles((theme) => ({
  Farmers: {
    width: '800px',
    margin: '30px',
  },
  imgcard: {
    //border: '1px solid #136D74',
    borderRadius: '14px',
    backgroundColor: '#F1F4F4',
    overflow: ' hidden',
    transition: '0.3s',
    padding: '60px',
  },

  farmerimg: {
    width: '400px',
    height: '400px',
    border: '1px solid #136D74',
    borderRadius: '10px',
    marginLeft: '50px',
  },

  cardbody: {
    padding: '15px',
    //backgroundColor: '#ffffff',
    marginRight: '130px',
    marginLeft: '50px',
    //border: '1px solid #136D74',
    // borderRadius: '10px',
    marginLeft: '50px',
  },
  cardname: {
    fontSize: '30px',
    fontWeight: '600',
  },
  cardcity: {
    marginTop: '15px',
    fontSize: '20px',
    //textAlign: 'left',
    //marginLeft: '130px',
  },
  cardcontact: {
    fontSize: '20px',
    //textAlign: 'left',
    //marginLeft: '130px',
  },
}));
export default function Farmers() {
  const classes = useStyles();
  const farm = () =>
    [
      {
        farmerimg: './farmer1.jpg',
        name: 'ABC Farm',
        city: 'ABC',
        contact: '123',
      },
      {
        farmerimg: './farmer2.jpg',
        name: 'DEF Farm',
        city: 'DEF',
        contact: '456',
      },
      {
        farmerimg: './farmer3.jpg',
        name: 'GHI Farm',
        city: 'GHI',
        contact: '789',
      },
      {
        farmerimg: './farmer4.jpg',
        name: 'IJK Farm',
        city: 'IJK',
        contact: '987',
      },
      {
        farmerimg: './farmer5.jpg',
        name: 'LMN Farms',
        city: 'LMN',
        contact: '654',
      },
      {
        farmerimg: './farmer6.jpg',
        name: 'OPQ Farms',
        city: 'OPQ',
        contact: '321',
      },
      {
        farmerimg: './farmer7.jpg',
        name: 'RST Farms',
        city: 'RST',
        contact: '147',
      },
      {
        farmerimg: './farmer8.jpg',
        name: 'UVW Farms',
        city: 'UVW',
        contact: '258',
      },
    ].map((x, i) => (
      <div key="{i}" className={classes.imgcard}>
        <img className={classes.farmerimg} src={x.farmerimg} />
        <div className={classes.cardbody}>
          <div className={classes.cardname}>{x.name}</div>
          <div className={classes.cardcity}>City:{x.city}</div>
          <div className={classes.cardcontact}>Contact:{x.contact}</div>
        </div>
      </div>
    ));

  return (
    <div className="classes.Farmers">
      <Slider {...settings}>{farm()}</Slider>
    </div>
  );
}
