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
            value: Math.abs(values.value) || '',
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
            value: Math.abs(values.value) || '',
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
            value: Math.abs(values.value) || '',
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

export default function ZoneModal(props) {
  const handleCloseEditModel = () => {
    props.setOpen(false);
  };

  const ZoneCard = (selectedZone, setUpdateCount, setOpen) => {
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
      botLeftLong: '',
      botLeftLat: '',
      TopLeftLong: '',
      TopLeftLat: '',
      TopRightLong: '',
      TopRightLat: '',
      botRightLong: '',
      botRightLat: '',
    });

    useEffect(() => {
      const _businesses = [];
      for (const businessId in farmDict) {
        _businesses.push(businessId);
      }
      setBusinesses(_businesses);
    }, [farmDict]);

    useEffect(() => {
      if (selectedZone) {
        setFieldProps({
          name: selectedZone.zone_name || '',
          area: selectedZone.area || '',
          zone: selectedZone.zone || '',
          service: selectedZone.service_fee || '',
          delivery: selectedZone.delivery_fee || '',
          tax: selectedZone.tax_rate || '',
          botLeftLong: selectedZone.LB_long || '',
          botLeftLat: selectedZone.LB_lat || '',
          TopLeftLong: selectedZone.LT_long || '',
          TopLeftLat: selectedZone.LT_lat || '',
          TopRightLong: selectedZone.RT_long || '',
          TopRightLat: selectedZone.RT_lat || '',
          botRightLong: selectedZone.RB_long || '',
          botRightLat: selectedZone.RB_lat || '',
        });
        setBusinessPicked(JSON.parse(selectedZone.z_businesses || '[]'));
        setDeliveryDay(selectedZone.z_delivery_day || '');
        setAcceptDay(selectedZone.z_accepting_day || '');
        if (selectedZone.z_delivery_time) {
          const deliveryTimeComps = selectedZone.z_delivery_time.split(' - ');
          setDeliveryTime({
            startTime:
              deliveryTimeComps[0].length === 3
                ? deliveryTimeComps[0].substring(0, 1)
                : deliveryTimeComps[0].substring(0, 2),
            startOption:
              deliveryTimeComps[0].indexOf('am') !== -1 ? 'am' : 'pm',
            endTime:
              deliveryTimeComps[1].length === 3
                ? deliveryTimeComps[1].substring(0, 1)
                : deliveryTimeComps[1].substring(0, 2),
            endOption: deliveryTimeComps[0].indexOf('am') !== -1 ? 'am' : 'pm',
          });
        }
        if (selectedZone.z_accepting_time)
          setAcceptTime({
            startTime:
              selectedZone.z_accepting_time.length === 3
                ? selectedZone.z_accepting_time.substring(0, 1)
                : selectedZone.z_accepting_time.substring(0, 2),
            startOption:
              selectedZone.z_accepting_time.indexOf('am') !== -1 ? 'am' : 'pm',
          });
      }
    }, [selectedZone]);

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
        LB_long: fieldProps.botLeftLong.toString(),
        LB_lat: fieldProps.botLeftLat.toString(),
        LT_long: fieldProps.TopLeftLong.toString(),
        LT_lat: fieldProps.TopLeftLat.toString(),
        RT_long: fieldProps.TopRightLong.toString(),
        RT_lat: fieldProps.TopRightLat.toString(),
        RB_long: fieldProps.botRightLong.toString(),
        RB_lat: fieldProps.botRightLat.toString(),
      };

      for (const field in zoneData) {
        if (zoneData[field] === '' || zoneData[field] === undefined) {
          setErrorMessage('Please provide a value for every field');
          return;
        }
      }

      if (props.option === 'Update') {
        zoneData.zone_uid = selectedZone.zone_uid;
      }

      axios
        .post(
          process.env.REACT_APP_SERVER_BASE_URI +
            'update_zones/' +
            props.option.toLowerCase(),
          zoneData
        )
        .then((res) => {
          setUpdateCount((prev) => prev + 1);
          setOpen(false);
        });
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
              value={fieldProps.name}
              onChange={handleFieldPropsChange}
            />
            <Box flexGrow={1} />
            <CssTextField
              name="zone"
              label="Zone"
              size="small"
              variant="outlined"
              style={{ width: '100px' }}
              value={fieldProps.zone}
              onChange={handleFieldPropsChange}
            />
            <Box flexGrow={1} />
            <CssTextField
              name="area"
              label="Area"
              size="small"
              variant="outlined"
              style={{ width: '100px' }}
              value={fieldProps.area}
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
              value={fieldProps.service}
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
              value={fieldProps.delivery}
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
              value={fieldProps.tax}
              onChange={handleFieldPropsChange}
              InputProps={{
                inputComponent: PercentFormatCustom,
              }}
            />
          </Box>
          {/* TopLeftLat and TopRightLat */}
          <Box display="flex" mt={3}>
            <CssTextField
              name="TopLeftLat"
              label="Top Left Latitude"
              size="small"
              variant="outlined"
              style={{ width: '235px' }}
              value={fieldProps.TopLeftLat}
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
              value={fieldProps.TopRightLat}
              onChange={handleFieldPropsChange}
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
          </Box>
          {/* TopLeftLong and TopRightLong */}
          <Box display="flex" mt={1}>
            <CssTextField
              name="TopLeftLong"
              label="Top Left Longitude"
              size="small"
              variant="outlined"
              style={{ width: '235px' }}
              value={fieldProps.TopLeftLong}
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
              value={fieldProps.TopRightLong}
              onChange={handleFieldPropsChange}
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
          </Box>
          {/* Bottom Left */}
          <Box display="flex" mt={4}>
            <CssTextField
              name="botLeftLat"
              label="Bottom Left Latitude"
              size="small"
              variant="outlined"
              style={{ width: '235px' }}
              value={fieldProps.botLeftLat}
              onChange={handleFieldPropsChange}
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
            <Box flexGrow={1} />
            <CssTextField
              name="botRightLat"
              label="Bottom Right Latitude"
              size="small"
              variant="outlined"
              style={{ width: '235px' }}
              value={fieldProps.botRightLat}
              onChange={handleFieldPropsChange}
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
          </Box>
          {/* botLeftLong and botRightLong */}
          <Box display="flex" mt={1}>
            <CssTextField
              name="botLeftLong"
              label="Bottom Left Longitude"
              size="small"
              variant="outlined"
              style={{ width: '235px' }}
              value={fieldProps.botLeftLong}
              onChange={handleFieldPropsChange}
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
            <Box flexGrow={1} />
            <CssTextField
              name="botRightLong"
              label="Bottom Right Longitude"
              size="small"
              variant="outlined"
              style={{ width: '235px' }}
              value={fieldProps.botRightLong}
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
      {ZoneCard(props.selectedZone, props.setUpdateCount, props.setOpen)}
    </Modal>
  );
}
