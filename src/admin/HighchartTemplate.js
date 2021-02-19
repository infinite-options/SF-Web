import React, { useEffect, useState, useContext } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { DateRangePicker} from 'rsuite';
import axios from 'axios';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
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

// TODO: add dropdown for farms / all and date range / all
function RevenueHighchart() {
  const classes = useStyles();
  const { farmList, farmDict } = useContext(AdminFarmContext);

  const [startDate, setStartDate] = React.useState(new Date('2020-11-25'));
  const [endDate, setEndDate] = React.useState(new Date());

  const [chartData, setChartData] = useState({});
  const [dataError, setError] = useState(false);

  const [listOfDates, setDates] = useState([]);
  const [listOfBuyers, setListOfBuyers] = useState([]);
  const [listOfNumCateg, setListOfNumCateg] = useState([]);
  const [listOfCumuRevenue, setCumuRevenue] = useState([]);
  const [listOfDailyRevenue, setDailyRevenue] = useState([]);

  const [businessID, setBusinessId] = useState('all');
  const [purchasesRes, setPurchasesRes] = useState([]);

  const [barsType, setBarType] = useState('customer');
  const [priceType, setPriceType] = useState('item');

  const [months] = useState(['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
  const [datemonths] = useState({'Jan':"2021-01-01,2021-01-31",'Feb':"2021-02-01,2021-02-28",
                                 'Mar':"2021-01-03,2021-03-31", 'Apr':"2021-04-01,2021-04-30",
                                  'May':"2021-05-01,2021-05-31", 'Jun':"2021-06-01,2021-06-30",
                                 'Jul':"2021-07-01,2021-07-31", 'Aug':"2021-08-01,2021-08-31",
                                  'Sep':"2021-09-01,2021-09-30", 'Oct':"2021-10-01,2021-10-31",
                                   'Nov':"2021-11-01,2021-11-30", 'Dec':"2021-12-01,2021-12-31"})
  const [selectedMonth, setSelectedMonth] = useState("Jan")
  const [reportLink, setReportLink] = useState(" https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/farmer_revenue_inventory_report_all_month/summary,"+datemonths['Jan'])

  const handleChange = (event) => {
    const { value, name } = event.target;
    if (name === 'type') setBarType(value);
    else if (name === 'business') setBusinessId(value);
    else if (name === 'price') setPriceType(value);
    else if (name === 'month'){ 
      setSelectedMonth(value); 
      setReportLink(" https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/farmer_revenue_inventory_report_all_month/summary,"+datemonths[value]);
    }
  };
  const onReportClick = () => {
    
      return (
      <a href= {reportLink} target="_blank" rel="noreferrer"></a>
      )
    
    
  
    };

  // TODO: First need to get all the dates that has customer activities, sort them
  // TODO: Get code from Allan
  // DONE: 1. Add business
  // DONE: 2. Fix Bug
  // DONE: 3. Add businesses pull down
  // TODO: 4. Add numbers to top
  // TODO: 5. Add Date ranges

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
    let isMounted = true; // note this flag denote mount status
    if (purchasesRes.length > 0 || businessID !== 'all')
      loadSeriesData(purchasesRes, isMounted);
    return () => {
      isMounted = false;
    };
  }, [farmDict, barsType, priceType, purchasesRes]);

  function loadSeriesData(res, isMounted) {
    let theData = res;
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
    let barDict = {};
    let customers = [];
    let cIdx = 0;
    const nullData = new Array(dayArr.length).fill(null);
    let dailyIncome = new Array(dayArr.length).fill(0);
    let revenue = new Array(dayArr.length).fill(0);
    let uniqueBarSets = new Array(dayArr.length).fill(new Set());
    let total = 0;

    for (const dayIdx in dayArr) {
      let dailyProfit = 0;
      for (const purchase of dayDict[dayArr[dayIdx]]) {
        const barValue =
          barsType === 'customer'
            ? purchase.delivery_first_name + ' ' + purchase.delivery_last_name
            : purchase[barsType];

        const amountSpent =
          Math.round(purchase[priceType + '_amount'] * 100) / 100;

        if (barValue in barDict) {
          customers[barDict[barValue]].data[dayIdx] += amountSpent;
          customers[barDict[barValue]].data[dayIdx] =
            Math.round(customers[barDict[barValue]].data[dayIdx] * 100) / 100;
        } else {
          barDict[barValue] = cIdx;
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
        if (uniqueBarSets[dayIdx].size == 0) uniqueBarSets[dayIdx] = new Set();
        uniqueBarSets[dayIdx].add(barValue);
      }

      total += dailyProfit;
      total = Math.round(total * 100) / 100;
      dailyIncome[dayIdx] = dailyProfit;
      revenue[dayIdx] = total;
    }

    const uniqueBarVals = uniqueBarSets.map((set) => {
      return set.size;
    });

    if (isMounted) {
      setListOfNumCateg(uniqueBarVals);
      setListOfBuyers(customers);
      setCumuRevenue(revenue);
      setDailyRevenue(dailyIncome);
    }
    // console.log("buyerContainer ", buyerContainer);
    // console.log("retuners ", oldCustomer);
    // console.log("NewBuyer ", newCustomer);
  }

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
      {
        min: 0,
        title: {
          text: 'Number of ' + barsType + 's',
          style: {
            color: '#000',
          },
        },
        stackLabels: {
          enabled: true,
          style: {
            color: '#000',
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
        dataLabels: {
          enabled: false,
        },
      },
    },
    series: [
      ...listOfBuyers,
      {
        type: 'spline',
        name: 'Cumulative Revenue',
        showInLegend: false,
        data: listOfCumuRevenue,
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b><br/>',
        },
        yAxis: 2,
      },
      {
        type: 'spline',
        name: 'Daily Revenue',
        showInLegend: false,
        data: listOfDailyRevenue,
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b><br/>',
        },
        yAxis: 1,
      },
      {
        type: 'scatter',
        name: 'Number of ' + barsType + 's',
        showInLegend: false,
        data: listOfNumCateg,
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b><br/>',
        },
        yAxis: 3,
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

  const onChange = title => (...args) => console.log(title, args);
  

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
            <MenuItem value={'customer'}>Customer</MenuItem>
            <MenuItem value={'deconstruct.itm_business_uid'}>Business</MenuItem>
            <MenuItem value={'deconstruct.name'}>Item</MenuItem>
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
        
        
        <Box display="flex" marginLeft = "100px" justify-content = "center">
    
          
        <FormControl className={classes.formControl}>
            <FormHelperText>Month</FormHelperText>
            <Select
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              name="month"
              value = {selectedMonth}
              onChange={handleChange}
              
            >
              {months.map((month) => {
                return (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                );
              })}
              
            </Select>
          </FormControl>
          
          
          <a href = {reportLink} style = {{textDecoration:"none"}}> 
            <button style = {{marginTop:"25px"}}>Generate Revenue Report</button>
          </a>
         
        </Box>
        
        
        
        
      </Box>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
}

export default RevenueHighchart;
