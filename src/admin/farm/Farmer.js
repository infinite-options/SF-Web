import React, {Component, useContext, useState, useEffect} from "react";
import {AdminFarmContext} from "../AdminFarmContext";
// import axios from "axios";
import {
	Grid,
	Paper,
	Button,
	Typography,
	Card,
	CardMedia,
	CardContent,
	Modal,
	TextField,
	CircularProgress,
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import FarmerHome from "./FarmerHome";
import FarmerReport from "./FarmerReport";
import FarmerSettings from "./FarmerSettings";
import Chart from "./chart";
import Revenue from "./revenue";
import RevenueHighchat from "./RevenueHighchart";
import Notifications from './Notifications';
// import FarmerNavBar from './FarmerNavBar';

export default function Farmer({tab, ...props}) {
	const {farmID, setFarmID} = useContext(AdminFarmContext);

	const farmName = (() => {
		switch (farmID) {
			case "200-000003":
				return "Esquivel Farm";
			case "200-000004":
				return "Resendiz Family";
			default:
				return null;
		}
	})();

	/*
	 * tab values:
	 *   0 -> home
	 *   1 -> reports
	 *   2 -> settings
	 *   3 -> chart
	 *   4 -> revenue
	 * 	 5 -> messages
	 */

	// Home/Report/Settings Buttons do not redirect to another URL path,
	// instead the admin page renders each component based on the tag condition.
	// Tag value currently stored in localStorage.
	// Could have buttons redirect to an admin/reports, etc path,
	// if we don't like the localStorage conditional rendering way.
	//!The reason using css to display none is for the css file which can't be hidden by html
	const handleTab = () => {
		// 0 <= tab <= MAX_VALUE
		const tabIsValid = tab >= 0 && tab <= 5; // If more tabs are added, change max value
		return (
			<React.Fragment>
				{/* if farmerTab is tampered with & is out of scope, defaults to FarmerHome */}
				<FarmerHome
					farmID={farmID}
					farmName={farmName}
					hidden={tab !== 0 && tabIsValid}
				/>
				<FarmerReport farmID={farmID} farmName={farmName} hidden={tab !== 1} />
				<FarmerSettings
					farmID={farmID}
					farmName={farmName}
					hidden={tab !== 2}
				/>
				<div className={tab !== 3 ? "hideChart" : ""}>
					<Chart farmID={farmID} farmName={farmName} />
				</div>
				<div className={tab !== 4 ? "hideChart" : ""}>
					{/* <Revenue farmID={farmID} farmName={farmName} /> */}
					<RevenueHighchat farmID={farmID} farmName={farmName} />
				</div>
				<Notifications farmID={farmID} farmName={farmName} hidden={tab !== 5} />
			</React.Fragment>
		);
	};

	// No Paper for Notifications
	if(tab === 5) {
		return (
			<div>
				{handleTab()}
			</div>
		);
	}
	return (
		<div>
			<Paper style={paperStyle} elevation={0}>
				{/* <FarmerNavBar changeTab={setTab}/> */}
				{handleTab()}
			</Paper>
		</div>
	);
}
const paperStyle = {
	height: "2000px",
	width: "95%",
	maxWidth: "2000px",
	textAlign: "center",
	display: "inline-block",
	padding: "0px",
	marginTop: "30px",
	backgroundColor: "white",
};
