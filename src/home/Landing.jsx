import React, { useContext, useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { Visible, Hidden } from 'react-grid-system';

import { useHistory } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import appColors from '../styles/AppColors';
import LandingNavBar from './LandingNavBar';
import AdminLogin from '../auth/AdminLogin';
import Signup from '../auth/Signup';
import ProductDisplay from './ProductDisplay';
import DeliveryLocationSearch from './DeliveryLocationSearch';
import Farmers from './Farmers';
import Testimonial from './Testimonial';
import Order from './Order';
import Footer from './Footer';
import { LeftEmptyCell } from '@material-ui/data-grid';

const useStyles = makeStyles((theme) => ({
  authModal: {
    position: 'absolute',
    width: '500px',
  },
  infoSection: {
    width: '33.33%',
    justifyContent: 'center',
    fontSize: '20px',
  },
  infoImg: {
    //: 'flex-end',
    alignItems: 'center',
    height: '150px',
  },
  infoTitle: {
    color: appColors.primary,
    marginBottom: '10px',
    fontWeight: '700',
  },
  infoDesc: {
    paddingLeft: '20%',
    paddingRight: '20%',
    textAlign: 'center',
    color: '#000000',
  },
  title: {
    color: appColors.secondary,
    fontSize: '40px',
    fontWeight: '700',
  },
  bar: {
    borderBottom: '4px solid ' + appColors.secondary,
    marginBottom: '50px',
    width: '410px',
  },
  root: {
    backgroundColor: appColors.buttonText,
    width: '100%',
    height: 'auto',
    //paddingTop: '5px',
    paddingBottom: '30px',
  },

  farmTitle: {
    color: appColors.primary,
    marginBottom: '10px',
    fontSize: '30px',
    fontWeight: '700',
    textAlign: 'left',
  },
  farmDesc: {
    color: 'black',
    textAlign: 'left',
    fontSize: '20px',
    fontWeight: '500',
  },

  testimonial: {
    //backgroundColor: appColors.componentBg,
    width: '100%',
    height: 'auto',
    paddingTop: '30px',
    paddingBottom: '30px',
  },

  farmer: {
    backgroundColor: appColors.componentBg,
    width: '100%',
    height: 'auto',
    paddingTop: '30px',
    paddingBottom: '30px',
  },
}));

/**
 * Hook that alerts clicks outside of the passed ref
 */
// TODO: click outside works, needs configuration on initial click
function useOutsideAlerter(ref) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        !ref.current.hidden
      ) {
        ref.current.hidden = true;
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

//backgroundImage:`url(${Background})`,

// TODO:  Social login can login direct login only if the email is verified
// TODO:  Add auto address fill
// DONE:  Allow a click out of login to close it
const Landing = ({ ...props }) => {
  const classes = useStyles();

  // Toggles for the login and signup box to be passed in as props to the Landing Nav Bar
  const [isLoginShown, setIsLoginShown] = useState(false); // checks if user is logged in
  const [isSignUpShown, setIsSignUpShown] = useState(false);

  const loginWrapperRef = useRef(null);
  useOutsideAlerter(loginWrapperRef, setIsLoginShown);
  const signupWrapperRef = useRef(null);
  useOutsideAlerter(signupWrapperRef, setIsSignUpShown);

  const handleClose = () => {
    console.log('close');
    setIsLoginShown(false);
    setIsSignUpShown(false);
  };

  return (
    <div className="pageContainer">
      <div className="contentWrap">
        <Box
          style={{
            backgroundSize: 'cover',

            backgroundImage: `url(${'transparent-landing-bg.png'})`,
            opacity: 1,
            paddingBottom: '100px',
          }}
        >
          <LandingNavBar
            isLoginShown={isLoginShown}
            setIsLoginShown={setIsLoginShown}
            isSignUpShown={isSignUpShown}
            setIsSignUpShown={setIsSignUpShown}
          />
          {/* START: Login/SignUp Modal */}
          <Box display="flex" justifyContent="flex-end">
            {/* Login Modal */}
            <Box
              position="absolute"
              width="50%"
              display="flex"
              justifyContent="center"
              zIndex={40}
            >
              <Box
                ref={loginWrapperRef}
                className={classes.authModal}
                hidden={!isLoginShown}
              >
                <AdminLogin />
              </Box>
            </Box>

            {/* Sign Up Modal */}
            <Box display="flex" justifyContent="flex-end">
              <Box
                position="absolute"
                width="50%"
                display="flex"
                justifyContent="center"
                zIndex={40}
              >
                <Box
                  ref={signupWrapperRef}
                  className={classes.authModal}
                  hidden={!isSignUpShown}
                >
                  <Signup />
                </Box>
              </Box>
            </Box>
          </Box>
          {/* END: Login/SignUp Modal */}
          {/* START: landing Logo and Guest Login */}
          <Container
            fluid
            //class="container-fluid px-0"
            style={{
              paddingLeft: 0,
              paddingRight: 0,
              backgroundSize: 'cover',
              backgroundImage: `url(${'fruits-and-vegetables.png'})`,
              overflow: 'hidden',
              width: '100%',
            }}
          >
            <Row class="align-items-center">
              <Col lg={6} md={{ size: 6, order: 2, offset: 1 }}>
                <div
                  id="headingGroup"
                  class="text-white text-center d-none d-lg-block mt-5"
                >
                  <h1
                    id="text"
                    style={{
                      color: appColors.buttonText,
                      fontSize: '80px',
                      textAlign: 'left',
                      fontWeight: '700',
                      marginLeft: '90px',
                    }}
                  >
                    Fresh, Organic <br></br>
                    Produce <br></br>Delivered
                  </h1>
                </div>
              </Col>
              <Col lg={6} md={{ size: 6, order: 1, offset: 1 }}>
                <img
                  class="img-fluid"
                  src="./logos/SF.png"
                  style={{
                    marginTop: '40px',
                    //marginLeft: '800px',
                  }}
                />
              </Col>
            </Row>
          </Container>
          {/* END: Landing Page Logo */}

          <Box
            className="hero-right"
            style={{ background: 'rgba(244, 134, 9, 0.85)' }}
          >
            {/* <ZipcodeSearch/> */}
            <p
              style={{
                color: appColors.buttonText,
                fontSize: '30px',
                textAlign: 'center',
                fontWeight: '700',
                marginLeft: '20px',
              }}
            >
              Local produce delivered to your doorstep
            </p>
            <DeliveryLocationSearch />
          </Box>

          {/* START: Info Section */}

          <Box className={classes.title} style={{ paddingTop: '30px' }}>
            Why try Serving Fresh
          </Box>
          <Box mx="auto" className={classes.bar} />
          <Box
            // display="flex"
            className="info-container"
          >
            <Box className={classes.infoSection} id="mobileInfoSection">
              <Box className={classes.infoImg}>
                <img
                  src="./landing/vegetables_info.png"
                  alt="vegetables info"
                />
              </Box>
              <div className={classes.infoTitle}>Farm to doorstep</div>
              <div className={classes.infoDesc}>
                We bring fresh produce from local farms right to our consumers'
                doorstep. It's a farmer's market experience at your fingertips
              </div>
            </Box>
            <Box className={classes.infoSection} id="mobileInfoSection">
              <Box className={classes.infoImg}>
                <img src="./landing/farmer_info.png" alt="farmer info" />
              </Box>
              <div className={classes.infoTitle}>Help local farmers</div>
              <div className={classes.infoDesc}>
                Helping farmers continue their businesses in the post pandemic
                world. Serving Fresh brings their produce to your doorstep in
                the safest way possible.
              </div>
            </Box>
            <Box className={classes.infoSection} id="mobileInfoSection">
              <Box className={classes.infoImg}>
                <img src="./landing/student_info.png" alt="student info" />
              </Box>
              <div className={classes.infoTitle}>Empower students</div>
              <div className={classes.infoDesc}>
                We help students gain real world experience by working with us
                on developing Serving Fresh.
              </div>
            </Box>
          </Box>
          {/* END: Info Section */}
          {/* START: Local Produce Search */}
          <Box my={10}>
            <ProductDisplay />
          </Box>
          {/* END: Local Produce Search */}
          {/* START: Farmer information */}
          <Container
            fluid
            style={{
              paddingLeft: 0,
              paddingRight: 0,
              paddingBottom: '50px',
              backgroundSize: 'cover',
              backgroundColor: `white`,
              overflow: 'hidden',
              width: '100%',
            }}
          >
            <Box
              className={classes.title}
              style={{
                textAlign: 'left',
                marginLeft: '150px',
                paddingBottom: '50px',
              }}
            >
              Featured Farmer
            </Box>
            <Row>
              <Col lg={4}>
                <img
                  src="./landing/farmer_pic.jpg"
                  alt="farmer info"
                  style={{ width: '400px', height: '510px' }}
                />
                <Box
                  className={classes.farmTitle}
                  style={{ marginLeft: '150px' }}
                >
                  Rodriguez Farms
                  <div className={classes.farmDesc}>
                    City: <br></br>
                    Contact:
                  </div>
                </Box>
              </Col>
              <Hidden md sm xs>
                <Col md={8}>
                  <img
                    src="./landing/farm_pic.jpg"
                    alt="farm info"
                    style={{ width: '869px', height: '518px' }}
                  />
                </Col>
              </Hidden>
            </Row>
            <Row style={{ paddingTop: '50px' }}>
              <Hidden md sm xs>
                <Col md={4}></Col>
                <Col md={4}>
                  <img
                    src="./landing/produce.jpg"
                    alt="farm info"
                    style={{
                      width: '435px',
                      height: '518px',
                      paddingLeft: '180px',
                    }}
                  />
                </Col>
              </Hidden>

              <Col md={4}>
                <div
                  className={classes.farmTitle}
                  style={{ marginLeft: '100px' }}
                >
                  Featured Produce
                  <div className={classes.farmDesc}>
                    Item1 <br></br>
                    Item2 <br></br>
                    Item3
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
          <Box className={classes.farmer}>
            <Box
              className={classes.title}
              style={{
                textAlign: 'center',
                marginLeft: '150px',
                paddingBottom: '50px',
              }}
            >
              Meet the Farmers
            </Box>
            <Farmers />
          </Box>
          {/* END: Farmer Information */}
          {/* START: Info Section */}
          <Box className={classes.root}>
            <Box
              // display="flex"
              className="info-container"
            >
              <Box className={classes.infoSection} id="mobileInfoSection">
                <div className={classes.infoDesc}>
                  <p
                    style={{
                      color: appColors.secondary,
                      fontSize: '40px',
                      textAlign: 'center',
                      fontWeight: '600',
                      marginLeft: '20px',
                    }}
                  >
                    100%
                  </p>
                  ute irure dolor in reprehenderit in voluptate velit esse
                  cillum d
                </div>
              </Box>

              <Box className={classes.infoSection} id="mobileInfoSection">
                <div className={classes.infoDesc}>
                  <p
                    style={{
                      color: appColors.secondary,
                      fontSize: '40px',
                      textAlign: 'center',
                      fontWeight: '600',
                      marginLeft: '20px',
                      marginTop: '40px',
                    }}
                  >
                    4.8/5
                  </p>
                  fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                  proident,
                </div>
              </Box>
              <Box className={classes.infoSection} id="mobileInfoSection">
                <div className={classes.infoDesc}>
                  <p
                    style={{
                      color: appColors.secondary,
                      fontSize: '40px',
                      textAlign: 'center',
                      fontWeight: '600',
                      marginLeft: '20px',
                    }}
                  >
                    7+ Farms
                  </p>
                  ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                </div>
              </Box>
            </Box>
          </Box>
          <Box className={classes.testimonial}>
            <Box
              className={classes.title}
              style={{
                textAlign: 'center',
                marginLeft: '150px',
                paddingBottom: '50px',
              }}
            >
              Testimonials
            </Box>
            <Testimonial />
          </Box>

          {/* END: Info Section */}
          <Box className="hero-left">
            {/* <ZipcodeSearch/> */}
            <p
              style={{
                color: appColors.secondary,
                fontSize: '40px',
                textAlign: 'center',
                fontWeight: '700',
                marginLeft: '20px',
              }}
            >
              Ready to Order?
            </p>
            <p
              style={{
                color: appColors.primary,
                fontSize: '30px',
                textAlign: 'center',
                fontWeight: '700',
                marginLeft: '20px',
                marginTop: 0,
              }}
            >
              Fresh, oraganic produce delivered
            </p>
            <Order />
          </Box>
          <Footer />
        </Box>
      </div>
    </div>
  );
};

export default Landing;
