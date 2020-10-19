import React, { Fragment, useState } from "react";
import {
    DatePicker,
    TimePicker,
    DateTimePicker,
    MuiPickersUtilsProvider,
  } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ReactApexChart from "react-apexcharts";
/*
*Chart function to display analytics and Revenue
! using Material UI to implement Month Year picker
*/ 
function Chart(){
    const [monthYearvalue, setMonthYear] = useState(new Date());
    const [endMonthYearvalue, setEndMonthYear] = useState(new Date());
    // console.log(monthYearvalue);

    const series= [{
        name: 'NextDoor man',
        data: [44, 55, 41, 67, 22, 43]
      }, {
        name: 'Justin B',
        data: [13, 23, 20, 8, 13, 27]
      }, {
        name: 'Random C',
        data: [11, 17, 15, 15, 21, 14]
      }, {
        name: 'Buyer D',
        data: [21, 7, 25, 13, 22, 8]
      }, {
        name: 'seller E',
        data: [21, 7, 25, 13, 22, 8,1]
      }]

    const  options= {
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: true
          },
          zoom: {
            enabled: true
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        xaxis: {
          type: 'datetime',
          categories: ['01/01/2011 GMT', '01/02/2011 GMT', '01/03/2011 GMT', '01/04/2011 GMT',
            '01/05/2011 GMT', '01/06/2011 GMT'
          ],
        },
        legend: {
          position: 'right',
          offsetY: 40
        },
        fill: {
          opacity: 1
        }
    };




    return(
    <div>
        <div className="monthYearPicker">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <div className="sameRow">
                    <DatePicker
                        variant="outlined"
                        openTo="month"
                        views={["month", "year"]}
                        label="Start time"
                        helperText="choose starting month/year"
                        value={monthYearvalue}
                        onChange={setMonthYear}
                    />
                </div>
                
                <div className="sameRow makeSpace">
                    <DatePicker
                        variant="outlined"
                        openTo="month"
                        views={["month","year"]}
                        label="End time"
                        helperText="choose ending month/year"
                        value={endMonthYearvalue}
                        onChange={setEndMonthYear}
                    />
                </div>
            </MuiPickersUtilsProvider>
        </div>
        
        <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>);
}

export default Chart;