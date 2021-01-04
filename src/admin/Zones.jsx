import React, { useState, useEffect, useContext } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/styles/makeStyles';

import appColors from '../styles/AppColors';
import CssTextField from '../utils/CssTextField';
import ZoneModal from './utils/ZoneModal';

const API_URL =
  'https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
    maxWidth: 300,
  },
  dayFormControl: {
    margin: theme.spacing(1),
    width: 200,
  },
}));

export default function Zones() {
  const classes = useStyles();
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);

  return (
    <Box mt={3}>
      <Button
        onClick={() => {
          setShowAddZoneModal(true);
        }}
      >
        Add Zone
      </Button>
      <ZoneModal
        open={showAddZoneModal}
        setOpen={setShowAddZoneModal}
        option={'Create'}
      />
    </Box>
  );
}
