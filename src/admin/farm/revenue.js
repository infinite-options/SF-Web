import React from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

function Revenue() {
	const series = [
		{
			name: "New Customer",
			type: "column",
			data: [3, 1, 1, 0, 5, 3, 2, 2],
			yAxis: 2,
		},
		{
			name: "Return Customer",
			type: "column",
			data: [2, 3, 4, 1, 3, 1, 0, 4],
			yAxis: 2,
		},
		{
			name: "Revenue(Daily)",
			type: "line",
			data: [10, 19, 25, 3, 42, 16, 15, 25],
		},
		{
			name: "Revenue(total)",
			type: "line",
			data: [10, 29, 54, 57, 99, 115, 130, 155],
			yAxis: 1,
		},
	];

	const options = {
		chart: {
			height: 350,
			type: "line",
			stacked: false,
		},
		dataLabels: {
			enabled: true,
			// style: {
			// 	colors: ["#F44336", "#E91E63", "#9C27B0", "#d789d7"],
			// },
		},
		stroke: {
			width: [1, 1, 4],
		},
		title: {
			text: "Revenue Serving Fresh Chart",
			align: "left",
			offsetX: 110,
		},
		xaxis: {
			categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
		},
		yaxis: [
			{
				chart: {
					height: 350,
					type: "line",
					stacked: true,
				},
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: true,
					color: "#008FFB",
				},
				labels: {
					style: {
						color: "#008FFB",
					},
				},
				title: {
					text: "New Customer (Person)",
					style: {
						fontSize: "15px",
						color: "#008FFB",
					},
				},
				tooltip: {
					enabled: true,
				},
			},
			{
				seriesName: "Return Customer",
				opposite: false,
				chart: {
					height: 350,
					type: "line",
					stacked: true,
				},
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: true,
					color: "#00E396",
				},
				labels: {
					style: {
						color: "#00E396",
					},
				},
				title: {
					text: "Return Customer (Person)",
					style: {
						fontSize: "15px",
						color: "#00E396",
					},
				},
			},
			{
				seriesName: "Revenue(Daily)",
				opposite: true,
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: true,
					color: "#FEB019",
				},
				labels: {
					style: {
						color: "#FEB019",
					},
				},
				title: {
					text: "Revenue Daily (in Dollar)",
					style: {
						fontSize: "15px",
						color: "#FEB019",
					},
				},
			},
			{
				seriesName: "Revenue(Total)",
				opposite: true,
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: true,
					color: "#ff414d",
				},
				labels: {
					style: {
						color: "#ff414d",
					},
				},
				title: {
					text: "Revenue Total (in Dollar)",
					style: {
						fontSize: "15px",
						color: "#ff414d",
					},
				},
			},
		],
		tooltip: {
			fixed: {
				enabled: true,
				position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
				offsetY: 30,
				offsetX: 60,
			},
		},
		legend: {
			horizontalAlign: "left",
			offsetX: 40,
		},
	};

	return (
		<div>
			<ReactApexChart
				options={options}
				series={series}
				type="line"
				height={700}
			/>
		</div>
	);
}

export default Revenue;
