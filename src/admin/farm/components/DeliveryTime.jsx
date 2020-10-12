import React,{useContext} from "react";
import TextField from '@material-ui/core/TextField';
import { AdminFarmContext } from '../../AdminFarmContext'

function DeliveryTime(props){
    const dayTime= "AM";
    const AfternoonTime = "PM";
    const context =useContext(AdminFarmContext);
    var currentDeliveryTime = context.deliveryTime;

    function handleTimeChange(e){
        const {value, name, id} = e.target;
        console.log(value+ " " + name + " " +id);
        for(const object in currentDeliveryTime){
            // console.log(object);
            if(object === name){
                var makeTime = value+":00";
                console.log(makeTime);
                if(id==="AM"){
                    currentDeliveryTime[object][0] = makeTime;
                }else{
                    currentDeliveryTime[object][1] = makeTime;
                }
            }
        }
        context.setDeliveryTime(currentDeliveryTime);
        console.log(currentDeliveryTime);
        
    }
    return(
    <div className="spaceBetweenTime">
        <div className="noBlock weekday">{props.weekday}</div>
        <div className="noBlock">
            <TextField 
                size="small" type="time"
                defaultValue={props.start}
                name= {props.weekday}
                id={dayTime}
                style={{ width: "100px" }}
                InputProps={{ style: { height: "20px", fontSize: "0.7rem" } }}
                onChange={handleTimeChange}
            />
        </div>
        <div className="noBlock dashSpace"> - </div>
        <div className="noBlock">
            <TextField 
                size="small" type="time"
                defaultValue={props.end}
                name= {props.weekday}
                id={AfternoonTime}
                style={{ width: "100px" }}
                InputProps={{ style: { height: "20px", fontSize: "0.7rem" } }}
                onChange={handleTimeChange}
            />
        </div>
    </div>);
}


export default DeliveryTime;