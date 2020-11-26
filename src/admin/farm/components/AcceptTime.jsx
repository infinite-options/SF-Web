import React, { useContext } from "react";
import TextField from "@material-ui/core/TextField";
import { AdminFarmContext } from "../../AdminFarmContext";

function AcceptTime(props) {
  const dayTime = "AM";
  const AfternoonTime = "PM";
  const context = useContext(AdminFarmContext);

  function handleTimeChange(e) {
    const { value, name, id } = e.target;
    // console.log(value + " " + name + " " + id);
    var currentAcceptTime = JSON.parse(JSON.stringify(context.timeChange));
    let timeWithSeconds = value + ':00'
    if(id === 'AM') {
      currentAcceptTime[name][0] = timeWithSeconds;
    } else {
      currentAcceptTime[name][1] = timeWithSeconds;
    }
    context.setTimeChange(currentAcceptTime);
    // console.log(currentAcceptTime);
  }
  return (
    <div className="spaceBetweenTime">
      <div className="noBlock weekday">{props.weekday}</div>
      <div className="noBlock">
        <TextField
          size="small"
          type="time"
          value={props.start}
          name={props.weekday}
          id={dayTime}
          style={{ width: "100px" }}
          InputProps={{ style: { height: "20px", fontSize: "0.7rem" } }}
          onChange={handleTimeChange}
        />
      </div>
      <div className="noBlock dashSpace"> - </div>
      <div className="noBlock">
        <TextField
          size="small"
          type="time"
          value={props.end}
          name={props.weekday}
          id={AfternoonTime}
          style={{ width: "100px" }}
          InputProps={{ style: { height: "20px", fontSize: "0.7rem" } }}
          onChange={handleTimeChange}
        />
      </div>
    </div>
  );
}

export default AcceptTime;
