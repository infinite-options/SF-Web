import axios from 'axios';

export default async function FindLongLatWithAddr(address, city, state, zip) {
  console.log('address, city, state, zip: ', address, city, state, zip);
  return await axios
    .get('https://dev.virtualearth.net/REST/v1/Locations/', {
      params: {
        CountryRegion: 'US',
        adminDistrict: state,
        locality: city,
        postalCode: zip,
        addressLine: address,
        key: process.env.REACT_APP_BING_LOCATION_KEY,
      },
    })
    .then((res) => {
      console.log('res: ', res);
      let locationApiResult = res.data;
      if (locationApiResult.statusCode === 200) {
        let location = locationApiResult.resourceSets[0].resources[0];
        /* Possible improvement: choose better location in case first one not desired
         */
        let lat = location.bbox[0];
        let long = location.bbox[1];
        console.log('lat,long : ', lat, long);
        return Promise.resolve({
          status: 'found',
          longitude: long,
          latitude: lat,
        });
      } else {
        return Promise.resolve({
          status: 'not found',
          longitude: -1,
          latitude: -1,
        });
      }
    });
}
