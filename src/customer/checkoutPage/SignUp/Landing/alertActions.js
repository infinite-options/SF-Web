import {v4 as uuidv4} from "uuid";
import {SET_ALERT, REMOVE_ALERT} from "./alertTypes";

export const setAlert = (type, msg) => dispatch => {
  const id = uuidv4();
  console.log("setAlert is called");
  console.log("message: ", msg);
  dispatch({type: SET_ALERT, payload: {type, msg, id}});
  setTimeout(() => dispatch({type: REMOVE_ALERT, payload: id}), 10000);
};
