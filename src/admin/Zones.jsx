import React, { useState, useEffect, useContext } from 'react';
import NumberFormat from 'react-number-format';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import makeStyles from '@material-ui/styles/makeStyles';

import appColors from '../styles/AppColors';
import CssTextField from '../utils/CssTextField';

const API_URL =
  'https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
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

const dayInWeekArray = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const ZoneCard = (zone) => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    age: '',
    name: 'hai',
  });
  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  return (
    <>
      <Box display="flex">
        <CssTextField label="Zone" size="small" variant="outlined" />
        <Box flexGrow={1} />
        <CssTextField label="Area" size="small" variant="outlined" />
        <Box flexGrow={1} />
        <CssTextField label="Zone Name" size="small" variant="outlined" />
        <Box flexGrow={1} />
        <Box mt={-2}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="business-native-simple">Age</InputLabel>
            <Select
              native
              value={'Ten'}
              onChange={handleChange}
              label="Age"
              inputProps={{
                name: 'age',
                id: 'business-native-simple',
              }}
              Style={{ color: appColors.secondary }}
            >
              <option aria-label="None" value="" />
              <option value={10}>Ten</option>
              <option value={20}>Twenty</option>
              <option value={30}>Thirty</option>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box display="flex">
        <CssTextField label="Delivery Day" size="small" variant="outlined" />
        <Box flexGrow={1} />
        <CssTextField label="Delivery Time" size="small" variant="outlined" />
        <Box flexGrow={1} />
        <CssTextField label="Accepting Day" size="small" variant="outlined" />
        <Box flexGrow={1} />
        <CssTextField label="Accepting Time" size="small" variant="outlined" />
      </Box>
      <Box display="flex">
        <CssTextField label="Service Fee" size="small" variant="outlined" />
        <Box flexGrow={1} />
        <CssTextField label="Delivery Fee" size="small" variant="outlined" />
        <Box flexGrow={1} />
        <CssTextField label="Tax Rate" size="small" variant="outlined" />
      </Box>
    </>
  );
};

export default function Zones() {
  return (
    <>
      <ZoneCard />
    </>
  );
}
