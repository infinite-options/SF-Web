import React, { useState, useEffect, useContext } from 'react';
import NumberFormat from 'react-number-format';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
// import Input from '@material-ui/core/Input';
import axios from 'axios';
import appColors from '../../styles/AppColors';
import { AdminFarmContext } from '../AdminFarmContext';
import WeeklyHourRange from './components/WeeklyHourRange';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// import UploadPreview from 'material-ui-upload/UploadPreview';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import ImageUploading from 'react-images-uploading';
import blankImg from '../../images/blank_img.svg';

const BUSINESS_DETAILS_URL =
  'https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/business_details_update/';
const API_URL =
  'https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/';

// TODO: cannot type in 12:00am
function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: Math.abs(values.value),
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
}
function PercentFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: Math.abs(values.value),
          },
        });
      }}
      thousandSeparator
      isNumericString
      suffix="%"
    />
  );
}

function createWeeklyDateTime(props) {
  return (
    <WeeklyHourRange
      hours={props.hours}
      setHours={props.setHours}
      weekday={props.dayInWeek}
      start={props.start}
      end={props.end}
      id={props.dayInWeek}
      key={props.dayInWeek}
    />
  );
}

const dayInWeekArray = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function parseHours(hoursObject, setHoursObject) {
  const hours = [];
  if (hoursObject !== null) {
    for (const day of dayInWeekArray) {
      const startDelivery =
        day in hoursObject ? hoursObject[day][0].slice(0, 5) : '';
      const endDelivery =
        day in hoursObject ? hoursObject[day][1].slice(0, 5) : '';
      const newDeliveryObj = {
        dayInWeek: day,
        start: startDelivery,
        end: endDelivery,
        hours: hoursObject,
        setHours: setHoursObject,
      };
      hours.push(newDeliveryObj);
    }
  }
  return hours;
}

