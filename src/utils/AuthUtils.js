import axios from 'axios';
import Cookies from 'universal-cookie';

export default class AuthUtils {
  BASE_URL =
    'https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/';
  cookies = new Cookies();

  getProfile = async function () {
    return await axios
      .get(this.BASE_URL + 'Profile/' + this.cookies.get('customer_uid'))
      .then((response) => {
        if (response.data.result.length !== 0)
          return Promise.resolve(response.data.result[0]);
        else return Promise.resolve({});
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };
}
