import React, { useContext, useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import appColors from '../styles/AppColors';
import LandingNavBar from './LandingNavBar';
import AdminLogin from '../auth/AdminLogin';
import Signup from '../auth/Signup';
import ProductDisplay from './ProductDisplay';
import DeliveryLocationSearch from './DeliveryLocationSearch';

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
    alignItems: 'center',
    height: '150px',
  },
  infoTitle: {
    color: appColors.primary,
    marginBottom: '10px',
  },
  infoDesc: {
    paddingLeft: '20%',
    paddingRight: '20%',
    textAlign: 'center',
    color: appColors.paragraphText,
  },
  title: {
    color: appColors.secondary,
    fontSize: '22px',
    fontWeight: 'bold',
  },
  bar: {
    borderBottom: '4px solid ' + appColors.secondary,
    marginBottom: '50px',
    width: '130px',
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
    <Box
      style={{
        backgroundSize: '1000px',
        backgroundImage: `url(${'transparent-landing-bg.png'})`,
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
      <Box 
      // display="flex"
      >
        {/* START: Landing Page Logo */}
        <Box 
        // display="flex" 
        // width="50%"
         justifyContent="center">
          <img
            alt="logo.png"
            height="300px"
            width="300px"
            src="./logos/logo_transprarent bg.png"
          />
        </Box>
        {/* END: Landing Page Logo */}
        {/* START: Local Produce Search */}
        <DeliveryLocationSearch />
        {/* END: Local Produce Search */}
      </Box>

      {/* START: Local Produce Search */}
      <Box my={10}>
        <ProductDisplay />
      </Box>
      {/* END: Local Produce Search */}

      {/* START: Info Section */}
      <Box className={classes.title}>What We Do</Box>
      <Box mx="auto" className={classes.bar} />
      <Box display="flex">
        <Box className={classes.infoSection}>
          <Box className={classes.infoImg}>
            <img src="./landing/vegetables_info.png" alt="vegetables info" />
          </Box>
          <div className={classes.infoTitle}>Farm to doorstep</div>
          <div className={classes.infoDesc}>
            We bring fresh produce from local farms right to our consumers'
            doorstep. It's a farmer's market experience at your fingertips
          </div>
        </Box>
        <Box className={classes.infoSection}>
          <Box className={classes.infoImg}>
            <img src="./landing/farmer_info.png" alt="farmer info" />
          </Box>
          <div className={classes.infoTitle}>Help local farmers</div>
          <div className={classes.infoDesc}>
            Helping farmers continue their businesses in the post pandemic
            world. Serving Fresh brings their produce to your doorstep in the
            safest way possible.
          </div>
        </Box>
        <Box className={classes.infoSection}>
          <Box className={classes.infoImg}>
            <img src="./landing/student_info.png" alt="student info" />
          </Box>
          <div className={classes.infoTitle}>Empower students</div>
          <div className={classes.infoDesc}>
            We help students gain real world experience by working with us on
            developing Serving Fresh.
          </div>
        </Box>
      </Box>
      {/* END: Info Section */}
    </Box>
  );
};

export default Landing;
