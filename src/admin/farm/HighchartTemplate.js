import React, { useEffect, useState, useContext } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

const report_API =
  'https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/admin_report/';

const useStyles = makeStyles((theme) => ({
  button: {
    display: 'block',
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

// TODO: add dropdown for farms / all and date range / all
function RevenueHighchart() {
  const [chartData, setChartData] = useState({});
  const [dataError, setError] = useState(false);
  const [listOfDates, setDates] = useState([]);
  const [listOfBuyers, setListOfBuyers] = useState([]);
  const [listOfCumRevenue, setCumRenevue] = useState([]);
  const [listOfDailyRevenue, setDailyRevenue] = useState([]);
  const [businessID, setBusinessId] = useState('all');

  const classes = useStyles();
  const [barsType, setBarType] = useState('customer');

  const handleChange = (event) => {
    const { value, name } = event.target;
    if (name === 'type') setBarType(value);
    else if (name === 'business') setBusinessId(value);
  };

  // TODO: First need to get all the dates that has customer activities, sort them
  // TODO: Get code from Allan
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
        let dayDict = {};
        let dayArr = [];
        theData.map((days) => {
          let tempDays = days.purchase_date.substring(0, 10);
          if (!(tempDays in dayDict)) {
            dayArr.push(tempDays);
            dayDict[tempDays] = [];
          }
          dayDict[tempDays].push(days);
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
        let buyerDict = {};
        let customers = [];
        let cIdx = 0;
        const nullData = new Array(dayArr.length).fill(null);
        let dailyIncome = new Array(dayArr.length).fill(0);
        let revenue = new Array(dayArr.length).fill(0);
        let total = 0;

        for (const dayIdx in dayArr) {
          let dailyProfit = 0;
          for (const purchase of dayDict[dayArr[dayIdx]]) {
            let barValue = '';
            switch (barsType) {
              case 'customer':
                barValue =
                  purchase.delivery_first_name +
                  ' ' +
                  purchase.delivery_last_name;
                break;
              case 'item':
                barValue = purchase.item_name;
                break;
              default:
                break;
            }

            const amountSpent = Math.round(purchase.Amount * 100) / 100;

            if (barValue in buyerDict) {
              customers[buyerDict[barValue]].data[dayIdx] += amountSpent;
            } else {
              buyerDict[barValue] = cIdx;
              const customerData = {
                type: 'column',
                name: barValue,
                showInLegend: true,
                data: [...nullData],
                tooltip: {
                  pointFormat:
                    '{series.name}: <b>{point.y}</b><br/>Total: <b>{point.stackTotal}</b>',
                },
                yAxis: 0,
              };
              customerData.data[dayIdx] = amountSpent;
              customers.push(customerData);
              cIdx += 1;
            }
            dailyProfit += amountSpent;
            dailyProfit = Math.round(dailyProfit * 100) / 100;
            if (amountSpent > 17 && amountSpent < 18) {
              const fixed = Math.round(purchase.Amount * 100) / 100;

              console.log(fixed, purchase.Amount);
            }
          }

          total += dailyProfit;
          total = Math.round(total * 100) / 100;
          dailyIncome[dayIdx] = dailyProfit;
          revenue[dayIdx] = total;
        }

        setListOfBuyers(customers);
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
  }, [businessID, barsType]);

  const options = {
    chart: { height: '900px' },
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
          text: 'Date',
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
        stacking: 'normal',
      },
    },
    series: [
      ...listOfBuyers,
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

  return (
    <>
      <Box>
        <FormControl className={classes.formControl}>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            name="business"
            value={businessID}
            onChange={handleChange}
          >
            <MenuItem value={'customer'}>Customer</MenuItem>
            <MenuItem value={'item'}>Item</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            name="type"
            value={barsType}
            onChange={handleChange}
          >
            <MenuItem value={'customer'}>Customer</MenuItem>
            <MenuItem value={'item'}>Item</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <HighchartsReact highcharts={Highcharts} options={options} />{' '}
    </>
  );
}

export default RevenueHighchart;
