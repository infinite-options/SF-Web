import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/export-data")(Highcharts);

function RevenueHighchart() {
	const newCustomers = [3, 1, 1, 0, 5, 3, 2, 2];
	const returnCustomers = [2, 3, 4, 1, 3, 1, 0, 4];
	const cumulativeProfit = [10, 29, 54, 57, 99, 115, 130, 155];
	const dailyRevenue = [10, 19, 25, 3, 42, 16, 15, 25];

	const options = {
		title: {
			text: "Revenue Analysis",
			align: "left",
		},
		exporting: {
			allowHTML: true,
			buttons: {
				contextButton: {
					menuItems: [
						"viewFullscreen",
						"printChart",
						"separator",
						"downloadPNG",
						"downloadJPEG",
						"downloadPDF",
						"downloadSVG",
					],
				},
			},
			enabled: true,
		},
		xAxis: [
			{
				categories: [
					"Jan",
					"Feb",
					"Mar",
					"Apr",
					"May",
					"Jun",
					"Jul",
					"Aug",
					"Sep",
					"Oct",
					"Nov",
					"Dec",
				],
				crosshair: true,
			},
		],
		yAxis: [
			{
				min: 0,
				title: {
					text: "Daily Revenue ($)",
				},
			},
			{
				min: 0,
				title: {
					text: "Cumulative Revenue ($)",
				},
			},
			{
				min: 0,
				title: {
					text: "Number of Customers",
				},
				opposite: true,
			},
		],
		// tooltip: {
		//     shared: true
		// },
		legend: {
			layout: "vertical",
			align: "left",
			x: 80,
			verticalAlign: "top",
			y: 55,
			floating: true,
			backgroundColor:
				Highcharts.defaultOptions.legend.backgroundColor || // theme
				"rgba(255,255,255,0.25)",
		},
		plotOptions: {
			column: {
				stacking: "normal",
			},
		},
		series: [
			{
				type: "column",
				name: "New Customers",
				showInLegend: false,
				data: newCustomers,
				tooltip: {
					pointFormat:
						"{series.name}: <b>{point.y}</b><br/>Total: <b>{point.stackTotal}</b>",
				},
				yAxis: 2,
			},
			{
				type: "column",
				name: "Return Customers",
				showInLegend: false,
				data: returnCustomers,
				tooltip: {
					pointFormat:
						"{series.name}: <b>{point.y}</b><br/>Total: <b>{point.stackTotal}</b>",
				},
				yAxis: 2,
			},
			{
				name: "Cumulative Revenue",
				showInLegend: false,
				data: cumulativeProfit,
				tooltip: {
					pointFormat: "{series.name}: <b>${point.y}</b>",
				},
				yAxis: 1,
			},
			{
				name: "Daily Revenue",
				showInLegend: false,
				data: dailyRevenue,
				tooltip: {
					pointFormat: "{series.name}: <b>${point.y}</b>",
				},
			},
		],
		responsive: {
			rules: [
				{
					condition: {
						maxWidth: 500,
					},
					chartOptions: {
						legend: {
							floating: false,
							layout: "horizontal",
							align: "center",
							verticalAlign: "bottom",
							x: 0,
							y: 0,
						},
						yAxis: [
							{
								labels: {
									align: "right",
									x: 0,
									y: -6,
								},
								showLastLabel: false,
							},
							{
								labels: {
									align: "left",
									x: 0,
									y: -6,
								},
								showLastLabel: false,
							},
							{
								visible: false,
							},
						],
					},
				},
			],
		},
	};

	return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default RevenueHighchart;
