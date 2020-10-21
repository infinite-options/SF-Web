import React, { useEffect, useState } from "react";
import {
    DatePicker,
    TimePicker,
    DateTimePicker,
    MuiPickersUtilsProvider,
  } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { setDayOfYear } from "date-fns";
/*
*Chart function to display analytics and Revenue
! using Material UI to implement Month Year picker
*/ 

const months =[""];
const report_API ="https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/admin_report/";
function Chart(){
    const [monthYearvalue, setMonthYear] = useState(new Date());
    const [endMonthYearvalue, setEndMonthYear] = useState(new Date());
    const [dataError,setError] = useState(false);
    const [loadStatus,setLoaded] = useState(false);
    const [data,setData]=useState({});

    //todo: this state is for the x-axis
    const [customers,setCustomer] = useState([]);

    //todo: this state for domain_name in chart-which is month/year
    const [domainName,setDomainName] = useState([]);

    //todo:series state
    const [series,setSeries] = useState([]);
    // console.log(monthYearvalue);
    let businessID= "200-000006";

    useEffect(()=>{
      axios.get(report_API + businessID).then(response =>{
        // console.log("Data from UID: " + businessID,response);
        let theData=response.data.result;
        console.log(response.data.result);
        setData(theData);
        let monthYear_arr=customers;
        let customer_identity_arr=domainName;
        for(var i=0;i<theData.length;i++){
          let cusName=theData[i].delivery_first_name + " " +theData[i].delivery_last_name;
          cusName===" "?cusName=theData[i].pur_customer_uid:cusName=cusName;
          let pur_date=theData[i].purchase_date;
          if(!customer_identity_arr.includes(cusName)){
            customer_identity_arr.push(cusName);
          }
          if(!monthYear_arr.includes(pur_date)){
            monthYear_arr.push(pur_date);
          }
        }

        
        //*create series
        var seriesObj=[];
        // make an array of 0 filled
        // let makeArray= new Array(customer_identity_arr.length).fill(0,0,customer_identity_arr.length);
        // console.log(theData.length);
      
        
          //? customer for counter i
          for(var i=0;i<customer_identity_arr.length;i++){
            //? the data for counter k
            for(var j=0;j<theData.length;j++){
              var valueKey;
              if(theData[j].delivery_first_name===""){
                valueKey=theData[j].pur_customer_uid;
              }else{
                valueKey=theData[j].delivery_first_name + " " + theData[j].delivery_last_name;
              }
              // console.log("test undifined error",valueKey);
              //let valueID=theData[j].pur_customer_uid;
              //!check the data if current name is same with the one in name obj
              if(valueKey===customer_identity_arr[i]){
                let purDate= theData[j].purchase_date;
                // let monthVal=parseInt(purDate.slice(5,7));
                // let yearVal =parseInt(purDate.slice(0,4));
                let monthYearVal=(purDate.slice(0,7)); //? for example: "2020-09"
                if(seriesObj.length!==0){
                  //* this loop will run through seriesObj to find monthYearVal
                  //* if found +1 for that user order
                  //? series length go counter k
                  var tempArr1=new Array(customer_identity_arr.length).fill(0,0,customer_identity_arr.length);
                  let foundItem= false;
                  for(var k=0;k<seriesObj.length;k++){
                    if(seriesObj[k].name ===monthYearVal && !foundItem){
                      seriesObj[k].data[i] +=1;
                      foundItem=true;
                      // console.log(seriesObj);
                    }
                  }
                  // if that date is not in the list of series, make a new one
                  if(!foundItem){
                    let newSeriesObj1={
                      name: monthYearVal,
                      data: tempArr1
                    }
                    newSeriesObj1.data[i]+=1;
                    seriesObj.push(newSeriesObj1);
                  }

                }else{
                  //!this mean that we assume adding the newest customer with his first time order counter
                  console.log(j);
                  let tempArr=new Array(customer_identity_arr.length).fill(0,0,customer_identity_arr.length);
                  console.log("tempArr: ",tempArr);
                  // console.log("tempArr position 0: ",tempArr[0]);
                  let newSeriesObj={
                    name: monthYearVal,
                    data: tempArr
                  }
                  console.log(newSeriesObj.data[0]);
                  // console.log("tempArr line 2: ",newSeriesObj.data);
                  newSeriesObj.data[i]+=1;
                  console.log(newSeriesObj);
                  seriesObj.push(newSeriesObj);
                  console.log(seriesObj);
                }
              }
            }
          }
        setSeries(seriesObj);
        console.log("test for the series Object making", seriesObj);

        //todo: after attaching, now set to x-axis and domain name
        setCustomer(customer_identity_arr);
        setDomainName(monthYear_arr);
        console.log("The customers: ",customer_identity_arr);
        console.log("The domain month/year",monthYear_arr);

      }).catch(err => {
        console.log("Got Error getting API ",err);
        setError(true);
      }).finally(()=>{
        console.log("Loading Status: Good! ");
        setLoaded(true);
      })
    },[businessID])



    const seriesDefault= [{
        name: 'NextDoor man',
        data: [44, 55, 41, 67, 22, 43]
      }, {
        name: 'Justin B',
        data: [0, 23, 20, 8, 13, 27]
      }, {
        name: 'Random C',
        data: [11, 17, 15, 15, 21, 14]
      }, {
        name: 'Buyer D',
        data: [21, 7, 25, 13, 22, 8]
      }, {
        name: 'seller E',
        data: [21, 7, 25, 13, 22, 8,11]
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
          // type: 'datetime',
          // categories: ['01/01/2011 GMT', '01/02/2011 GMT', '01/03/2011 GMT', '01/04/2011 GMT',
          //   '01/05/2011 GMT', '01/06/2011 GMT'
          // ],
          labels: {
            rotate: -90
          },
          //!place the customers list x-axis here
          categories: customers,
          tickPlacement: 'on'
        },
        legend: {
          position: 'right',
          offsetY: 40
        },
        fill: {
          opacity: 1
        },
        yaxis:[
          {
            title: {
              text: "Number of Order",
              rotate: -90,
              offsetX: 0,
              offsetY: 0,
              style: {
                  color: undefined,
                  fontSize: '15px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 600,
                  cssClass: 'apexcharts-yaxis-title'
              }
            }
          }
        ]
    };
    if(!dataError &&loadStatus){
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
    return(
    <div>
        {/* <div className="monthYearPicker">
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
        
        <ReactApexChart options={options} series={series} type="bar" height={350} /> */}
        Data is comming up fast! Give us a sec
    </div>);
}

export default Chart;