import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback,
} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useConfirmation } from '../../services/ConfirmationService';
import { AdminFarmContext } from '../AdminFarmContext';
import { AuthContext } from 'auth/AuthContext';

const BASE_URL =
  'https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/';
// const ORDERS_INFO_URL = BASE_URL + "orders_info";
const ORDER_ACTIONS_URL = BASE_URL + 'order_actions/';
const INSERT_ORDER_URL = BASE_URL + 'purchase_Data_SF';
const ADMIN_ORDER_URL = BASE_URL + 'admin_report_groupby/';

const useStyles = makeStyles((theme) => ({
  // root: {
  //   flexGrow: 1,
  //   backgroundColor: 'white',
  // },
  reportLink: {
    textDecoration: 'none',
  },
  reportButtonsSection: {
    float: 'left',
    textAlign: 'left',
  },
  reportButtonsRightSection: {
    float: 'right',
    textAlign: 'right',
  },
  reportButtons: {
    marginLeft: theme.spacing(2),
  },
}));

function formatDate(date) {
  var month = (date.getMonth() + 1).toString(),
    day = date.getDate().toString(),
    year = date.getFullYear().toString();

  if (month.length === 1) month = '0' + month;
  if (day.length === 1) day = '0' + day;
  return [year, month, day].join('-');
}

const days = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

// const testDate = new Date('2021-01-06 09:00:00');
const testDate = new Date();

const findWeekdayDates = () => {
  const result = {};
  // const today = new Date();
  const today = new Date(testDate.getTime());
  let i = 0;
  while (i < 7) {
    result[days[today.getDay()]] = formatDate(today);
    today.setDate(today.getDate() + 1);
    i += 1;
  }
  return result;
};

const weekdayDatesDict = findWeekdayDates();

