import React from 'react';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

//import './styles.css';

import Slider from 'react-slick';

export default function Testimonial() {
  const test = () =>
    [
      {
        text:
          'Tortor consequat id porta nibh venenatis cras sed felis. Massa sapien faucibus et molestie ac feugiat. Ac felis donec et odipellentesque diam volutpat commodo. Orci dapibus ultrices iniaculis.',
        customer: 'Taylor Swift',
      },
      {
        text:
          'Lorem Ipsum adipiscing elit ipsum. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        customer: 'Dua Lipa',
      },
      {
        text:
          'Orci porta non pulvinar neque laoreet.  incididunt ut labore et dolore magna aliqua. Utenim ad minim veniam, quis nostrud exercitation ullamco laboriscommodo consequat.',
        customer: 'Billie Eilish',
      },
      {
        text:
          'Bibendum neque egestas congue quisque.  incididunt ut labore et dolore magna aliqua. Utenim ad minim veniam, quis nostrud exercitation ullamco laboris commodo consequat.',
        customer: 'Lizzo',
      },
      {
        text:
          'Mattis rhoncus urna neque viverra justo.  incididunt ut labore et dolore magna aliqua. Utenim ad minim veniam, quis nostrud exercitation ullamco laboris commodo consequat.',
        customer: 'Harry Styles',
      },
    ].map((x, num) => (
      <div>
        <h3>{x.text}</h3>
        <h3> - {x.customer}</h3>
      </div>
    ));

  return (
    <div className="Testimonial">
      <Slider
        dots={true}
        slidesToShow={1}
        slidesToScroll={1}
        autoplay={true}
        autoplaySpeed={8000}
      >
        {test()}
      </Slider>
    </div>
  );
}
