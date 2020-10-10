import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';

const BASE_URL = "https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/";
const ORDERS_INFO_URL = BASE_URL + "orders_info";
const ORDERS_BY_FARM_URL = BASE_URL + "orders_by_farm";

export default function FarmerReport({ farmID, farmName, ...props }) {
    const [responseData, setResponseData] = useState();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        getFarmOrders();
    }, [farmID]);

    const getFarmOrders = async () => {
        if (responseData) {
            updateOrders(responseData.orders, responseData.items);
        }
        else {
            const resOrders = await axios.get(ORDERS_INFO_URL).catch(err => { console.log(err.response || err) });
            // const resItems = await axios.get(ORDERS_BY_FARM_URL).catch(err => { console.log(err.response || err) });
            
            if (resOrders/* && resItems*/) {
                const orders = resOrders.data.result;
                // const items = resItems.data.result;
                console.log("Reports:", orders/*, items*/);
                setResponseData({ orders/*, items*/ });
                updateOrders(orders/*, items*/);
            }
        }
    };

    const updateOrders = (orders/*, items*/) => {
        const items = [];
        setOrders(() => {
            // const farmOrders = Array.from(
            //     orders.filter(order => order.pur_business_uid === farmID),
            //     order => {
            //         const itemUIDs = Array.from(JSON.parse(order.items), item => item.item_uid);
            //         const itemList = items.filter(item => {
            //             return item.purchase_uid === order.purchase_uid && itemUIDs.includes(item["deconstruct.item_uid"]);
            //         });
            //         order.list = itemList;
            //         return order;
            //     }
            // );
            // console.log(farmOrders);
            const farmOrders = orders.filter(order => order.pur_business_uid === farmID);
            return farmOrders;
        });
    };

    const handleShowOrders = (event, order, hideFunc) => {
        console.log(JSON.parse(order.items));
        hideFunc(prevBool => !prevBool);
    };
    const handleDeliver = (event, order) => {
        console.log("W I P 2.1");
    };
    const handleCancel = (event, order) => {
        console.log("W I P 2.2");
    };
    const handleCopy = (event, order) => {
        console.log("W I P 3");
    };
    const handleDelete = (event, order) => {
        console.log("W I P 4");
    };

    const buttonFunctions = { 
        handleShowOrders, handleDeliver, 
        handleCancel, handleCopy, handleDelete, 
    };

    return (
        <div hidden={props.hidden}>
            <div style={labelStyle}>
                <h2>Open Orders</h2>
            </div>
            <OrdersTable orders={orders} type="open" functions={buttonFunctions} />
            <div style={labelStyle}>
                <h2>Delivered Orders</h2>
            </div>
            <OrdersTable orders={orders} type="delivered" functions={buttonFunctions} />
        </div>
    )
}

function OrdersTable({ orders, type, ...props }) {

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
                        const isDisplayed = type === "open" ? 
                            order.delivery_status && order.delivery_status.toLowerCase() === "yes" :
                            !order.delivery_status || order.delivery_status.toLowerCase() !== "yes";
                        
                        if (isDisplayed) {
                            return <OrderRow key={idx} order={order} type={type} functions={props.functions} />
                        }
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

function OrderRow({ order, type, ...props }) {
    const [hidden, setHidden] = useState(true);

    const address = (() => {
        return `${order.delivery_address} ` + (order.delivery_unit ? `${order.delivery_unit} ` : "") + 
            `${order.delivery_city} ` + `${order.delivery_state} ` + `${order.delivery_zip} `;
    })();
    const count = (() => {
        // let result = 0;
        // JSON.parse(order.items).forEach(item => result += Number(item.qty));
        // return result;

        return JSON.parse(order.items).length;
    })();
    const hasPaid = (() => {
        const boolToString = String(order.amount_due === order.amount_paid);
        return boolToString.charAt(0).toUpperCase() + boolToString.slice(1);
    })();

    return (
        <React.Fragment>
            <TableRow>
                <TableCell component="th" scope="row">{order.purchase_date}</TableCell>
                <TableCell>{order.delivery_first_name + " " + order.delivery_last_name}</TableCell>
                <TableCell>{order.delivery_email}</TableCell>
                <TableCell>{address}</TableCell>
                <TableCell>{order.delivery_phone_num}</TableCell>
                <TableCell>{order.amount_due}</TableCell>
                <TableCell>{count}</TableCell>
                <TableCell>{hasPaid}</TableCell>
                <TableCell>
                    <Button 
                        size="small" variant="contained"// value="orders"
                        style={{ ...tinyButtonStyle, backgroundColor: "#007bff" }} 
                        onClick={e => props.functions.handleShowOrders(e, order, setHidden)}
                    >orders</Button><br />
                    <Button 
                        size="small" variant="contained"// value="cancel"
                        style={{ ...tinyButtonStyle, backgroundColor: "#6c757d" }} 
                        onClick={e => props.functions[type === "open" ? "handleDeliver" : "handleCancel"](e, order)} 
                    >{type === "open" ? "deliver" : "cancel"}</Button><br />
                    <Button 
                        size="small" variant="contained"// value="copy"
                        style={{ ...tinyButtonStyle, backgroundColor: "#17a2b8" }} 
                        onClick={e => props.functions.handleCopy(e, order)} 
                    >copy</Button><br />
                    <Button 
                        size="small" variant="contained"// value="delete"
                        style={{ ...tinyButtonStyle, backgroundColor: "#dc3545" }} 
                        onClick={e => props.functions.handleDelete(e, order)} 
                    >delete</Button><br />
                </TableCell>
            </TableRow>
            {!hidden && JSON.parse(order.items).map((item, idx) => (
                <OrderItem key={idx} item={item} />
            ))}
        </React.Fragment>
    );
};

function OrderItem({ item, ...props }) {

    return (
        // {...(props.hidden ? { display: "none" } : {})}
        <TableRow>
            <TableCell colSpan={9}>
                <div style={{ border: "1px solid grey", padding: "0 10px" }}>
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.qty}</p>
                    <p>Revenue: ${(item.price * item.qty).toFixed(2)}</p>
                </div>
            </TableCell>
            {/* <TableCell /><TableCell /><TableCell /><TableCell />
            <TableCell /><TableCell /><TableCell /><TableCell /> */}
        </TableRow>
    );
};

// styling
const labelStyle = {
    backgroundColor: 'white',
    width: '80%',
    textAlign: 'left',
    marginLeft: '25px',
    marginBottom: '20px',
}

const tinyButtonStyle = { 
    margin: "2px", 
    color: "white", 
    padding: "2px 10px", 
}
