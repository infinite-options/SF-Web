import React, { forwardRef } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import MaterialTable from 'material-table';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const useStyles = makeStyles((theme) => ({
  buttonGroup: {
    margin: theme.spacing(2),
  },
}));

let API_URL = process.env.REACT_APP_SERVER_BASE_URI + '';

// TODO: More people on list vs pages of 10
// TODO: Fix check mark undoing sorting, make list not rearrange
// TODO: Make check mark be individual
// TODO: Reformat message box to go on top, every field should be on one line
// TODO: Make sure the notification send is saved to saved messages
// TODO: (Low Priority) Save group

function NotificationMain({
  notification,
  customerList,
  selectedCustomers,
  setSelectedCustomers,
  message,
  setMessage,
  ...props
}) {
  const classes = useStyles();

  let numCustomersSelected = selectedCustomers.length;
  let numCustomers = customerList.length;

  // Function to handle select all customers
  const handleSelectAllCustomersClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = customerList.map(
        (customer) => customer.customer_uid
      );
      setSelectedCustomers(newSelecteds);
      return;
    }
    setSelectedCustomers([]);
  };

  // Function to determine if selected
  const customerIsSelected = (customer_uid) =>
    selectedCustomers.indexOf(customer_uid) !== -1;

  // Function to control selection and store it
  const handleChangeSelection = (event, customer_uid) => {
    const selectedIndex = selectedCustomers.indexOf(customer_uid);
    let newSelected = [];
    if (selectedIndex === -1) {
      // Add to selected list
      newSelected = newSelected.concat(selectedCustomers, customer_uid);
    } else if (selectedIndex === 0) {
      // Remove from front
      newSelected = newSelected.concat(selectedCustomers.slice(1));
    } else if (selectedIndex === selectedCustomers.length - 1) {
      // Remove from back
      newSelected = newSelected.concat(selectedCustomers.slice(0, -1));
    } else if (selectedIndex > 0) {
      // Remove from middle
      newSelected = newSelected.concat(
        selectedCustomers.slice(0, selectedIndex),
        selectedCustomers.slice(selectedIndex + 1)
      );
    }
    setSelectedCustomers(newSelected);
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={12} lg={8}>
          <MaterialTable
            icons={tableIcons}
            title={notification + ' customers'}
            columns={[
              {
                title: (
                  <Checkbox
                    indeterminate={
                      numCustomersSelected > 0 &&
                      numCustomersSelected < numCustomers
                    }
                    checked={
                      numCustomers > 0 && numCustomersSelected === numCustomers
                    }
                    onChange={handleSelectAllCustomersClick}
                    inputProps={{ 'aria-label': 'Select all customers' }}
                  />
                ),
                field: 'customer_uid',
                render: (rowData) => {
                  return (
                    <Checkbox
                      checked={customerIsSelected(rowData.customer_uid)}
                      onChange={(event) =>
                        handleChangeSelection(event, rowData.customer_uid)
                      }
                      inputProps={{
                        'aria-label':
                          'Select customer id ' + rowData.customer_uid,
                      }}
                    />
                  );
                },
              },
              {
                title: 'Name',
                field: 'customer_first_name',
                render: (rowData) => {
                  return (
                    rowData.customer_first_name +
                    ' ' +
                    rowData.customer_last_name
                  );
                },
              },
              { title: 'Email', field: 'customer_email' },
              { title: 'Phone', field: 'customer_phone_num' },
              { title: 'Address', field: 'address' },
              { title: 'City', field: 'customer_city' },
              { title: 'Zip', field: 'customer_zip' },
              { title: 'Business', field: 'business_name' },
              { title: '# Orders', field: 'number_of_orders' },
              { title: 'Last Order', field: 'latest_order_date' },
            ]}
            data={customerList}
            options={{
              // selection: true,
              pageSize: 10,
              pageSizeOptions: [10],
              rowStyle: { height: 10 },
              search: true,
            }}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <TextField
            multiline
            rows={30}
            value={message}
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setMessage(event.target.value);
            }}
            style={{
              padding: '0 20px',
            }}
          />
          <Grid container className={classes.buttonGroup}>
            <Grid item xs={6}>
              <Button
                disabled={message === '' || selectedCustomers.length === 0}
                variant="contained"
                onClick={() => {
                  console.log(notification);
                  // console.log(selectedCustomers)
                  console.log(message);
                  // Get remaining customer info of selected customers
                  let selectedCustomerInfo = customerList.filter(
                    (customerInfo) =>
                      selectedCustomers.indexOf(customerInfo.customer_uid) !==
                      -1
                  );
                  console.log(selectedCustomerInfo);
                  // Sending SMS
                  if (notification === 'SMS') {
                    // Get comma separated list of phone numbers of customers
                    let selectedPhoneNumbers = selectedCustomerInfo
                      .map((customerInfo) => customerInfo.customer_phone_num)
                      .toString();
                    console.log(selectedPhoneNumbers);
                    axios
                      .post(API_URL + 'Send_Twilio_SMS', {
                        message: message,
                        numbers: selectedPhoneNumbers,
                      })
                      .then((res) => {
                        console.log(res);
                      })
                      .catch((err) => {
                        if (err.response) {
                          console.log(err.response);
                        }
                        console.log(err);
                      });
                  } else if (notification === 'Notifications') {
                    // Get comma separated list of emails of customers
                    let selectedUids = selectedCustomerInfo
                      .map((customerInfo) => customerInfo.customer_uid)
                      .toString();
                    console.log(selectedUids);
                    let formData = new FormData();
                    formData.append('uids', selectedUids);
                    formData.append('message', message);
                    axios
                      .post(API_URL + 'Send_Notification/customer', formData)
                      .then((res) => {
                        console.log(res);
                      })
                      .catch((err) => {
                        if (err.response) {
                          console.log(err.response);
                        }
                        console.log(err);
                      });
                  } else {
                    console.log('Invalid notification type');
                  }
                }}
              >
                Send Notifications
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                disabled={message === ''}
                onClick={() => {
                  console.log(notification);
                  console.log(message);
                }}
              >
                Send to All
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default NotificationMain;
