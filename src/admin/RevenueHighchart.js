import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

const report_API =
  'https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/admin_report/';

// TODO: add dropdown for farms / all and date range / all
function RevenueHighchart() {
  const [chartData, setChartData] = useState({});
  const [dataError, setError] = useState(false);
  const [listOfDates, setDates] = useState([]);
  const [listOfNewBuyer, setNew] = useState([]);
  const [listOfReturner, setOld] = useState([]);
  const [listOfCumRevenue, setCumRenevue] = useState([]);
  const [listOfDailyRevenue, setDailyRevenue] = useState([]);
  let businessID = '200-000016';

  //todo:First need to get all the dates that has customer activities, sort them
  // const newCustomers = [3, 1, 1, 0, 5, 3];
  // const returnCustomers = [2, 3, 4, 1, 3, 1];
  // const cumulativeProfit = [10, 29, 54, 57, 99, 115];
  // const dailyRevenue = [10, 19, 25, 3, 42, 16];

  useEffect(() => {
    axios
      .get(report_API + businessID)
      .then((res) => {
        let theData = res.data.result;
        setChartData(theData);
        console.log(theData);

        //todo: get list of dates
        let dayArr = [];
        theData.map((days) => {
          let tempDays = days.purchase_date.substring(0, 10);
          !dayArr.includes(tempDays) && dayArr.push(tempDays);
        });
        dayArr.sort(function (a, b) {
          a = a.split('-').join('');
          b = b.split('-').join('');
          return a > b ? 1 : a < b ? -1 : 0;
          // return a.localeCompare(b);         // <-- alternative
        });
        console.log(dayArr); //!comment out
        setDates(dayArr);

        //Todo: atfter getting all the dates, we get the buyer next
        //todo (returner or new customers)
        let buyerContainer = [];
        let oldCustomer = new Array(dayArr.length).fill(0);
        let newCustomer = new Array(dayArr.length).fill(0);
        let dailyIncome = new Array(dayArr.length).fill(0);
        let revenue = new Array(dayArr.length).fill(0);
        let total = 0;

        for (var i = 0; i < dayArr.length; i++) {
          let displayArrayOfDate = theData.filter((aDate) => {
            //!each of this will be one day
            return aDate.purchase_date.substring(0, 10) === dayArr[i];
          });

          let dailyProfit = 0;

          for (var j = 0; j < displayArrayOfDate.length; j++) {
            if (
              buyerContainer.includes(displayArrayOfDate[j].pur_customer_uid)
            ) {
              oldCustomer[i] += 1;
            } else {
              buyerContainer.push(displayArrayOfDate[j].pur_customer_uid);
              newCustomer[i] += 1;
            }

            dailyProfit += parseInt(displayArrayOfDate[j].Amount);
          }
          total += dailyProfit;
          dailyIncome[i] = dailyProfit;
          revenue[i] = total;
        }
        setNew(newCustomer);
        setOld(oldCustomer);
        setCumRenevue(revenue);
        setDailyRevenue(dailyIncome);
        // console.log("buyerContainer ", buyerContainer);
        // console.log("retuners ", oldCustomer);
        // console.log("NewBuyer ", newCustomer);
      })
      .catch((err) => {
        console.log('The error is from Highchart.js: ', err);
        setError(true);
      });
  }, [businessID]);

  const options = {
    title: {
      text: 'Revenue Analysis',
      align: 'left',
    },
    exporting: {
      allowHTML: true,
      buttons: {
        contextButton: {
          menuItems: [
            'viewFullscreen',
            'printChart',
            'separator',
            'downloadPNG',
            'downloadJPEG',
            'downloadPDF',
            'downloadSVG',
          ],
        },
      },
      enabled: true,
    },
    xAxis: [
      {
        title: {
          text: 'Purchase Date',
          style: {
            color: 'gray',
          },
        },
        categories: listOfDates,
        crosshair: true,
      },
    ],
    yAxis: [
      {
        min: 0,
        title: {
          text: 'Number of Customers',
          style: {
            color: '#f56a79',
          },
        },
        // labels: {
        // 	style: {
        // 		fontSize: "19px",
        // 	},
        // },
        opposite: false,
      },
      {
        min: 0,
        title: {
          text: 'Daily Revenue ($)',
          style: {
            color: '#f08a5d',
          },
        },
        opposite: true,
      },
      {
        min: 0,
        title: {
          text: 'Cumulative Revenue ($)',
          style: {
            color: '#32e0c4',
          },
        },
        opposite: true,
      },
    ],
    // tooltip: {
    //     shared: true
    // },
    legend: {
      layout: 'vertical',
      align: 'left',
      x: 80,
      verticalAlign: 'top',
      y: 55,
      floating: true,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || // theme
        'rgba(255,255,255,0.25)',
    },
    plotOptions: {
      column: {
        // stacking: 'normal',
      },
    },
    series: [
      {
        type: 'column',
        name: 'New Customers',
        showInLegend: false,
        data: listOfNewBuyer,
        tooltip: {
          pointFormat:
            '{series.name}: <b>{point.y}</b><br/>Total: <b>{point.stackTotal}</b>',
        },
        yAxis: 0,
      },
      {
        type: 'column',
        name: 'Return Customers',
        showInLegend: false,
        data: listOfReturner,
        tooltip: {
          pointFormat:
            '{series.name}: <b>{point.y}</b><br/>Total: <b>{point.stackTotal}</b>',
        },
        yAxis: 0,
      },
      {
        name: 'Cumulative Revenue',
        showInLegend: false,
        data: listOfCumRevenue,
        tooltip: {
          pointFormat: '{series.name}: <b>${point.y}</b>',
        },
        yAxis: 2,
      },
      {
        name: 'Daily Revenue',
        showInLegend: false,
        data: listOfDailyRevenue,
        tooltip: {
          pointFormat: '{series.name}: <b>${point.y}</b>',
        },
        yAxis: 1,
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
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
              x: 0,
              y: 0,
            },
            yAxis: [
              {
                labels: {
                  align: 'right',
                  x: 0,
                  y: -6,
                },
                showLastLabel: false,
              },
              {
                labels: {
                  align: 'left',
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
