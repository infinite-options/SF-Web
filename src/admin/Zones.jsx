import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import ButtonBase from '@material-ui/core/ButtonBase';
import makeStyles from '@material-ui/styles/makeStyles';
import { DataGrid } from '@material-ui/data-grid';

import ZoneModal from './utils/ZoneModal';
import { AdminFarmContext } from './AdminFarmContext';

const API_URL = process.env.REACT_APP_SERVER_BASE_URI;

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

const columns = [
  { field: 'id', headerName: 'Zone ID', width: 140 },
  { field: 'zone_name', headerName: 'Zone Name', width: 200 },
  { field: 'zone', headerName: 'Zone', width: 90 },
  { field: 'area', headerName: 'area', width: 90 },
  {
    field: 'z_delivery_day',
    headerName: 'Delivery Day',
    width: 150,
  },
  {
    field: 'z_delivery_time',
    headerName: 'Delivery Time',
    width: 150,
  },
  {
    field: 'z_accepting_day',
    headerName: 'Accept Day',
    width: 140,
  },
  {
    field: 'z_accepting_time',
    headerName: 'Accept Time',
    width: 170,
  },
  {
    field: 'businesses',
    headerName: 'Businesses',
    width: 300,
  },
  {
    field: 'service_fee',
    headerName: 'Service Fee',
    width: 150,
  },
  {
    field: 'delivery_fee',
    headerName: 'Delivery Fee',
    width: 150,
  },
  {
    field: 'tax_rate',
    headerName: 'Tax Rate',
    width: 150,
  },
  {
    field: 'LB_lat',
    headerName: 'Bottom Left latitude',
    width: 180,
  },
  {
    field: 'LB_long',
    headerName: 'Bottom Left longitude',
    width: 190,
  },
  {
    field: 'LT_lat',
    headerName: 'Top Left latitude',
    width: 180,
  },
  {
    field: 'LT_long',
    headerName: 'Top Left longitude',
    width: 190,
  },
  {
    field: 'RT_lat',
    headerName: 'Top Right latitude',
    width: 180,
  },
  {
    field: 'RT_long',
    headerName: 'Top Right longitude',
    width: 190,
  },
  {
    field: 'RB_lat',
    headerName: 'Bottom Right latitude',
    width: 180,
  },
  {
    field: 'RB_long',
    headerName: 'Bottom Right longitude',
    width: 190,
  },
];

export default function Zones() {
  const classes = useStyles();
  const [updateCount, setUpdateCount] = useState(0);
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState({});
  const [showUpdateZoneModal, setShowUpdateZoneModal] = useState(false);
  const [zonesDict, setZonesDict] = useState({});
  const { farmDict } = useContext(AdminFarmContext);

  useEffect(() => {
    axios
      .post(process.env.REACT_APP_SERVER_BASE_URI + 'update_zones/get', {})
      .then((res) => {
        if (res.data) {
          setZones(
            res.data.result.map((zone) => {
              const businesses = JSON.parse(zone.z_businesses || '[]').map(
                (businessId) => farmDict[businessId]
              );

              return { ...zone, id: zone.zone_uid, businesses: businesses };
            }) || []
          );
          const _zoneDict = {};
          for (const zone of res.data.result) {
            _zoneDict[zone.zone_uid] = zone;
          }
          setZonesDict(_zoneDict);
        }
      });
  }, [farmDict, updateCount]);

  return (
    <Box mt={3}>
      <ButtonBase
        onClick={() => {
          setShowAddZoneModal(true);
        }}
      >
        <h2 className={classes.subHeading} style={{ color: 'gray' }}>
          + Create Zone
        </h2>
      </ButtonBase>
      {showAddZoneModal && (
        <ZoneModal
          open={showAddZoneModal}
          setOpen={setShowAddZoneModal}
          option={'Create'}
          setUpdateCount={setUpdateCount}
        />
      )}
      {showUpdateZoneModal && (
        <ZoneModal
          open={showUpdateZoneModal}
          setOpen={setShowUpdateZoneModal}
          selectedZone={selectedZone}
          option={'Update'}
          setUpdateCount={setUpdateCount}
        />
      )}
      <div style={{ height: 600, width: '100%' }}>
        {zones.length > 0 && (
          <DataGrid
            rows={zones}
            columns={columns}
            onSelectionChange={(newSelection) => {
              setSelectedZone(zonesDict[newSelection.rowIds[0]]);
              setShowUpdateZoneModal(true);
            }}
          />
        )}
      </div>
    </Box>
  );
}
