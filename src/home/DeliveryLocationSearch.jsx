import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, InputAdornment, FormHelperText } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import appColors from '../styles/AppColors';
import CssTextField from '../utils/CssTextField';
import FindLongLatWithAddr from '../utils/FindLongLatWithAddr';
import { AuthContext } from '../auth/AuthContext';

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
const DeliveryLocationSearch = (props) => {
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
    <Box
    //  mt={10} 
    // width="50%" 
    justifyContent="center">
      <h4 style={{ color: appColors.secondary }}>
        Local produce delivered to your doorstop
      </h4>
      <Box justifyContent="center">
        <CssTextField
          error={errorValue}
          value={deliverylocation}
          className={classes.margin}
          id="input-with-icon-textfield"
          size="small"
          placeholder="Enter Delivery Location"
          variant="outlined"
          fullWidth
          onChange={onFieldChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon color="secondary" />
              </InputAdornment>
            ),
          }}
          style={{ width: '300px' }}
        />
        <Box width="100%" justifyContent="center">
          <FormHelperText error={true} style={{ textAlign: 'center' }}>
            {errorMessage}
          </FormHelperText>
        </Box>
      </Box>
      <Box justifyContent="center" mt={2}>
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={onFindProduceClicked}
          style={{ width: '200px' }}
        >
          Find Local Produce
        </Button>
      </Box>
    </Box>
  );
};
export default DeliveryLocationSearch;
