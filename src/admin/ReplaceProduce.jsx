import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import axios from "axios";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";

function ReplaceProduce() {
  const [produce, setProduce] = useState([]);
  const [selectedProduce, setselectedProduce] = useState('');
  const [selectedProduce_uid, setselectedProduce_uid] = useState();
  const [selectedProduce_bs_uid, setselectedProduce_bs_uid] = useState();
  const [businessFrom, setbusinessFrom] = useState([]);
  const [selectedBusinessFrom, setselectedBusinessFrom] = useState();
  const [businessTo, setbusinessTo] = useState([]);
  const [selectedBusinessTo, setselectedBusinessTo] = useState();
  const [deliveryDate, setdeliveryDate] = useState();
  const [complete, setcomplete] = useState("hidden");

  useEffect(() => {
    axios
      .get(
        "https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/getAllItem"
      )
      .then((res) => {
        console.log(res.data.result);

        console.log("produce1", produce, typeof produce);
        setProduce(
          [
            {
              itm_uid: "",
              itm_bs_price: "",
              itm_price: "",
              itm_business_uid: "",
              itm_name: "select item",
              itm_business_name: "select item"
            }
          ].concat(
            res.data.result.map((lst_prd) => {
              return {
                itm_uid: lst_prd.item_uid,
                itm_bs_price: lst_prd.business_price,
                itm_price: lst_prd.item_price,
                itm_business_uid: lst_prd.itm_business_uid,
                itm_name: lst_prd.item_name,
                itm_business_name: lst_prd.business_name
              };
            })
          )
        );
        console.log("produce2", produce);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/getBusinessItems/" +
          selectedProduce
      )
      .then((res) => {
        console.log("Someone called me");
        console.log(res);
        setbusinessFrom(
          [{ bs_uid: "", bs_name: "select item" }].concat(
            res.data.result.map((lst_bs) => {
              return {
                bs_uid: lst_bs.itm_business_uid,
                bs_name: lst_bs.business_uid
              };
            })
          )
        );
        setbusinessTo(
          [{ bs_uid: "", bs_name: "select item" }].concat(
            res.data.result.map((lst_bs) => {
              return {
                bs_uid: lst_bs.itm_business_uid,
                bs_name: lst_bs.business_uid
              };
            })
          )
        );
      });
  }, [selectedProduce]);

  const handleChangeProduce = (event) => {
    console.log("init", selectedProduce)
    console.log(event, event.target.value)
    setcomplete("hidden");
    setselectedProduce(event.target.value.split(",")[0]);
    setselectedProduce_uid(event.target.value.split(",")[1]);
    setselectedProduce_bs_uid(event.target.value.split(",")[2]);
    console.log("exit", selectedProduce)
  };

  const handleChangeFarmFrom = (event) => {
    setcomplete("hidden");
    setselectedBusinessFrom(event.target.value.split(",")[0]);
  };

  const handleChangeFarmTo = (event) => {
    setcomplete("hidden");
    setselectedBusinessTo(event.target.value.split(",")[0]);
  };

  const handelDeliveryDate = (day) => {
    let tmp_ip_day = day.toLocaleDateString().split("/");
    let ip_day = [tmp_ip_day[2], tmp_ip_day[0], tmp_ip_day[1]];
    let res_day = "";
    let i = 0;
    for (i = 0; i < ip_day.length; i++) {
      if (ip_day[i].length === 1) {
        res_day += "0" + ip_day[i] + "-";
      } else {
        res_day += ip_day[i] + "-";
      }
    }
    console.log(res_day);
    res_day = res_day.slice(0, -1);
    setdeliveryDate(res_day);
    console.log(ip_day);
  };
  /*
  const updateOrder = (data) => {
    console.log("IN update");
    axios
      .post(
        "https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/order_actions/item_delete",
        { purchase_uid: data.purchase_uid, item_data: data.items }
      )
      .then((res) => {
        setcomplete("visible");
      });
  };

  const handleCheckItems = (data) => {
    setcomplete("hidden");
    let flag = false;
    let resItems = [];
    let tmpItems = {};
    let items = JSON.parse(data.items);
    let i = 0;
    for (i = 0; i < items.length; i++) {
      tmpItems = items[i];

      if (
        tmpItems.name.toLowerCase() === selectedProduce.toLowerCase() &&
        tmpItems.itm_business_uid === selectedBusinessFrom
      ) {
        flag = true;

        tmpItems.itm_business_uid = selectedBusinessTo;
      }

      resItems = resItems.concat(tmpItems);
      //console.log("res", resItems);
      //data.items = JSON.stringify(resItems);
      data.items = resItems;

      if (flag) {
        console.log("Checked");
        updateOrder(data);
      }
    }
  };

  
  const handleOnClick = () => {
    console.log("in old click")
    axios
      .get(
        "https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/updateOrder/" +
          deliveryDate
      )
      .then((res) => {
        let i = 0;
        for (i = 0; i < res.data.result.length; i++) {
          console.log(res.data.result[i].purchase_uid);
          handleCheckItems(res.data.result[i]);
        }
      });
  };
  */
  const handleOnClick = () => {
    axios
      .post(
        "https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/UpdatePurchaseBusiness/"+
        String(deliveryDate)+","+String(selectedProduce)+","+String(selectedBusinessFrom)+","+String(selectedBusinessTo)
      )
      .then((res) => {
        setcomplete("visible");
        }
      );
  };
  return (
    <div>
      Item to be replaced
      <br />
      <select onChange={(event) => handleChangeProduce(event)}>
        {produce.map((pro) => (
          <option
            key={pro.itm_uid}
            value={
              pro.itm_name + "," + pro.itm_uid + "," + pro.itm_business_uid
            }
          >
            {pro.itm_name}
          </option>
        ))}
      </select>
      <br />
      <br />
      <br />
      Business From <br />
      <select  onChange={handleChangeFarmFrom}>
        {businessFrom.map((pro) => (
          <option key={pro.bs_uid} value={pro.bs_uid + "," + pro.bs_name}>
            {pro.bs_uid}
          </option>
        ))}
      </select>
      <br />
      <br />
      <br />
      Business To
      <br />
      <select  onChange={handleChangeFarmTo}>
        {businessTo.map((pro) => (
          <option key={pro.bs_uid} value={pro.bs_uid + "," + pro.bs_name}>
            {pro.bs_uid}
          </option>
        ))}
      </select>
      <br />
      <br />
      <br />
      Select delivery date
      <br />
      <DayPickerInput
        placeholder={deliveryDate}
        value={deliveryDate}
        format="MM/DD/YYYY"
        onDayChange={handelDeliveryDate}
      />
      <br />
      <br />
      <br />
      <button onClick={handleOnClick}> Submit </button>
      <h4 style={{ visibility: complete }}> Order Value Changed </h4>
      <h4 style={{ visibility: complete === "visible" ? "hidden" : "visible" }}>
        {" "}
        No Change{" "}
      </h4>
    </div>
  );
}

export default ReplaceProduce;
