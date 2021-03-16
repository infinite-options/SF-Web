import React, { useState, useContext } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { useHistory } from 'react-router-dom';
import { Visible, Hidden } from 'react-grid-system';
import {
  Box,
  Button,
  InputAdornment,
  FormHelperText,
  Collapse,
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import appColors from '../styles/AppColors';
import CssTextField from '../utils/CssTextField';
import FindLongLatWithAddr from '../utils/FindLongLatWithAddr';
import { AuthContext } from '../auth/AuthContext';
import { TrendingUpRounded } from '@material-ui/icons';

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
}));
const Order = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const auth = useContext(AuthContext);

  // For Guest Procedure
  const [deliverylocation, setDeliverylocation] = useState('');
  const [errorValue, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function createError(message) {
    setError('Invalid Input');
    setErrorMessage(message);
  }
  const onFieldChange = (event) => {
    const { value } = event.target;
    setDeliverylocation(value);
  };
  const onFindProduceClicked = () => {
    const formatMessage =
      'Please use the following format: Address, City, State Zipcode';
    const locationProps = deliverylocation.split(',');
    if (locationProps.length !== 3) {
      createError(formatMessage);
      return;
    }
    const stateZip = locationProps[2].trim().split(' ');
    if (stateZip.length !== 2) {
      createError(formatMessage);
      return;
    }
    setError('');
    setErrorMessage('');

    // DONE: Save for guest checkout
    let address = locationProps[0].trim();
    let city = locationProps[1].trim();
    let state = stateZip[0].trim();
    let zip = stateZip[1].trim();

    FindLongLatWithAddr(address, city, state, zip).then((res) => {
      console.log('res: ', res);
      if (res.status === 'found') {
        const guestProfile = {
          longitude: res.longitude.toString(),
          latitude: res.latitude.toString(),
          address: address,
          city: city,
          state: state,
          zip: zip,
        };
        localStorage.setItem('guestProfile', JSON.stringify(guestProfile));
        auth.setIsGuest(true);
        history.push('/store');
      } else {
        createError('Sorry, we could not find this location');
      }
    });
  };

  return (
    <Container
      fluid={true}
      className={classes.locationContainer}
      display="flex"
      //  mt={10}
      width="100%"
      //justifyContent="space-evenly"
    >
      <Row noGutters={true} style={{ marginBottom: '30px' }}>
        <Col md={5} lg={true} style={{ padding: 0 }}>
          <CssTextField
            error={errorValue}
            value={deliverylocation}
            className={classes.margin}
            id="input-with-icon-textfield"
            size="small"
            placeholder="Search for your address"
            variant="outlined"
            fullWidth
            onChange={onFieldChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon
                    color="secondary"
                    aria-hidden="false"
                    aria-label="Enter delivery location"
                  />
                </InputAdornment>
              ),
            }}
            style={{
              width: '250px',
              border: '2px solid' + appColors.secondary,
              borderRadius: '5px',
            }}
          />

          <Box width="100%" justifyContent="center">
            <FormHelperText error={true} style={{ textAlign: 'center' }}>
              {errorMessage}
            </FormHelperText>
          </Box>
        </Col>
        <Col>
          <h10
            style={{
              color: appColors.primary,
              fontSize: '30px',
              fontWeight: '700',
              //marginTop: '0px',
            }}
          >
            OR
          </h10>
        </Col>
        <Col md={5} lg={true} style={{ paddingLeft: 0, paddingRight: 0 }}>
          <CssTextField
            error={errorValue}
            value={deliverylocation}
            className={classes.margin}
            id="input-with-icon-textfield"
            size="small"
            placeholder="Enter Zip Code"
            variant="outlined"
            fullWidth
            onChange={onFieldChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon
                    color="secondary"
                    aria-hidden="false"
                    aria-label="Enter delivery location"
                  />
                </InputAdornment>
              ),
            }}
            style={{
              width: '250px',
              border: '2px solid' + appColors.secondary,
              borderRadius: '5px',
            }}
          />
          <Box width="100%">
            <FormHelperText error={true} style={{ textAlign: 'center' }}>
              {errorMessage}
            </FormHelperText>
          </Box>
        </Col>
      </Row>
      <Row>
        <Col lg={true} style={{ padding: 0 }}>
          <Button
            size="large"
            variant="contained"
            color="secondary"
            onClick={onFindProduceClicked}
            style={{
              width: '300px',
              height: '50px',
              textTransform: 'none',
            }}
          >
            Find Local Produce
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
export default Order;
