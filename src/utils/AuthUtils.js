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

  createProfile = async function (userInfo, password) {
    let object = {
      email: userInfo.email,
      password: password,
      first_name: userInfo.firstName,
      last_name: userInfo.lastName,
      phone_number: userInfo.phoneNum,
      address: userInfo.address,
      unit: userInfo.unit,
      city: userInfo.city,
      state: userInfo.state,
      zip_code: userInfo.zip,
      latitude: userInfo.latitude,
      longitude: userInfo.longitude,
      referral_source: 'WEB',
      role: 'CUSTOMER',
      social: 'FALSE',
      social_id: 'NULL',
      user_access_token: 'FALSE',
      user_refresh_token: 'FALSE',
      mobile_access_token: 'FALSE',
      mobile_refresh_token: 'FALSE',
    };
    return await axios
      .post(process.env.REACT_APP_SERVER_BASE_URI + 'createAccount', object, {
        headers: {
          'Content-Type': 'text/plain',
        },
      })
      .then((res) => {
        try {
          if (res.data.code >= 200 && res.data.code < 300) {
            let customerInfo = res.data.result;
            this.cookies.set('login-session', 'good');
            this.cookies.set('customer_uid', customerInfo.customer_uid);
            if (res.data.code === 200) {
              axios
                .post(
                  process.env.REACT_APP_SERVER_BASE_URI + 'email_verification',
                  { email: userInfo.email },
                  {
                    headers: {
                      'Content-Type': 'text/plain',
                    },
                  }
                )
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  if (err.response) {
                    console.log(err.response);
                  }
                  console.log(err);
                });
            }
            return Promise.resolve({ code: 200 });
          } else {
            return Promise.resolve({ code: 400 });
          }
        } catch {
          return Promise.resolve({ code: 400 });
        }
      })
      .catch((err) => {
        console.log('Update Profile Error: ', err.response || err);
        return Promise.resolve({ code: 400 });
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

  updatePassword = async function (credentials) {
    credentials.customer_uid = this.cookies.get('customer_uid');
    return await axios
      .post(this.BASE_URL + 'update_email_password', credentials, {
        headers: {
          'Content-Type': 'text/plain',
        },
      })
      .then((response) => {
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

  updatePushNotifications = async function (notificationValue) {
    const notificationData = {
      uid: this.cookies.get('customer_uid'),
      notification: notificationValue ? 'TRUE' : 'FALSE',
    };

    return await axios
      .post(
        this.BASE_URL + 'update_guid_notification/customer,update',
        notificationData,
        {
          headers: {
            'Content-Type': 'text/plain',
          },
        }
      )
      .then((response) => {
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

  getLastDeliveryDate = async function (notificationValue) {
    return await axios
      .get(
        this.BASE_URL +
          'last_delivery_instruction/' +
          this.cookies.get('customer_uid')
      )
      .then((response) => {
        try {
          if (response.data) {
            if (response.data.code >= 200 && response.data.code < 300)
              return Promise.resolve(
                response.data.result[0].delivery_instructions
              );
            else {
              return Promise.resolve('');
            }
          } else {
            return Promise.resolve('');
          }
        } catch {
          return Promise.resolve('');
        }
      });
  };
}
