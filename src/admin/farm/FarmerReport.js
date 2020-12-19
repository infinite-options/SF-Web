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
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useConfirmation } from '../../services/ConfirmationService';
import { AdminFarmContext } from '../AdminFarmContext';

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

const hours = {
  Friday: ['09:00:00', '10:00:00'],
  Monday: ['00:00:00', '00:00:00'],
  Sunday: ['08:00:00', '12:59:00'],
  Saturday: ['00:00:00', '00:00:00'],
  Thursday: ['00:00:00', '00:00:00'],
  Wednesday: ['08:00:00', '12:59:00'],
};

function formatDate(date) {
  var month = '' + (date.getMonth() + 1),
    day = '' + date.getDate(),
    year = date.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// TODO: Add auto-refresh
// DONE: Add Photo to report
// DONE: filter out farms
// DONE: checked report total calculations
// TODO: Take the next delivery day for summary report
// TODO: Add business price and item price (item only seen by admin)
export default function FarmerReport({
  farmID,
  farmName,
  deliveryTime,
  ...props
}) {
  // const [responseData, setResponseData] = useState();
  const [orders, setOrders] = useState([]);
  const classes = useStyles();
  const confirm = useConfirmation();

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
      start_delivery_date: '',
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

  const handleSendReport = (event) => {
    const { name } = event.currentTarget;
    let deliveryDate = '0000-01-01';

    console.log();
    var today = new Date();
    var dayIncr = 0;
    while (dayIncr < 7) {
      const fullDay = days[today.getDay()];
      if (fullDay === 'Sunday') {
        deliveryDate = formatDate(today);
        break;
      }
      dayIncr += 1;
      today.setDate(today.getDate() + 1);
    }

    if (deliveryDate !== '0000-01-01') {
      axios
        .post(BASE_URL + 'farmer_revenue_inventory_report/' + name, {
          uid: farmID,
          delivery_date: deliveryDate,
        })
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
      <div className={classes.reportButtonsSection}>
        <a
          href={
            'https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/report_order_customer_pivot_detail/order,' +
            farmID
          }
          className={classes.reportLink}
        >
          <Button variant="contained" className={classes.reportButtons}>
            Order Details
          </Button>
        </a>
        <a
          href={
            'https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/report_order_customer_pivot_detail/customer,' +
            farmID
          }
          className={classes.reportLink}
        >
          <Button variant="contained" className={classes.reportButtons}>
            Customer Details
          </Button>
        </a>
        <a
          href={
            'https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/report_order_customer_pivot_detail/pivot,' +
            farmID
          }
          className={classes.reportLink}
        >
          <Button variant="contained" className={classes.reportButtons}>
            Pivot Table
          </Button>
        </a>
      </div>
      {/* TODO: create two buttons for send packing and send summary */}
      <div className={classes.reportButtonsRightSection}>
        <Button
          variant="contained"
          name="summary"
          className={classes.reportButtons}
          onClick={handleSendReport}
        >
          Send Summary Report
        </Button>
        <Button
          variant="contained"
          name="packing"
          className={classes.reportButtons}
          onClick={handleSendReport}
        >
          Send Packing Report
        </Button>
      </div>
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
    </div>
  );
}

function OrdersTable({ orders, type, farmID, ...props }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Total ($)</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Payment Completed?</TableCell>
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

function OrderRow({ order, type, farmID, ...props }) {
  const [hidden, setHidden] = useState(true);
  const [total, setTotal] = useState(0);

  const address = (() => {
    return `${order.delivery_address} ${
      order.delivery_unit ? order.delivery_unit : ''
    }
            ${order.delivery_city} ${order.delivery_state} ${
      order.delivery_zip
    } `;
  })();
  useMemo(() => {
    var _total = 0;
    for (const item of JSON.parse(order.items)) {
      if (item.itm_business_uid === farmID) {
        _total += item.price * item.qty;
      }
    }
    setTotal(Math.round(_total * 100) / 100);
  }, [order]);

  const count = (() => {
    var _count = 0;
    for (const item of JSON.parse(order.items)) {
      if (item.itm_business_uid === farmID) {
        _count += 1;
      }
    }

    return _count;
  })();
  const hasPaid = (() => {
    const boolToString = String(order.amount_due === order.amount_paid);
    return boolToString.charAt(0).toUpperCase() + boolToString.slice(1);
  })();

  return (
    <React.Fragment>
      <TableRow>
        <TableCell component="th" scope="row">
          {order.purchase_date}
        </TableCell>
        <TableCell>
          {order.delivery_first_name + ' ' + order.delivery_last_name}
        </TableCell>
        <TableCell>{order.delivery_email}</TableCell>
        <TableCell>{address}</TableCell>
        <TableCell>{order.delivery_phone_num}</TableCell>
        <TableCell>{'$' + total.toFixed(2)}</TableCell>
        <TableCell>{count}</TableCell>
        <TableCell>{hasPaid}</TableCell>
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
          <Button
            size="small"
            variant="contained" // value="copy"
            style={{ ...tinyButtonStyle, backgroundColor: '#17a2b8' }}
            onClick={(e) => props.functions.handleCopy(e, order, props.index)}
          >
            copy
          </Button>
          <br />
          <Button
            size="small"
            variant="contained" // value="delete"
            style={{ ...tinyButtonStyle, backgroundColor: '#dc3545' }}
            onClick={(e) => props.functions.handleDelete(e, order, props.index)}
          >
            delete
          </Button>
          <br />
        </TableCell>
      </TableRow>
      {!hidden &&
        JSON.parse(order.items).map((item, idx) => {
          if (item.itm_business_uid === farmID)
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
  return (
    // {...(props.hidden ? { display: "none" } : {})}
    <TableRow>
      <TableCell colSpan={9}>
        <div style={{ border: '1px solid grey', padding: '0 10px' }}>
          <Box display="flex">
            <img style={{ width: '115px', height: '115px' }} src={item.img} />
            <Box>
              <h3>
                {item.name}{' '}
                {item.unit !== undefined && item.unit !== ''
                  ? '($' +
                    item.price.toFixed(2) +
                    ' ' +
                    (item.unit === 'each' ? '' : '/ ') +
                    item.unit +
                    ')'
                  : ''}
              </h3>
              <p>Quantity: {item.qty}</p>
              <p>Revenue: ${(item.price * item.qty).toFixed(2)}</p>
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
