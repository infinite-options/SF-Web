import React, { useEffect, useState } from 'react';
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
// import {setDayOfYear} from "date-fns";
/*
*Chart function to display analytics and Revenue
! using Material UI to implement Month Year picker
*/

// const months = [""];
const report_API =
  'https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/admin_report/';
function Chart() {
  let today = new Date();
  let pastTime = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 5,
    1
  );
  const [monthYearvalue, setMonthYear] = useState(pastTime);
  const [endMonthYearvalue, setEndMonthYear] = useState(today);
  const [dataError, setError] = useState(false);
  const [loadStatus, setLoaded] = useState(false);
  const [data, setData] = useState({});

  //todo: this state is for the x-axis
  const [customers, setCustomer] = useState([]);

  //todo: this state for domain_name in chart-which is month/year
  const [domainName, setDomainName] = useState([]);

  //todo:series state
  const [series, setSeries] = useState([]);

  // console.log(monthYearvalue);
  let businessID = '200-000006';
  const changeOldDate = (event) => {
    console.log('start time: ', monthYearvalue);
    console.log('end time: ', endMonthYearvalue);
    setMonthYear(event);
    console.log(series);
    console.log(customers);
  };
  const changeCurrentDate = (event) => {
    console.log('start time: ', monthYearvalue);
    console.log('end time: ', endMonthYearvalue);
    setEndMonthYear(event);
    console.log(series);
    console.log(customers);
  };

  useEffect(() => {
    axios
      .get(report_API + businessID)
      .then((response) => {
        // console.log("Data from UID: " + businessID,response);
        let res = response.data.result;
        // console.log(response.data.result);
        setData(res);

        //todo: now remake theData to match the date given:
        let start = monthYearvalue;
        let end = endMonthYearvalue;
        let tempData = [];
        if (start > end) {
          console.log('Error: Ending time should be latter than Starting');
        } else {
          // let check = new Date(c[2], parseInt(c[1])-1, c[0]);
          console.log('Valid Times');
          res.map((obj) => {
            let dateString = obj.purchase_date;
            dateString = dateString.split('-'); //!In the format of YYYY-MM-DD
            let dateObj = new Date(
              dateString[0],
              parseInt(dateString[1]) - 1,
              dateString[2]
            );

            if (dateObj >= start && dateObj <= end) {
              tempData.push(obj);
            }
          });
        }
        console.log('tempData testing ', tempData);
        let theData = tempData;

        let monthYear_arr = [];
        let customer_identity_arr = [];
        for (var i = 0; i < theData.length; i++) {
          let cusName =
            theData[i].delivery_first_name +
            ' ' +
            theData[i].delivery_last_name;
          cusName === ' '
            ? (cusName = theData[i].pur_customer_uid)
            : (cusName = cusName);
          let pur_date = theData[i].purchase_date;
          //todo if the name is not in the list yet, add it
          if (!customer_identity_arr.includes(cusName)) {
            customer_identity_arr.push(cusName);
          }

          if (!monthYear_arr.includes(pur_date)) {
            monthYear_arr.push(pur_date);
          }
        }

        //*create series
        var seriesObj = [];
        //? customer for counter i
        for (var i = 0; i < customer_identity_arr.length; i++) {
          //? the data for counter k
          for (var j = 0; j < theData.length; j++) {
            var valueKey;
            if (theData[j].delivery_first_name === '') {
              valueKey = theData[j].pur_customer_uid;
            } else {
              valueKey =
                theData[j].delivery_first_name +
                ' ' +
                theData[j].delivery_last_name;
            }
            //!check the data if current name is same with the one in name obj
            if (valueKey === customer_identity_arr[i]) {
              let purDate = theData[j].purchase_date;
              let monthYearVal = purDate.slice(0, 7); //? for example: "2020-09"
              if (seriesObj.length !== 0) {
                //* this loop will run through seriesObj to find monthYearVal
                //* if found +1 for that user order
                //? series length go counter k
                var tempArr1 = new Array(customer_identity_arr.length).fill(
                  0,
                  0,
                  customer_identity_arr.length
                );
                let foundItem = false;
                for (var k = 0; k < seriesObj.length; k++) {
                  if (seriesObj[k].name === monthYearVal && !foundItem) {
                    seriesObj[k].data[i] += 1;
                    foundItem = true;
                    // console.log(seriesObj);
                  }
                }
                // if that date is not in the list of series, make a new one
                if (!foundItem) {
                  let newSeriesObj1 = {
                    name: monthYearVal,
                    data: tempArr1,
                  };
                  newSeriesObj1.data[i] += 1;
                  seriesObj.push(newSeriesObj1);
                }
              } else {
                //!this mean that we assume adding the newest customer with his first time order counter
                // console.log(j);
                let tempArr = new Array(customer_identity_arr.length).fill(
                  0,
                  0,
                  customer_identity_arr.length
                );
                // console.log("tempArr: ", tempArr);
                let newSeriesObj = {
                  name: monthYearVal,
                  data: tempArr,
                };
                // console.log(newSeriesObj.data[0]);
                newSeriesObj.data[i] += 1;
                // console.log(newSeriesObj);
                seriesObj.push(newSeriesObj);
                // console.log(seriesObj);
              }
            }
          }
        }
        setSeries(seriesObj);
        // console.log("test for the series Object making", seriesObj);

        //todo: after attaching, now set to x-axis and domain name
        setCustomer(customer_identity_arr);
        setDomainName(monthYear_arr);
        // console.log("The customers: ", customer_identity_arr);
        // console.log("The domain month/year", monthYear_arr);
      })
      .catch((err) => {
        console.log('Got Error getting API ', err);
        setError(true);
      })
      .finally(() => {
        // console.log("Loading Status: Good! ");
        setLoaded(true);
      });
  }, [businessID, monthYearvalue, endMonthYearvalue]);

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      // type: 'datetime',
      // categories: ['01/01/2011 GMT', '01/02/2011 GMT', '01/03/2011 GMT', '01/04/2011 GMT',
      //   '01/05/2011 GMT', '01/06/2011 GMT'
      // ],
      labels: {
        rotate: -90,
      },
      //!place the customers list x-axis here
      categories: customers,
      tickPlacement: 'on',
    },
    legend: {
      position: 'right',
      offsetY: 40,
    },
    fill: {
      opacity: 1,
    },
    yaxis: [
      {
        title: {
          text: 'Number of Order',
          rotate: -90,
          offsetX: 0,
          offsetY: 0,
          style: {
            color: undefined,
            fontSize: '15px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
            cssClass: 'apexcharts-yaxis-title',
          },
        },
      },
    ],
  };
  if (!dataError && loadStatus) {
    return (
      <div>
        <div className="monthYearPicker">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div className="sameRow">
              <DatePicker
                variant="outlined"
                openTo="month"
                views={['month', 'year']}
                label="Start time"
                helperText="choose starting month/year"
                value={monthYearvalue}
                onChange={changeOldDate}
              />
            </div>

            <div className="sameRow makeSpace">
              <DatePicker
                variant="outlined"
                openTo="month"
                views={['month', 'year']}
                label="End time"
                helperText="choose ending month/year"
                value={endMonthYearvalue}
                onChange={changeCurrentDate}
              />
            </div>
          </MuiPickersUtilsProvider>
        </div>

        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
        />
      </div>
    );
  }
  return <div>Data is comming up fast! Give us a sec</div>;
}

export default Chart;
