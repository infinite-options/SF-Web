import axios from 'axios';
import Cookies from 'universal-cookie';

export default class AuthUtils {
  BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;
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

  updateProfile = async function (profile) {
    const profileData = {
      customer_first_name: profile.firstName,
      customer_last_name: profile.lastName,
      customer_phone_num: profile.phoneNum,
      customer_email: profile.email,
      customer_address: profile.address,
      customer_unit: profile.unit,
      customer_city: profile.city,
      customer_state: profile.state,
      customer_zip: profile.zip,
      customer_lat: profile.latitude,
      customer_long: profile.longitude,
      customer_uid: this.cookies.get('customer_uid'),
    };

    return await axios
      .post(this.BASE_URL + 'update_Profile', profileData, {
        headers: {
          'Content-Type': 'text/plain',
        },
      })
      .then((response) => {
        console.log('Update Profile: ', response);
        console.log('Update Profile: ', response.data);
        console.log('Update Profile: ', response.data.code);
        console.log(
          'Update Profile: ',
          response.data.code >= 200 && response.data.code < 300
        );

        if (response.data) {
          if (response.data.code >= 200 && response.data.code < 300)
            return Promise.resolve({ code: 200 });
          else {
            return Promise.resolve({ code: 400 });
          }
        } else {
          return Promise.resolve({ code: 400 });
        }
      })
      .catch((err) => {
        console.log('Update Profile Error: ', err.response || err);
        return Promise.resolve({ code: 400 });
      });
  };
}