// TODO: fields needed ([x] business_hours, business_type, business_association, platform_fee [currency], transaction_fee [currency], revenue_sharing[%], profit_sharing[%])
// TODO:  Add needed fields to settings page
// TODO: container needs label
export default function FarmerSettings({ farmID, farmName, ...props }) {
  const context = useContext(AdminFarmContext);
  const [settings, setSettings] = useState({});
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  //use this state below to set up information of middle column
  const [businessAndFarmDetail, setBusFarm] = useState({});
  const [passwordHere, setPass] = useState('');

  const [confirmPass, setConfirmPass] = useState('');
  const [saltPack, setSaltPack] = useState({});
  // const [image,setImage]=useState({});
  const [imageUpload, setImageUpload] = useState({
    file: null,
    path: settings ? settings.business_image : blankImg,
  });
  // Regular Hours for Business
  const [regularHours, setRegularHours] = useState([]);
  const [acceptTime, setAcceptTime] = useState(context.timeChange);
  const [deliveryTime, setDeliveryTime] = useState(context.deliveryTime);

  const [regularHoursObj, setRegularHoursObj] = useState(
    parseHours(regularHours, setRegularHours)
  );
  const [acceptTimeObj, setAcceptTimeObj] = useState(
    parseHours(acceptTime, setAcceptTime)
  );
  const [deliveryTimeObj, setDeliveryTimeObj] = useState(
    parseHours(deliveryTime, setDeliveryTime)
  );

  useEffect(() => {
    console.log(imageUpload);
  }, [imageUpload]);

  useEffect(() => {
    setRegularHoursObj(parseHours(regularHours, setRegularHours));
  }, [regularHours]);
  useEffect(() => {
    setAcceptTimeObj(parseHours(acceptTime, setAcceptTime));
  }, [acceptTime]);
  useEffect(() => {
    setDeliveryTimeObj(parseHours(deliveryTime, setDeliveryTime));
  }, [deliveryTime]);

  useEffect(() => {}, [acceptTime]);

  const maxNumImg = 1;

  const handleImgChange = (e) => {
    if (e.target.files > 0)
      setImageUpload({
        file: e.target.files[0],
        path: URL.createObjectURL(e.target.files[0]),
      });
  };

  async function digestMessage(message, alg) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hash = await crypto.subtle.digest(alg, data);
    const hashArray = Array.from(new Uint8Array(hash)); // convert buffer to byte array
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(''); // convert bytes to hex string
    // setConfirmPass(hashHex);
    return hashHex;
    // return hash;
  }

  useEffect(() => {
    setAcceptTime(context.timeChange);
  }, [context.timeChange]);
  useEffect(() => {
    setDeliveryTime(context.deliveryTime);
  }, [context.deliveryTime]);

  async function update() {
    var tempoData = { ...settings };

    tempoData.business_name = businessAndFarmDetail.business_name;
    tempoData.business_desc = businessAndFarmDetail.description;

    tempoData.business_contact_first_name = businessAndFarmDetail.firstName;
    tempoData.business_contact_last_name = businessAndFarmDetail.lastName;
    tempoData.business_phone_num = businessAndFarmDetail.phone;
    tempoData.business_address = businessAndFarmDetail.street;
    tempoData.business_city = businessAndFarmDetail.city;
    tempoData.business_state = businessAndFarmDetail.state;
    tempoData.business_zip = businessAndFarmDetail.zip;
    tempoData.business_hours = regularHours;
    tempoData.business_accepting_hours = acceptTime;
    tempoData.business_delivery_hours = deliveryTime;
    tempoData.business_license = businessAndFarmDetail.businessLicense;
    tempoData.business_USDOT = businessAndFarmDetail.businessUsdot;
    tempoData.business_EIN = businessAndFarmDetail.businessEin;
    tempoData.business_WAUBI = businessAndFarmDetail.businessWaubi;
    tempoData.platform_fee = businessAndFarmDetail.platformFee.toString();
    tempoData.transaction_fee = businessAndFarmDetail.transactionFee.toString();
    tempoData.profit_sharing = businessAndFarmDetail.profitSharing.toString();
    tempoData.revenue_sharing = businessAndFarmDetail.revenueSharing.toString();
    // console.log(typeof tempoData.business_hours);

    if (typeof tempoData.business_hours === 'string') {
      tempoData.business_hours = JSON.parse(tempoData.business_hours);
    }

    if (typeof tempoData.business_accepting_hours === 'string') {
      tempoData.business_accepting_hours = JSON.parse(
        tempoData.business_accepting_hours
      );
    }

    if (typeof tempoData.business_delivery_hours === 'string') {
      tempoData.business_delivery_hours = JSON.parse(
        tempoData.business_delivery_hours
      );
    }

    if (typeof tempoData.business_association === 'string') {
      tempoData.business_association = JSON.parse(
        tempoData.business_association
      );
    }

    //third column
    if (deliverStrategy.pickupStatus === true) {
      tempoData.delivery = '0';
    } else {
      tempoData.delivery = '1';
    }

    if (storage.reusable === true) {
      tempoData.reusable = '1';
    } else {
      tempoData.reusable = '0';
    }
    if (cancellation.allowCancel === true) {
      tempoData.can_cancel = '1';
    } else {
      tempoData.can_cancel = '0';
    }

    console.log(JSON.stringify(tempoData));

    axios
      .post(
        'https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/business_details_update/Post',
        tempoData
      )
      .then((res) => {
        console.log('success posting check password: ', res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleChange = (event) => {
    if (event.target.name === 'phone') {
      let holdNumber = event.target.value;
      let createCorrectFormat = holdNumber;
      setBusFarm({
        ...businessAndFarmDetail,
        [event.target.name]: createCorrectFormat,
      });
    } else if (event.target.name === 'password') {
      setPass(event.target.value);
    } else if (event.target.name === 'passwordConfirm') {
      setConfirmPass(event.target.value);
    } else if (event.target.name === 'email') {
    } else {
      setBusFarm({
        ...businessAndFarmDetail,
        [event.target.name]: event.target.value,
      });
    }
  };

  const [deliverStrategy, setDeliveryStrategy] = useState({
    pickupStatus: true,
    deliverStatus: false,
  });

  const [storage, setStorage] = useState({
    reusable: true,
    disposable: false,
  });

  const [cancellation, setCancellation] = useState({
    allowCancel: true,
    noAllowCancel: false,
  });

  //this three function is to check/uncheck box and update state
  const handleChangeCancel = (event) => {
    var optionPick = event.target.name;
    var newCancelObj = {};
    if (optionPick === 'allowCancel') {
      newCancelObj = {
        allowCancel: true,
        noAllowCancel: false,
      };
    } else {
      newCancelObj = {
        allowCancel: false,
        noAllowCancel: true,
      };
    }
    setCancellation(newCancelObj);
  };
  const handleChangeStorage = (event) => {
    var optionPick = event.target.name;
    var newStorageObj = {};
    if (optionPick === 'reusable') {
      newStorageObj = {
        reusable: true,
        disposable: false,
      };
    } else {
      newStorageObj = {
        reusable: false,
        disposable: true,
      };
    }
    setStorage(newStorageObj);
  };
  const handleChangeDelivery = (event) => {
    var optionPick = event.target.name;
    var newDeliveryObj = {};
    if (optionPick === 'pickupStatus') {
      newDeliveryObj = {
        pickupStatus: true,
        deliverStatus: false,
      };
    } else {
      newDeliveryObj = {
        pickupStatus: false,
        deliverStatus: true,
      };
    }
    setDeliveryStrategy(newDeliveryObj);
  };

  useEffect(() => {
    getFarmSettings();
    // getSaltPassword();
  }, [farmID]);

  useEffect(() => {
    if (settings) {
      setImageUpload({
        file: null,
        path: settings.business_image,
      });
      console.log('test log the email: ', settings.business_email);
      if (settings.business_email === undefined) {
        console.log('true undifined');
      }
      var objEmail = {
        email: settings.business_email,
      };
      objEmail = JSON.stringify(objEmail);
      axios.post(API_URL + 'AccountSalt', objEmail).then((response) => {
        // console.log(response);
        // console.log("New Test",response.data.code);
        if (response.data.code === 280) {
          let hashAlg = response.data.result[0].password_algorithm;
          let salt = response.data.result[0].password_salt;
          if (hashAlg !== null && salt !== null) {
            if (hashAlg !== '' && salt !== '') {
              switch (hashAlg) {
                case 'SHA512':
                  hashAlg = 'SHA-512';
                  break;
                default:
                  console.log('display default falling into');
                  break;
              }
              let newObj = {
                hashAlg: hashAlg,
                salt: salt,
              };
              setSaltPack(newObj);
            }
          }
        }
      });
    }
  }, [settings]);

  const getFarmSettings = () => {
    axios
      .post(BUSINESS_DETAILS_URL + 'Get', { business_uid: farmID })
      .then((response) => {
        console.log('Settings:', response.data.result[0]);
        setSettings(response.data.result[0]);
        context.setTimeChange(
          JSON.parse(response.data.result[0].business_accepting_hours)
        );
        context.setDeliveryTime(
          JSON.parse(response.data.result[0].business_delivery_hours)
        );
        setRegularHours(JSON.parse(response.data.result[0].business_hours));
        var holdData = response.data.result[0];
        // Convert null values to empty string
        let keys = Object.keys(holdData);
        for (const key of keys) {
          if (holdData[key] === null) {
            holdData[key] = '';
          }
        }
        console.log(holdData);
        var BusAndFarmObj = {
          business_name: holdData.business_name,
          description: holdData.business_desc,
          businessAssociation: holdData.business_association,
          firstName: holdData.business_contact_first_name,
          lastName: holdData.business_contact_last_name,
          phone: holdData.business_phone_num,
          email: holdData.business_email,
          street: holdData.business_address,
          city: holdData.business_city,
          state: holdData.business_state,
          zip: holdData.business_zip,
          businessLicense: holdData.business_license || '',
          businessUsdot: holdData.business_USDOT || '',
          businessEin: holdData.business_EIN || '',
          businessWaubi: holdData.business_WAUBI || '',
          businessNotiApprov: holdData.business_notification_approval || '',
          platformFee: holdData.platform_fee,
          transactionFee: holdData.transaction_fee,
          revenueSharing: holdData.revenue_sharing,
          profitSharing: holdData.profit_sharing,
          password: holdData.business_password,
          // madeUpPassword:"test123"
        };
        if (holdData.delivery === 0) {
          setDeliveryStrategy({
            pickupStatus: true,
            deliverStatus: false,
          });
        } else {
          setDeliveryStrategy({
            pickupStatus: false,
            deliverStatus: true,
          });
        }

        if (holdData.can_cancel === 0) {
          setCancellation({
            allowCancel: false,
            noAllowCancel: true,
          });
        } else {
          setCancellation({
            allowCancel: true,
            noAllowCancel: false,
          });
        }

        if (holdData.reusable === 0) {
          setStorage({
            reusable: false,
            disposable: true,
          });
        } else {
          setStorage({
            reusable: true,
            disposable: false,
          });
        }

        setBusFarm(BusAndFarmObj);
        setLoaded(true);
      })
      .catch((err) => {
        console.log(err.response || err);
        setError(true);
      });
  };

  if (error && !loaded && farmID !== 'all') {
    return <div>Loading Information...</div>;
  }

  return (
    <div hidden={props.hidden}>
      <Box display="flex">
        <div className="divleft" style={{ width: '75%', height: '1250px' }}>
          <Box display="flex">
            <h1 style={{ marginLeft: '10px' }}>Update Business Settings</h1>
            <Button
              variant="contained"
              size="small"
              onClick={update}
              style={{
                backgroundColor: appColors.primary,
                color: 'white',
                height: '20px',
                marginTop: '35px',
                marginLeft: '35px',
              }}
            >
              Save Changes
            </Button>
          </Box>
          <hr className="hrorange"></hr>

          {/* START: Hours section */}
          <Box display="flex">
            <Box mx={1} width="350px">
              <div
                style={{
                  // fontSize: "1rem",
                  margin: '0.3rem 0 0.7rem',
                }}
              >
                <h3>Regular Hours</h3>
              </div>
              {regularHoursObj.map(createWeeklyDateTime)}
              <div
                style={{
                  // fontSize: "1rem",
                  margin: '0.3rem 0 0.7rem',
                }}
              >
                <h3>Orders Accepting Hours</h3>
              </div>
              {acceptTimeObj.map(createWeeklyDateTime)}
              <div
                style={{
                  // fontSize: "1rem",
                  margin: '0.3rem 0 0.7rem',
                }}
              >
                <h3>Delivery Hours</h3>
              </div>
              {deliveryTimeObj.map(createWeeklyDateTime)}
            </Box>
            {/* END: Hours section */}

            {/* START: Business Details section */}
            <Box flexGrow={1} mr={2}>
              <h3>Business Details</h3>
              <div>Business Rep First Name</div>
              <TextField
                size="small"
                margin="dense"
                value={businessAndFarmDetail.firstName}
                variant="outlined"
                name="firstName"
                fullWidth
                onChange={handleChange}
              />
              <div>Business Rep Last Name</div>
              <TextField
                size="small"
                margin="dense"
                value={businessAndFarmDetail.lastName}
                variant="outlined"
                name="lastName"
                fullWidth
                onChange={handleChange}
              />
              <div>Business Rep Phone Number</div>
              <TextField
                size="small"
                margin="dense"
                value={businessAndFarmDetail.phone}
                variant="outlined"
                name="phone"
                fullWidth
                onChange={handleChange}
              />
              <div>Business Rep Email</div>
              <TextField
                size="small"
                margin="dense"
                value={businessAndFarmDetail.email}
                variant="outlined"
                name="email"
                fullWidth
                onChange={handleChange}
              />
              <div>Business Association</div>
              <TextField
                size="small"
                margin="dense"
                value={businessAndFarmDetail.businessAssociation}
                variant="outlined"
                name="phone"
                fullWidth
                onChange={handleChange}
              />
              <h3>Farm Detail</h3>
              <div>Street</div>
              <TextField
                size="small"
                margin="dense"
                value={businessAndFarmDetail.street}
                variant="outlined"
                name="street"
                fullWidth
                onChange={handleChange}
              />
              <div>Farm City</div>
              <TextField
                size="small"
                margin="dense"
                value={businessAndFarmDetail.city}
                variant="outlined"
                name="city"
                fullWidth
                onChange={handleChange}
              />
              <div>State</div>
              <TextField
                size="small"
                margin="dense"
                value={businessAndFarmDetail.state}
                variant="outlined"
                name="state"
                fullWidth
                onChange={handleChange}
              />
              <div>Zip</div>
              <TextField
                size="small"
                margin="dense"
                value={businessAndFarmDetail.zip}
                variant="outlined"
                name="zip"
                fullWidth
                onChange={handleChange}
              />
              <h3>Business Certificates</h3>
              <div>Business License</div>
              <TextField
                size="small"
                margin="dense"
                value={businessAndFarmDetail.businessLicense}
                variant="outlined"
                name="businessLicense"
                fullWidth
                onChange={handleChange}
              />
              <div>Business USDOT</div>
              <TextField
                size="small"
                margin="dense"
                value={businessAndFarmDetail.businessUsdot}
                variant="outlined"
                name="businessUsdot"
                fullWidth
                onChange={handleChange}
              />
              <div>Business EIN</div>
              <TextField
                size="small"
                margin="dense"
                value={businessAndFarmDetail.businessEin}
                variant="outlined"
                name="businessEin"
                fullWidth
                onChange={handleChange}
              />
              <div>Business WAUBI</div>
              <TextField
                size="small"
                margin="dense"
                value={businessAndFarmDetail.businessWaubi}
                variant="outlined"
                name="businessWaubi"
                fullWidth
                onChange={handleChange}
              />
            </Box>
            {/* END: Business Details section */}

            {/* START: Delivery Strategy section */}
            <Box width="300px">
              <h3>Fees</h3>
              <div>Platform Fee</div>
              <TextField
                size="small"
                margin="dense"
                value={businessAndFarmDetail.platformFee}
                variant="outlined"
                name="platformFee"
                onChange={handleChange}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
              />
              <div>transaction Fee</div>
              <TextField
                size="small"
                margin="dense"
                value={businessAndFarmDetail.transactionFee}
                variant="outlined"
                name="transactionFee"
                onChange={handleChange}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
              />
              <div>revenue Sharing</div>
              <TextField
                size="small"
                margin="dense"
                value={businessAndFarmDetail.revenueSharing}
                variant="outlined"
                name="revenueSharing"
                onChange={handleChange}
                InputProps={{
                  inputComponent: PercentFormatCustom,
                }}
              />
              <div>Profit Sharing</div>
              <TextField
                size="small"
                margin="dense"
                value={businessAndFarmDetail.profitSharing}
                variant="outlined"
                name="profitSharing"
                onChange={handleChange}
                InputProps={{
                  inputComponent: PercentFormatCustom,
                }}
              />
              <h3>Delivery Strategy</h3>
              <FormControl component="fieldset">
                {/* <FormLabel component="legend">Delivery Strategy</FormLabel> */}
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={deliverStrategy.pickupStatus}
                        onChange={handleChangeDelivery}
                        name="pickupStatus"
                      />
                    }
                    label="Pickup at Farmer's Market"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={deliverStrategy.deliverStatus}
                        onChange={handleChangeDelivery}
                        name="deliverStatus"
                      />
                    }
                    label="Deliver to Customer"
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel component="legend">Storage</FormLabel>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={storage.reusable}
                        onChange={handleChangeStorage}
                        name="reusable"
                      />
                    }
                    label="Reusable"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={storage.disposable}
                        onChange={handleChangeStorage}
                        name="disposable"
                      />
                    }
                    label="Disposable"
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel component="legend">Cancellation</FormLabel>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={cancellation.allowCancel}
                        onChange={handleChangeCancel}
                        name="allowCancel"
                      />
                    }
                    label="Allow cancellation within ordering hours"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={cancellation.noAllowCancel}
                        onChange={handleChangeCancel}
                        name="noAllowCancel"
                      />
                    }
                    label="Cancellations not allowed"
                  />
                </FormGroup>
              </FormControl>
            </Box>
            {/* END: Delivery Strategy section */}
          </Box>
        </div>
        <div className="divright" style={{ width: '25%', height: '1250px' }}>
          <Box display="flex" mb={1}>
            <h1 style={{ marginLeft: '10px' }}>Profile</h1>
          </Box>
          <hr className="hrwhite"></hr>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
          >
            <h3>Profile Picture</h3>

            <div>
              <img
                src={imageUpload.path || blankImg}
                alt="profile"
                style={{ width: 200, height: 200 }}
              />
            </div>
            <div>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                component="label"
                fullWidth
                style={{
                  borderColor: appColors.border,
                  backgroundColor: 'white',
                  width: '200px',
                }}
              >
                Upload File
                <input
                  onChange={handleImgChange}
                  type="file"
                  accept="image/*"
                />
              </Button>
            </div>

            <Box mt={2}>
              <div>Email Address</div>
              <TextField
                disabled
                size="small"
                margin="dense"
                id="standard-read-only-input"
                label={businessAndFarmDetail.email}
                variant="outlined"
                // defaultValue={businessAndFarmDetail.email}
                name="email"
                // onChange={handleChange}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
              {/* <div>New Password</div> */}
              {/* <TextField
                // error={errorStatus}
                size="small"
                margin="dense"
                // defaultValue={businessAndFarmDetail.madeUpPassword}
                type="password"
                variant="outlined"
                name="password"
                fullWidth
                style={{ width: '300px' }}
                onChange={handleChange}
              />

              <div>Confirm New Password</div>
              <TextField
                // error={errorStatus}
                size="small"
                margin="dense"
                type="password"
                variant="outlined"
                name="passwordConfirm"
                fullWidth
                style={{ width: '300px' }}
                onChange={handleChange}
                // helperText={errorStatus?"Password not match":""}
              /> */}
            </Box>
          </Box>
        </div>
      </Box>
    </div>
  );
}

function DayHours(props) {
  return (
    <div style={{ marginBottom: '0.25rem' }}>
      <b style={{ marginRight: '0.5rem' }}>{props.weekday}</b>
      <TextField
        size="small"
        type="time"
        defaultValue="00:00"
        style={{ width: '100px' }}
        InputProps={{ style: { height: '20px', fontSize: '0.7rem' } }}
      />
      <b style={{ margin: '0.75rem' }}>—</b>
      <TextField
        size="small"
        type="time"
        defaultValue="12:00"
        style={{ width: '100px' }}
        InputProps={{ style: { height: '20px', fontSize: '0.7rem' } }}
      />
    </div>
  );
}

// styling
const labelStyle = {
  backgroundColor: 'white',
  width: '70%',
  textAlign: 'left',
  // marginLeft: "25px",
  marginBottom: '20px',
};