// TODO: Add auto-refresh
// DONE: Add Photo to report
// DONE: filter out farms
// DONE: checked report total calculations
// TODO: Take the next delivery day for summary report
// TODO: Add business price and item price (item only seen by admin)
// TODO: Add delivery instructions
export default function FarmerReport({
  farmID,
  farmName,
  deliveryTime,
  ...props
}) {
  // const [responseData, setResponseData] = useState();
  const classes = useStyles();
  const confirm = useConfirmation();
  const auth = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [deliveryDays, setDeliveryDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');

  useEffect(() => {
    axios
      .get(BASE_URL + 'business_delivery_details/' + farmID)
      .then((res) => {
        try {
          const businessSet = new Set();
          for (const business of res.data.result) {
            businessSet.add(business.z_delivery_day);
          }
          let dayList = [...businessSet];
          // dayList = days;

          if (dayList.length === 0 && farmID === 'all')
            dayList = ['SUNDAY', 'WEDNESDAY'];

          const dayDateList = [];
          for (const day of dayList) {
            dayDateList.push({ day: day, date: weekdayDatesDict[day] });
          }
          dayDateList.sort(function (a, b) {
            const aDate = new Date(a.date);
            const bDate = new Date(b.date);
            return aDate < bDate ? -1 : aDate > bDate ? 1 : 0;
          });
          dayList = dayDateList.map((dayDate) => {
            return dayDate.day;
          });

          if (dayList.length > 0) {
            setSelectedDay(dayList[0]);
          }

          setDeliveryDays(dayList);
        } catch {
          console.log('Error with retrieving business delivery days');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [farmID]);

  const handleDaySelect = (event) => {
    const { value } = event.target;
    setSelectedDay(value);
  };

  const getFarmOrders = useCallback(
    async (hasCopied = false) => {
      // if (responseData && !hasCopied) {
      //     updateOrders(responseData.orders/*, responseData.items*/);
      // }
      // else {
      // const resOrders = await axios.get(ORDERS_INFO_URL).catch(err => { console.log(err.response || err) });
      // // const resItems = await axios.get(ORDERS_BY_FARM_URL).catch(err => { console.log(err.response || err) });

      // if (resOrders/* && resItems*/) {
      //     const orders = resOrders.data.result;
      //     // const items = resItems.data.result;
      //     console.log("All Reports:", orders/*, items*/);
      //     setResponseData({ orders/*, items*/ });
      //     updateOrders(orders/*, items*/);
      // }
      // }
      axios
        .get(ADMIN_ORDER_URL + farmID)
        .then((res) => {
          let orders = res.data.result;
          console.log('All Report', orders);
          // setResponseData(orders);
          setOrders(orders);
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response);
          }
          console.log(err);
        });
    },
    [farmID]
  );

  useEffect(() => {
    getFarmOrders();
  }, [getFarmOrders]);

  // const updateOrders = (orders/*, items*/) => {
  //     // let farmOrders = orders.filter(order => order.pur_business_uid === farmID);
  //     // console.log('Farm orders', farmOrders)
  //     setOrders(orders);
  // };

  const handleShowOrders = (event, order, setHidden) => {
    console.log(JSON.parse(order.items));
    setHidden((prevBool) => !prevBool);
  };
  const handleDeliver = (event, order, index) => {
    axios
      .post(ORDER_ACTIONS_URL + 'delivery_status_YES', {
        purchase_uid: order.purchase_uid,
      })
      .then((response) => {
        console.log(response);

        const updatedOrder = { ...order };
        updatedOrder.delivery_status = 'TRUE';
        console.log(updatedOrder);

        setOrders((prevOrders) => {
          const updatedOrders = [...prevOrders];
          updatedOrders[index] = updatedOrder;
          return updatedOrders;
        });
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };
  const handleCancel = (event, order, index) => {
    axios
      .post(ORDER_ACTIONS_URL + 'delivery_status_NO', {
        purchase_uid: order.purchase_uid,
      })
      .then((response) => {
        console.log(response);

        const updatedOrder = { ...order };
        updatedOrder.delivery_status = 'FALSE';
        console.log(updatedOrder);

        setOrders((prevOrders) => {
          const updatedOrders = [...prevOrders];
          updatedOrders[index] = updatedOrder;
          return updatedOrders;
        });
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };
  const handleCopy = (event, order, index) => {
    const deliveryDay = weekdayDatesDict[deliveryDays[0]];
    const copiedOrder = {
      pur_customer_uid: order.pur_customer_uid,
      pur_business_uid: order.pur_business_uid,
      items: JSON.parse(order.items),
      order_instructions: order.order_instructions,
      delivery_instructions: order.delivery_instructions,
      order_type: order.order_type,
      delivery_first_name: order.delivery_first_name,
      delivery_last_name: order.delivery_last_name,
      delivery_phone_num: order.delivery_phone_num,
      delivery_email: order.delivery_email,
      delivery_address: order.delivery_address,
      delivery_unit: order.delivery_unit,
      delivery_city: order.delivery_city,
      delivery_state: order.delivery_state,
      delivery_zip: order.delivery_zip,
      delivery_latitude: order.delivery_latitude,
      delivery_longitude: order.delivery_longitude,
      purchase_notes: order.purchase_notes,
      start_delivery_date: deliveryDay,
      pay_coupon_id: '',
      amount_due: '',
      amount_discount: '',
      amount_paid: '',
      info_is_Addon: '',
      cc_num: '',
      cc_exp_date: '',
      cc_cvv: '',
      cc_zip: '',
      charge_id: '',
      payment_type: '',
      isCopy: 'True',
    };
    console.log(copiedOrder);
    axios
      .post(INSERT_ORDER_URL, copiedOrder)
      .then((response) => {
        console.log(response);
        // append orders list with new copied order
        getFarmOrders(true); // calls orders_info endpoint again
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };
  const handleDelete = (event, order, index) => {
    axios
      .post(ORDER_ACTIONS_URL + 'Delete', { purchase_uid: order.purchase_uid })
      .then((response) => {
        console.log(response);

        setOrders((prevOrders) => {
          const updatedOrders = [...prevOrders];
          updatedOrders.splice(index, 1);
          return updatedOrders;
        });
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };
  const handleItemDelete = (event, order, index, itemIndex) => {
    const updatedItemData = (() => {
      let items = JSON.parse(order.items);
      items.splice(itemIndex, 1);
      return items;
    })();
    console.log(order.purchase_uid, updatedItemData);
    axios
      .post(ORDER_ACTIONS_URL + 'item_delete', {
        purchase_uid: order.purchase_uid,
        item_data: updatedItemData,
      })
      .then((response) => {
        console.log(response);
        const updatedOrder = { ...order };
        updatedOrder.items = JSON.stringify(updatedItemData);
        console.log(updatedOrder);

        setOrders((prevOrders) => {
          const updatedOrders = [...prevOrders];
          updatedOrders[index] = updatedOrder;
          return updatedOrders;
        });
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };

  const nextDeliveryDay = (day) => {
    let deliveryDate = '0000-01-01';

    var today = new Date();
    var dayIncr = 0;
    while (dayIncr < 7) {
      const fullDay = days[today.getDay()];
      if (fullDay === day) {
        deliveryDate = formatDate(today);
        break;
      }
      dayIncr += 1;
      today.setDate(today.getDate() + 1);
    }
    return deliveryDate;
  };

  const handleSendReport = (event) => {
    const { name } = event.currentTarget;
    let deliveryDate = nextDeliveryDay(selectedDay);

    let string =
      BASE_URL +
      'farmer_revenue_inventory_report' +
      (farmID === 'all' ? '_all' : '') +
      '/' +
      name +
      ',' +
      deliveryDate;

    if (deliveryDate !== '0000-01-01') {
      if (farmID === 'all') {
        window.location =
          BASE_URL +
          'farmer_revenue_inventory_report' +
          (farmID === 'all' ? '_all' : '') +
          '/' +
          name +
          ',' +
          deliveryDate;
      } else {
        axios
          .post(
            BASE_URL +
              'farmer_revenue_inventory_report' +
              (farmID === 'all' ? '_all' : '') +
              '/' +
              name,
            {
              uid: farmID,
              delivery_date: deliveryDate,
            }
          )
          .then((res) => {
            confirm({
              variant: 'info',
              catchOnCancel: true,
              title: 'Email Sent',
              description:
                'Your ' +
                name +
                ' report has been successfully sent for ' +
                deliveryDate,
            });
          })
          .catch((err) => {
            console.log('Error: ', err);
            confirm({
              variant: 'info',
              catchOnCancel: true,
              title: 'Error!',
              description:
                'There was an error in sending your ' + name + ' report',
            });
          });
      }
    } else {
      confirm({
        variant: 'info',
        catchOnCancel: true,
        title: name + ' error',
        description:
          "There are no delivery days available for this farm's " +
          name +
          ' report.',
      });
    }
  };


  const handleDriverRoute = () => {
    console.log("In driver route", selectedDay, weekdayDatesDict[selectedDay])
    axios
      .post('https://rqiber37a4.execute-api.us-west-1.amazonaws.com/dev/api/v2/GetRoutes', {
        
          "farm_address":"1375 Blossom Hill Road",
          "farm_city":"San Jose",
          "farm_state":"CA",
          "farm_zip":"95118",
          "delivery_date": weekdayDatesDict[selectedDay] + " 10:00:00",
          //"delivery_date" : "2021-02-24 10:00:00",
          "db":"sf"
      
      })
      .then((response) => {
        console.log(response);
        console.log("hello", response["data"])
        if (response['data']['code'] == 280){
        confirm({
          variant: 'info',
          catchOnCancel: true,
          title: 'Route Generated',
          description:
            response['data']['message']
        });
      }
      else{
        confirm({
          variant: 'info',
          catchOnCancel: true,
          title: 'Error',
          description:
          response['message']
        });
      }
      })
      .catch((err) => {
        console.log("xxx",err.response["data"]["code"]);
        console.log(err.response || err);
        confirm({
          variant: 'info',
          catchOnCancel: true,
          title: 'Error',
          description:
          err.response['data']['message']
        });
        
      });

  }

  const buttonFunctions = {
    handleShowOrders,
    handleDeliver,
    handleCancel,
    handleCopy,
    handleDelete,
    handleItemDelete,
  };

  return (
    <div hidden={props.hidden}>
      <div style={labelStyle}>
        <h2>Open Orders</h2>
      </div>
      <Box display="flex" flexWrap="wrap">
        {/* Will Hide buttons */}
        <Box hidden={auth.authLevel !== 2}>
          {/* Will Show buttons */}
          {/* <Box> */}
          <a
            href={
              BASE_URL +
              'report_order_customer_pivot_detail/order' +
              (farmID === 'all' ? '_all' : '') +
              ',' +
              farmID +
              ',' +
              nextDeliveryDay(selectedDay)
            }
            target="_blank"
            rel="noreferrer"
            className={classes.reportLink}
          >
            <Button
              size="small"
              variant="contained"
              className={classes.reportButtons}
            >
              Order Details
            </Button>
          </a>
          <a
            href={
              BASE_URL +
              'report_order_customer_pivot_detail/customer' +
              (farmID === 'all' ? '_all' : '') +
              ',' +
              farmID +
              ',' +
              nextDeliveryDay(selectedDay)
            }
            target="_blank"
            rel="noreferrer"
            className={classes.reportLink}
          >
            <Button
              size="small"
              variant="contained"
              className={classes.reportButtons}
            >
              Customer Details
            </Button>
          </a>
          <a
            href={
              BASE_URL +
              'report_order_customer_pivot_detail/pivot' +
              (farmID === 'all' ? '_all' : '') +
              ',' +
              farmID +
              ',' +
              nextDeliveryDay(selectedDay)
            }
            target="_blank"
            rel="noreferrer"
            className={classes.reportLink}
          >
            <Button
              size="small"
              variant="contained"
              className={classes.reportButtons}
            >
              Pivot Table
            </Button>
          </a>
          <a
            href={
              BASE_URL +
              'drivers_report_check_sort/' +
              nextDeliveryDay(selectedDay) +
              ',checking'
            }
            target="_blank"
            rel="noreferrer"
            className={classes.reportLink}
          >
            <Button
              size="small"
              variant="contained"
              className={classes.reportButtons}
            >
              Driver Check
            </Button>
          </a>

          <a
            href={
              BASE_URL +
              'drivers_report_check_sort/' +
              nextDeliveryDay(selectedDay) +
              ',sorting'
            }
            target="_blank"
            rel="noreferrer"
            className={classes.reportLink}
          >
            <Button
              size="small"
              variant="contained"
              className={classes.reportButtons}
            >
              Driver Sort
            </Button>
          </a>
          <Button
              size="small"
              variant="contained"
              className={classes.reportButtons}
              onClick={handleDriverRoute}
            >
              Driver Route
            </Button>
        
        </Box>

        


        <Box flexGrow={1} />
        <Box display="flex" justifyContent="flex-end">
          {deliveryDays.length > 0 && (
            <Box mt={-2}>
              <FormHelperText>Delivery Day:</FormHelperText>
              <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                name="business"
                value={selectedDay}
                onChange={handleDaySelect}
              >
                {deliveryDays.map((day) => {
                  return (
                    <MenuItem key={day} value={day}>
                      {day + ' ' + weekdayDatesDict[day]}
                    </MenuItem>
                  );
                })}
              </Select>
            </Box>
          )}
          <div className={classes.reportButtonsRightSection}>
            <Button
              variant="contained"
              size="small"
              name="summary"
              className={classes.reportButtons}
              onClick={handleSendReport}
            >
              Send Summary Report
            </Button>
            <Button
              variant="contained"
              size="small"
              name="packing"
              className={classes.reportButtons}
              onClick={handleSendReport}
            >
              Send Packing Report
            </Button>
          </div>
        </Box>
        <OrdersTable
          orders={orders}
          farmID={farmID}
          type="FALSE"
          functions={buttonFunctions}
        />
        <div style={labelStyle}>
          <h2>Delivered Orders</h2>
        </div>
        <OrdersTable
          orders={orders}
          farmID={farmID}
          type="TRUE"
          functions={buttonFunctions}
        />
      </Box>
    </div>
  );
}

function OrdersTable({ orders, type, farmID, ...props }) {
  const auth = useContext(AuthContext);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Order Platform</TableCell>
            <TableCell>Purchase Date</TableCell>
            <TableCell>Delivery Date</TableCell>
            <TableCell>Name</TableCell>
            {auth.authLevel === 2 && <TableCell>Email</TableCell>}
            {auth.authLevel === 2 && <TableCell>Address</TableCell>}
            {auth.authLevel === 2 && <TableCell>Phone</TableCell>}
            <TableCell>Business Total ($)</TableCell>
            {auth.authLevel === 2 && <TableCell>Item Total ($)</TableCell>}
            {auth.authLevel === 2 && <TableCell>Amount Paid</TableCell>}
            <TableCell>Items</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order, idx) => {
            // !order.delivery_status && order.delivery_status.toLowerCase() !== "yes" :
            // order.delivery_status || order.delivery_status.toLowerCase() === "yes";

            if (type === order.delivery_status) {
              return (
                <OrderRow
                  key={idx}
                  farmID={farmID}
                  index={idx}
                  order={order}
                  type={type}
                  functions={props.functions}
                />
              );
            } else {
              return null;
            }
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function formatAmPm(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const dateComps = date.toString().split(' ');
  var strTime = hours + ':' + minutes + ' ' + ampm;
  var strDate =
    dateComps[0] +
    ', ' +
    dateComps[1] +
    ' ' +
    dateComps[2] +
    ', ' +
    dateComps[3];
  return strDate + ' at ' + strTime;
}

function OrderRow({ order, type, farmID, ...props }) {
  const auth = useContext(AuthContext);

  const [hidden, setHidden] = useState(true);
  const [businessTotal, setBusinessTotal] = useState(0);
  const [itemTotal, setItemTotal] = useState(0); // total for item price

  const address = (() => {
    return `${order.delivery_address} ${
      order.delivery_unit ? order.delivery_unit : ''
    }
            ${order.delivery_city} ${order.delivery_state} ${
      order.delivery_zip
    } `;
  })();
  useMemo(() => {
    var _businessTotal = 0;
    var _itemTotal = 0;
    for (const item of JSON.parse(order.items)) {
      if (item.itm_business_uid === farmID || farmID === 'all') {
        _itemTotal += parseFloat(item.price) * item.qty;
        _businessTotal += parseFloat(item.business_price || 0) * item.qty;
      }
    }
    setItemTotal(Math.round(_itemTotal * 100) / 100);
    setBusinessTotal(Math.round(_businessTotal * 100) / 100);
  }, [order]);

  const count = (() => {
    var _count = 0;
    for (const item of JSON.parse(order.items)) {
      if (item.itm_business_uid === farmID || farmID === 'all') {
        _count += 1;
      }
    }

    return _count;
  })();
  const hasPaid = (() => {
    const boolToString = String(order.amount_due === order.amount_paid);
    return boolToString.charAt(0).toUpperCase() + boolToString.slice(1);
  })();

  const purchaseDate = new Date(order.purchase_date + ' UTC');

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>{order.pur_business_uid}</TableCell>
        <TableCell component="th" scope="row">
          {formatAmPm(purchaseDate)}
        </TableCell>
        <TableCell component="th" scope="row">
          {formatAmPm(new Date(order.start_delivery_date))}
        </TableCell>
        <TableCell>
          {order.delivery_first_name + ' ' + order.delivery_last_name}
        </TableCell>
        {auth.authLevel === 2 && <TableCell>{order.delivery_email}</TableCell>}
        {auth.authLevel === 2 && <TableCell>{address}</TableCell>}
        {auth.authLevel === 2 && (
          <TableCell>{order.delivery_phone_num}</TableCell>
        )}
        <TableCell>{'$' + businessTotal}</TableCell>
        {auth.authLevel === 2 && <TableCell>{'$' + itemTotal}</TableCell>}
        {auth.authLevel === 2 && (
          <TableCell>{'$' + order.amount_paid}</TableCell>
        )}
        <TableCell>{count}</TableCell>

        <TableCell>
          <Button
            size="small"
            variant="contained" // value="orders"
            style={{ ...tinyButtonStyle, backgroundColor: '#007bff' }}
            onClick={(e) =>
              props.functions.handleShowOrders(e, order, setHidden)
            }
          >
            orders
          </Button>
          <br />
          <Button
            size="small"
            variant="contained" // value="cancel"
            style={{ ...tinyButtonStyle, backgroundColor: '#6c757d' }}
            onClick={(e) =>
              props.functions[
                type === 'FALSE' ? 'handleDeliver' : 'handleCancel'
              ](e, order, props.index)
            }
          >
            {type === 'FALSE' ? 'deliver' : 'cancel'}
          </Button>
          <br />
          {farmID === 'all' && (
            <>
              <Button
                size="small"
                variant="contained" // value="copy"
                style={{ ...tinyButtonStyle, backgroundColor: '#17a2b8' }}
                onClick={(e) =>
                  props.functions.handleCopy(e, order, props.index)
                }
              >
                copy
              </Button>
              <br />
              <Button
                size="small"
                variant="contained" // value="delete"
                style={{ ...tinyButtonStyle, backgroundColor: '#dc3545' }}
                onClick={(e) =>
                  props.functions.handleDelete(e, order, props.index)
                }
              >
                delete
              </Button>
            </>
          )}
          <br />
        </TableCell>
      </TableRow>
      {!hidden &&
        JSON.parse(order.items).map((item, idx) => {
          if (item.itm_business_uid === farmID || farmID === 'all')
            return (
              <OrderItem
                key={idx}
                order={order}
                item={item}
                deleteItem={props.functions.handleItemDelete}
                index={props.index}
                itemIndex={idx}
              />
            );
        })}
    </React.Fragment>
  );
}

function OrderItem({ order, item, deleteItem, ...props }) {
  const itemPrice = parseFloat(item.price);
  const businessPrice = parseFloat(item.business_price);
  const auth = useContext(AuthContext);
  const { farmDict } = useContext(AdminFarmContext);

  return (
    // {...(props.hidden ? { display: "none" } : {})}
    <TableRow>
      <TableCell colSpan={100}>
        <div style={{ border: '1px solid grey', padding: '0 10px' }}>
          <Box display="flex">
            <img
              alt="item"
              style={{
                marginTop: 'auto',
                marginBottom: 'auto',
                marginRight: '10px',
                width: '130px',
                height: '130px',
              }}
              src={item.img}
            />
            <Box>
              <h3>
                {item.name}{' '}
                {item.unit !== undefined && item.unit !== ''
                  ? '- $' +
                    businessPrice.toFixed(2) +
                    (auth.authLevel === 2
                      ? '(b) / $' + itemPrice.toFixed(2) + '(i) '
                      : ' ') +
                    (item.unit === 'each' ? '' : '/ ') +
                    item.unit
                  : ''}
              </h3>
              {auth.authLevel === 2 && (
                <Box>
                  Business: {farmDict[item.itm_business_uid] || '(removed)'}
                </Box>
              )}
              <Box>Quantity: {item.qty}</Box>
              <Box>
                Business Revenue: ${(businessPrice * item.qty).toFixed(2)}
              </Box>
              {auth.authLevel === 2 && (
                <Box>Item Revenue: ${(itemPrice * item.qty).toFixed(2)}</Box>
              )}
            </Box>
            <Box flexGrow={1} />
            <Button
              style={{
                ...tinyButtonStyle,
                float: 'right',
                height: '30px',
                marginTop: 'auto',
                marginBottom: 'auto',
                backgroundColor: '#dc3545',
              }}
              onClick={(e) =>
                deleteItem(e, order, props.index, props.itemIndex)
              }
            >
              Delete
            </Button>
          </Box>
        </div>
      </TableCell>
    </TableRow>
  );
}

// styling
const labelStyle = {
  backgroundColor: 'white',
  width: '80%',
  textAlign: 'left',
  marginLeft: '25px',
  marginBottom: '20px',
};

const tinyButtonStyle = {
  margin: '2px',
  color: 'white',
  padding: '2px 10px',
};
