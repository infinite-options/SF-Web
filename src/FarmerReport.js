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
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        getFarmOrders();
    }, [farmID]);

    const getFarmOrders = async () => {
        const resOrders = await axios.get(ORDERS_INFO_URL).catch(err => { console.log(err.response || err) });
        // const resItems = await axios.get(ORDERS_BY_FARM_URL).catch(err => { console.log(err.response || err) });
        
        if (resOrders/* && resItems*/) {
            const orders = resOrders.data.result;
            // const items = resItems.data.result;
            console.log("Reports:", orders/*, items*/);
            setOrders(() => {
                const farmOrders = orders.filter(order => order.pur_business_uid === farmID);
                return farmOrders;
            });
        }
    };

    return (
        <div hidden={props.hidden}>
            <div style={labelStyle}>
                <h2>Open Orders</h2>
            </div>
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
                            if (order.delivery_status && order.delivery_status.toLowerCase() === "yes") {
                                const address = (() => {
                                    return `${order.delivery_address} ` + (order.delivery_unit ? `${order.delivery_unit} ` : "") + 
                                           `${order.delivery_city} ` + `${order.delivery_state} ` + `${order.delivery_zip} `;
                                })();
                                const hasPaid = (() => {
                                    const boolToString = String(order.amount_due === order.amount_paid);
                                    return boolToString.charAt(0).toUpperCase() + boolToString.slice(1);
                                })();

                                return (
                                    <TableRow key={idx}>
                                        <TableCell component="th" scope="row">{order.purchase_date}</TableCell>
                                        <TableCell>{order.delivery_first_name + " " + order.delivery_last_name}</TableCell>
                                        <TableCell>{order.delivery_email}</TableCell>
                                        <TableCell>{address}</TableCell>
                                        <TableCell>{order.delivery_phone_num}</TableCell>
                                        <TableCell>{order.amount_due}</TableCell>
                                        <TableCell>{JSON.parse(order.items)[0].qty}</TableCell>
                                        <TableCell>{hasPaid}</TableCell>
                                        <TableCell>
                                            <Button size="small" style={{ margin: "2px", backgroundColor: "#007bff", color: "white", padding: "2px 10px" }} variant="contained">Orders</Button><br />
                                            <Button size="small" style={{ margin: "2px", backgroundColor: "#6c757d", color: "white", padding: "2px 10px" }} variant="contained">Deliver</Button><br />
                                            <Button size="small" style={{ margin: "2px", backgroundColor: "#17a2b8", color: "white", padding: "2px 10px" }} variant="contained">Copy</Button><br />
                                            <Button size="small" style={{ margin: "2px", backgroundColor: "#dc3545", color: "white", padding: "2px 10px" }} variant="contained">Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            }
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={labelStyle}>
                <h2>Delivered Orders</h2>
            </div>
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
                            if (!order.delivery_status || order.delivery_status.toLowerCase() !== "yes") {
                                const address = (() => {
                                    return `${order.delivery_address} ` + (order.delivery_unit ? `${order.delivery_unit} ` : "") + 
                                           `${order.delivery_city} ` + `${order.delivery_state} ` + `${order.delivery_zip} `;
                                })();
                                const hasPaid = (() => {
                                    const boolToString = String(order.amount_due === order.amount_paid);
                                    return boolToString.charAt(0).toUpperCase() + boolToString.slice(1);
                                })();

                                return (
                                    <TableRow key={idx}>
                                        <TableCell component="th" scope="row">{order.purchase_date}</TableCell>
                                        <TableCell>{order.delivery_first_name + " " + order.delivery_last_name}</TableCell>
                                        <TableCell>{order.delivery_email}</TableCell>
                                        <TableCell>{address}</TableCell>
                                        <TableCell>{order.delivery_phone_num}</TableCell>
                                        <TableCell>{order.amount_due}</TableCell>
                                        <TableCell>{JSON.parse(order.items)[0].qty}</TableCell>
                                        <TableCell>{hasPaid}</TableCell>
                                        <TableCell>
                                            <Button size="small" style={{ margin: "2px", backgroundColor: "#007bff", color: "white", padding: "2px 10px" }} variant="contained">Orders</Button><br />
                                            <Button size="small" style={{ margin: "2px", backgroundColor: "#6c757d", color: "white", padding: "2px 10px" }} variant="contained">Cancel</Button><br />
                                            <Button size="small" style={{ margin: "2px", backgroundColor: "#17a2b8", color: "white", padding: "2px 10px" }} variant="contained">Copy</Button><br />
                                            <Button size="small" style={{ margin: "2px", backgroundColor: "#dc3545", color: "white", padding: "2px 10px" }} variant="contained">Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            }
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

// styling
const labelStyle = {
    backgroundColor: 'white',
    width: '80%',
    textAlign: 'left',
    marginLeft: '25px',
    marginBottom: '20px',
}
