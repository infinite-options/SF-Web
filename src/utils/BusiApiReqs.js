import axios from 'axios';
import Cookies from 'universal-cookie';

export default class BusiApiReqs {
  BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;
  cookies = new Cookies();

  getLocationBusinessIds = async function (long, lat) {
    return await axios
      .get(this.BASE_URL + 'categoricalOptions/' + long + ',' + lat)
      .then((response) => {
        return Promise.resolve(response.length !== 0 ? response.data : {});
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };

  getItems = async function (itemTypes, businessIds) {
    let reqBody = {
      type: itemTypes,
      ids: businessIds,
    };
    return await axios
      .post(this.BASE_URL + 'getItems', reqBody)
      .then((response) => {
        console.log('getItems API: ', response);
        if (response.data.result.length !== 0)
          return Promise.resolve(response.data.result);
        else return Promise.resolve([]);
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };

  getFavorite = async function (businessIds) {
    let reqBody = {
      customer_uid: businessIds,
    };
    return await axios
      .post(this.BASE_URL + 'favorite_produce/get', reqBody)
      .then((response) => {
        console.log('Favorite Items:', response);
        if (response.data.result.length !== 0)
          return Promise.resolve(response.data.result);
        else return Promise.resolve([]);
      })
      .catch((err)=> {
        console.log(err.response || err);
      });
  };


  create_ambassador = async function (email) {
    let reqBody = {
      code: email,
    };
    return await axios
      .post(this.BASE_URL + 'brandAmbassador/create_ambassador', reqBody)
      .then((response) => {
        console.log('response', response);
        alert("Congrats you are a ambassador");
      })
      .catch((err)=> {
        console.log(err.response || err);
      });
  };

  getProduceByLocation = async function (long, lat) {
    return await axios
      .get(this.BASE_URL + 'ProduceByLocation/' + long + ',' + lat)
      .then((response) => {
        console.log('getItems API: ', response);
        if (response.data.result.length !== 0)
          return Promise.resolve(response.data.result);
        else return Promise.resolve([]);
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };
}
