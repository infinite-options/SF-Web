import React, { useEffect, useState, useContext } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import {
  DateRangePicker,
  DateRange,
  DateRangeDelimiter,
} from '@material-ui/pickers';
import makeStyles from '@material-ui/core/styles/makeStyles';
import FormHelperText from '@material-ui/core/FormHelperText';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { AdminFarmContext } from './AdminFarmContext';

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

const fields = {
  business: 'deconstruct.itm_business_uid',
  item: 'deconstruct.name',
  date: 'purchase_date',
};

// TODO: add dropdown for farms / all and date range / all
// TODO: Add Date Bar Category
function Analytics() {
  const classes = useStyles();
  const { farmList, farmDict } = useContext(AdminFarmContext);

  const [startDate, setStartDate] = React.useState(new Date('2020-11-25'));
  const [endDate, setEndDate] = React.useState(new Date());

  const [chartData, setChartData] = useState({});
  const [dataError, setError] = useState(false);

  const [listOfDates, setDates] = useState([]);
  const [listOfBuyers, setListOfBuyers] = useState([]);
  const [listOfNumCateg, setListOfNumCateg] = useState([]);

  const [businessID, setBusinessId] = useState('all');
  const [purchasesRes, setPurchasesRes] = useState([]);

  // deconstruct.name is the item name
  const [barsType, setBarType] = useState(fields.item);
  const [priceType, setPriceType] = useState('item');

  const handleChange = (event) => {
    const { value, name } = event.target;
    if (name === 'type') setBarType(value);
    else if (name === 'business') setBusinessId(value);
    else if (name === 'price') setPriceType(value);
  };

  // TODO: Configure number of purchases field
  // TODO: First need to get all the dates that has customer activities, sort them
  // TODO: Get code from Allan
  // DONE: 1. Add business
  // DONE: 2. Fix Bug
  // DONE: 3. Add businesses pull down
  // TODO: 4. Add numbers to top
  // TODO: 5. Add Date ranges
  // const newCustomers = [3, 1, 1, 0, 5, 3];
  // const returnCustomers = [2, 3, 4, 1, 3, 1];
  // const cumulativeProfit = [10, 29, 54, 57, 99, 115];
  // const dailyRevenue = [10, 19, 25, 3, 42, 16];

  useEffect(() => {
    axios
      .get(report_API + businessID)
      .then((res) => {
        setPurchasesRes(res.data.result);
      })
      .catch((err) => {
        console.log('The error is from Highchart.js: ', err);
        setError(true);
      });
  }, [businessID]);

  useEffect(() => {
    if (purchasesRes.length > 0 || businessID !== 'all')
      loadSeriesData(purchasesRes);
  }, [farmDict, barsType, priceType, purchasesRes]);

  function loadSeriesData(res) {
    let theData = res;
    setChartData(theData);
    console.log(theData);

    //todo: get list of dates
    let custAmnDict = {};
    let custDict = {};
    let cIdx = 0;
    let custAmnArr = [];
    let custArr = [];
    theData.map((purchase) => {
      let custName = (
        purchase.delivery_first_name +
        ' ' +
        purchase.delivery_last_name +
        ' ' +
        purchase.pur_customer_uid
      ).trim();
      if (custName in custDict) {
        custAmnArr[custAmnDict[custName]].amount +=
          purchase[priceType + '_amount'];
      } else {
        custAmnArr.push({
          name: custName,
          amount: purchase[priceType + '_amount'],
        });
        custDict[custName] = [];
        custAmnDict[custName] = cIdx;
        cIdx += 1;
      }
      custDict[custName].push(purchase);
    });
    custAmnArr.sort(function (a, b) {
      a = a.amount;
      b = b.amount;
      return a > b ? 1 : a < b ? -1 : 0;
      // return a.localeCompare(b);         // <-- alternative
    });

    custArr = custAmnArr.map((customer) => {
      return customer.name;
    });
    setDates(custArr);

    //TODO: after getting all the dates, we get the buyer next
    //todo (returner or new customers)
    let barDict = {};
    let purchases = [];
    let purchaseIdSet = new Set();
    cIdx = 0;
    const numPurchases = new Array(custArr.length).fill(0);
    const nullData = new Array(custArr.length).fill(0);
    let total = 0;

    for (const custIdx in custArr) {
      let dailyProfit = 0;
      for (const purchase of custDict[custArr[custIdx]]) {
        var barValue = purchase[barsType];

        if (barsType === fields.date) {
          barValue = barValue.substring(0, 7);
        }
        const amountSpent =
          Math.round(purchase[priceType + '_amount'] * 100) / 100;

        if (barValue in barDict) {
          purchases[barDict[barValue]].data[custIdx] += amountSpent;
          purchases[barDict[barValue]].data[custIdx] =
            Math.round(purchases[barDict[barValue]].data[custIdx] * 100) / 100;
          if (!purchaseIdSet.has(purchase.purchase_uid)) {
            numPurchases[custIdx] += 1;
            purchaseIdSet.add(purchase.purchase_uid);
          }
        } else {
          barDict[barValue] = cIdx;
          const barData = {
            type: 'column',
            name: barsType === fields.business ? farmDict[barValue] : barValue,
            showInLegend: barsType === fields.item ? false : true,
            data: [...nullData],
            tooltip: {
              pointFormat:
                '{series.name}: <b>{point.y}</b><br/>Total: <b>{point.stackTotal}</b>',
            },
            yAxis: 0,
          };
          barData.data[custIdx] = amountSpent;
          purchases.push(barData);
          cIdx += 1;
          if (!purchaseIdSet.has(purchase.purchase_uid)) {
            numPurchases[custIdx] += 1;
            purchaseIdSet.add(purchase.purchase_uid);
          }
        }
        dailyProfit += amountSpent;
        dailyProfit = Math.round(dailyProfit * 100) / 100;
      }
    }

    setListOfBuyers(purchases);
    setListOfNumCateg(numPurchases);
    // console.log("buyerContainer ", buyerContainer);
    // console.log("retuners ", oldCustomer);
    // console.log("NewBuyer ", newCustomer);
  }

  const options = {
    chart: { height: '900px' },
    title: {
      text: 'Customer Analytics',
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
          text: 'Customer',
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
          text: barsType + ' purchase amount',
          style: {
            color: '#f56a79',
          },
        },
        opposite: false,
      },
      {
        min: 0,
        title: {
          text: 'Number of purchases',
          style: {
            color: '#000',
          },
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: 'black',
          },
        },
        opposite: true,
      },
    ],
    // tooltip: {
    //     shared: true
    // },
    legend: {
      layout: 'horizontal',
      align: 'left',
      x: 80,
      verticalAlign: 'top',
      y: 10,
      floating: true,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || // theme
        'rgba(255,255,255,0.25)',
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: false,
        },
      },
    },
    series: [
      ...listOfBuyers,
      {
        type: 'scatter',
        name: 'Number of purchases',
        showInLegend: false,
        data: listOfNumCateg,
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b><br/>',
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
      <Box display="flex" justifyContent="center">
        <FormControl className={classes.formControl}>
          <FormHelperText>Business</FormHelperText>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            name="business"
            value={businessID}
            onChange={handleChange}
          >
            <MenuItem value={'all'}>All</MenuItem>
            {farmList.map((farm) => {
              return (
                <MenuItem key={farm.business_uid} value={farm.business_uid}>
                  {farm.business_name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <FormHelperText>Graph Type</FormHelperText>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            name="type"
            value={barsType}
            onChange={handleChange}
          >
            <MenuItem value={fields.item}>Item</MenuItem>
            <MenuItem value={fields.business}>Business</MenuItem>
            <MenuItem value={fields.date}>Date</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <FormHelperText>Price Type</FormHelperText>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            label="Select Price Type"
            name="price"
            value={priceType}
            onChange={handleChange}
          >
            <MenuItem value={'item'}>Item</MenuItem>
            <MenuItem value={'business'}>Business</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
}

export default Analytics;
