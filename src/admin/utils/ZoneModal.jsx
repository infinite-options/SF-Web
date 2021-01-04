import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import NumberFormat from 'react-number-format';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import makeStyles from '@material-ui/styles/makeStyles';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';

import { AdminFarmContext } from '../AdminFarmContext';
import appColors from '../../styles/AppColors';
import CssTextField from '../../utils/CssTextField';

const API_URL =
  'https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 490,
    maxWidth: 490,
  },
  dayFormControl: {
    margin: theme.spacing(1),
    width: 160,
  },
  timeAmPm: {
    margin: theme.spacing(1),
    width: 45,
  },
  optionAmPm: {
    margin: theme.spacing(1),
    width: 50,
  },
  modalBody: {
    marginTop: '30px',
    width: '500px',
    marginRight: 'auto',
    marginLeft: 'auto',
    padding: '40px',
  },
}));

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
    />
  );
}
function NumberFormatCustomPrice(props) {
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

const deliveryDays = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

const timeNumbers = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
];
const timeOptions = ['am', 'pm'];

const ITEM_HEIGHT = 108;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

export default function ZoneModal(props) {
  const handleCloseEditModel = () => {
    props.setOpen(false);
  };

  const ZoneCard = (zone) => {
    const classes = useStyles();
    const { farmDict } = useContext(AdminFarmContext);

    const [errorMessage, setErrorMessage] = React.useState('');
    const [businesses, setBusinesses] = React.useState([]);
    const [businessPicked, setBusinessPicked] = React.useState([]);
    const [deliveryDay, setDeliveryDay] = useState('SUNDAY');
    const [deliveryTime, setDeliveryTime] = useState({
      startTime: '',
      startOption: '',
      endTime: '',
      endOption: '',
    });
    const [acceptTime, setAcceptTime] = useState({
      startTime: '',
      startOption: '',
    });
    const [acceptDay, setAcceptDay] = useState('SATURDAY');
    const [fieldProps, setFieldProps] = useState({
      name: '',
      area: '',
      zone: '',
      service: '',
      delivery: '',
      tax: '',
      TopLeftLat: '',
      TopLeftLong: '',
      TopRightLat: '',
      TopRightLong: '',
      BotLeftLat: '',
      BotLeftLong: '',
      BotRightLat: '',
      BotRightLong: '',
    });

    useEffect(() => {
      const _businesses = [];
      for (const businessId in farmDict) {
        _businesses.push(businessId);
      }
      setBusinesses(_businesses);
    }, [farmDict]);

    const handleChange = (event) => {
      setBusinessPicked(event.target.value);
    };

    const handleFieldPropsChange = (event) => {
      const { value, name } = event.target;
      setFieldProps({ ...fieldProps, [name]: value });
    };

    const handleDeliveryDaySelect = (event) => {
      const { value } = event.target;
      setDeliveryDay(value);
    };
    const handleDeliveryTimeSelect = (event) => {
      const { value, name } = event.target;
      setDeliveryTime({ ...deliveryTime, [name]: value });
    };
    const handleAcceptTimeSelect = (event) => {
      const { value, name } = event.target;
      setAcceptTime({ ...acceptTime, [name]: value });
    };

    const handleAcceptDaySelect = (event) => {
      const { value } = event.target;
      setAcceptDay(value);
    };
    const onSubmit = () => {
      setErrorMessage('');
      const formattedDeliveryTime =
        deliveryTime.startTime +
        deliveryTime.startOption +
        ' - ' +
        deliveryTime.endTime +
        deliveryTime.endOption;
      const formattedAcceptTime = acceptTime.startTime + acceptTime.startOption;

      const zoneData = {
        z_business_uid: '200-00001',
        area: fieldProps.area,
        zone: fieldProps.zone,
        zone_name: fieldProps.name,
        z_businesses: businessPicked,
        z_delivery_day: deliveryDay,
        z_delivery_time: formattedDeliveryTime,
        z_accepting_day: acceptDay,
        z_accepting_time: formattedAcceptTime,
        service_fee: fieldProps.service.toString(),
        delivery_fee: fieldProps.delivery.toString(),
        tax_rate: fieldProps.tax.toString(),
        LB_long: fieldProps.BotLeftLong.toString(),
        LB_lat: fieldProps.BotLeftLat.toString(),
        LT_long: fieldProps.TopLeftLong.toString(),
        LT_lat: fieldProps.TopLeftLat.toString(),
        RT_long: fieldProps.TopRightLong.toString(),
        RT_lat: fieldProps.TopRightLat.toString(),
        RB_long: fieldProps.BotRightLong.toString(),
        RB_lat: fieldProps.BotRightLat.toString(),
      };

      for (const field in zoneData) {
        if (zoneData[field] === '' || zoneData[field] === undefined) {
          setErrorMessage('Please provide a value for every field');
          return;
        }
      }

      axios
        .post(
          process.env.REACT_APP_SERVER_BASE_URI +
            'update_zones/' +
            props.option.toLowerCase(),
          zoneData
        )
        .then(alert('zone successfully created'));
    };

    return (
      <Paper className={classes.modalBody}>
        {' '}
        <form onSubmit={onSubmit}>
          <Box mb={2} fontSize={20} fontWeight="bold" textAlign="center">
            {props.option} Zone
          </Box>
          <Box display="flex">
            <CssTextField
              name="name"
              label="Zone Name"
              size="small"
              variant="outlined"
              style={{ width: '235px' }}
              onChange={handleFieldPropsChange}
            />
            <Box flexGrow={1} />
            <CssTextField
              name="zone"
              label="Zone"
              size="small"
              variant="outlined"
              style={{ width: '100px' }}
              onChange={handleFieldPropsChange}
            />
            <Box flexGrow={1} />
            <CssTextField
              name="area"
              label="Area"
              size="small"
              variant="outlined"
              style={{ width: '100px' }}
              onChange={handleFieldPropsChange}
            />
          </Box>
          <Box display="flex" mt={3}>
            <Box mt={-3}>
              <FormControl className={classes.formControl}>
                <FormHelperText>Zone Businesses:</FormHelperText>
                <Select
                  multiple
                  value={businessPicked}
                  onChange={handleChange}
                  input={<Input />}
                  renderValue={(selected) =>
                    selected
                      .map((businessId) => farmDict[businessId])
                      .join(', ')
                  }
                  MenuProps={MenuProps}
                >
                  {businesses.map((businessId) => (
                    <MenuItem key={businessId} value={businessId}>
                      <Checkbox
                        checked={businessPicked.indexOf(businessId) > -1}
                      />
                      <ListItemText primary={farmDict[businessId]} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box display="flex" mt={3}>
            <Box mt={-3}>
              <FormControl className={classes.dayFormControl}>
                <FormHelperText>Delivery Day:</FormHelperText>
                <Select
                  name="business"
                  value={deliveryDay}
                  onChange={handleDeliveryDaySelect}
                >
                  {deliveryDays.map((day) => {
                    return (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
            <Box flexGrow={1} />
            <Box mt={-3}>
              <FormHelperText>Delivery Time:</FormHelperText>
              <Box display="flex">
                <FormControl className={classes.timeAmPm}>
                  <Select
                    name="startTime"
                    value={deliveryTime.startTime}
                    onChange={handleDeliveryTimeSelect}
                  >
                    {timeNumbers.map((day) => {
                      return (
                        <MenuItem key={day} value={day}>
                          {day}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl className={classes.optionAmPm}>
                  <Select
                    name="startOption"
                    value={deliveryTime.startOption}
                    onChange={handleDeliveryTimeSelect}
                  >
                    {timeOptions.map((day) => {
                      return (
                        <MenuItem key={day} value={day}>
                          {day}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <Box mt={1} mb={-1} fontSize="20px" fontWeight="bold">
                  -
                </Box>
                <FormControl className={classes.timeAmPm}>
                  <Select
                    name="endTime"
                    value={deliveryTime.endTime}
                    onChange={handleDeliveryTimeSelect}
                  >
                    {timeNumbers.map((day) => {
                      return (
                        <MenuItem key={day} value={day}>
                          {day}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl className={classes.optionAmPm}>
                  <Select
                    name="endOption"
                    value={deliveryTime.endOption}
                    onChange={handleDeliveryTimeSelect}
                  >
                    {timeOptions.map((day) => {
                      return (
                        <MenuItem key={day} value={day}>
                          {day}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>
          <Box display="flex" mt={3}>
            <Box mt={-3}>
              <FormControl className={classes.dayFormControl}>
                <FormHelperText>Accept Day:</FormHelperText>
                <Select
                  name="business"
                  value={acceptDay}
                  onChange={handleAcceptDaySelect}
                >
                  {deliveryDays.map((day) => {
                    return (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
            <Box mr={7.5} />
            <Box mt={-3}>
              <FormHelperText>Accept Time:</FormHelperText>
              <Box display="flex">
                <FormControl className={classes.timeAmPm}>
                  <Select
                    name="startTime"
                    value={acceptTime.startTime}
                    onChange={handleAcceptTimeSelect}
                  >
                    {timeNumbers.map((day) => {
                      return (
                        <MenuItem key={day} value={day}>
                          {day}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl className={classes.optionAmPm}>
                  <Select
                    name="startOption"
                    value={acceptTime.startOption}
                    onChange={handleAcceptTimeSelect}
                  >
                    {timeOptions.map((day) => {
                      return (
                        <MenuItem key={day} value={day}>
                          {day}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>
          <Box display="flex" mt={3}>
            <CssTextField
              name="service"
              label="Service Fee"
              size="small"
              variant="outlined"
              style={{ width: '150px' }}
              onChange={handleFieldPropsChange}
              InputProps={{
                inputComponent: NumberFormatCustomPrice,
              }}
            />
            <Box flexGrow={1} />
            <CssTextField
              name="delivery"
              label="Delivery Fee"
              size="small"
              variant="outlined"
              style={{ width: '150px' }}
              onChange={handleFieldPropsChange}
              InputProps={{
                inputComponent: NumberFormatCustomPrice,
              }}
            />
            <Box flexGrow={1} />
            <CssTextField
              name="tax"
              label="Tax Rate"
              size="small"
              variant="outlined"
              style={{ width: '150px' }}
              onChange={handleFieldPropsChange}
              InputProps={{
                inputComponent: PercentFormatCustom,
              }}
            />
          </Box>
          {/* Top Right */}
          <Box display="flex" mt={3}>
            <CssTextField
              name="TopLeftLat"
              label="Top Left Latitude"
              size="small"
              variant="outlined"
              style={{ width: '235px' }}
              onChange={handleFieldPropsChange}
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
            <Box flexGrow={1} />
            <CssTextField
              name="TopRightLat"
              label="Top Right Latitude"
              size="small"
              variant="outlined"
              style={{ width: '235px' }}
              onChange={handleFieldPropsChange}
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
          </Box>
          {/* Top Left */}
          <Box display="flex" mt={1}>
            <CssTextField
              name="TopLeftLong"
              label="Top Left Longitude"
              size="small"
              variant="outlined"
              style={{ width: '235px' }}
              onChange={handleFieldPropsChange}
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
            <Box flexGrow={1} />
            <CssTextField
              name="TopRightLong"
              label="Top Right Longitude"
              size="small"
              variant="outlined"
              style={{ width: '235px' }}
              onChange={handleFieldPropsChange}
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
          </Box>
          {/* Bottom Left */}
          <Box display="flex" mt={4}>
            <CssTextField
              name="BotLeftLat"
              label="Bottom Left Latitude"
              size="small"
              variant="outlined"
              style={{ width: '235px' }}
              onChange={handleFieldPropsChange}
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
            <Box flexGrow={1} />
            <CssTextField
              name="BotRightLat"
              label="Bottom Right Latitude"
              size="small"
              variant="outlined"
              style={{ width: '235px' }}
              onChange={handleFieldPropsChange}
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
          </Box>
          {/* Bottom Right */}
          <Box display="flex" mt={1}>
            <CssTextField
              name="BotLeftLong"
              label="Bottom Left Longitude"
              size="small"
              variant="outlined"
              style={{ width: '235px' }}
              onChange={handleFieldPropsChange}
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
            <Box flexGrow={1} />
            <CssTextField
              name="BotRightLong"
              label="Bottom Right Longitude"
              size="small"
              variant="outlined"
              style={{ width: '235px' }}
              onChange={handleFieldPropsChange}
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
          </Box>
          <Box mt={3} />
          <FormHelperText error={true} style={{ textAlign: 'center' }}>
            {errorMessage}
          </FormHelperText>
          <Box display="flex" justifyContent="center" width="100%">
            <Button
              onClick={onSubmit}
              style={{ backgroundColor: appColors.componentBg, width: '200px' }}
            >
              {props.option}
            </Button>
          </Box>{' '}
        </form>
      </Paper>
    );
  };

  return (
    <Modal open={props.open} onClose={handleCloseEditModel}>
      {ZoneCard()}
    </Modal>
  );
}
