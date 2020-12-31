import axios from 'axios';

export default async function FindLongLatWithAddr(address, city, state, zip) {
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
      let locationApiResult = res.data;
      if (locationApiResult.statusCode === 200) {
        let location = locationApiResult.resourceSets[0].resources[0];
        /* Possible improvement: choose better location in case first one not desired
         */
        let lat = location.bbox[0];
        let long = location.bbox[1];

        if (location.bbox.length === 4) {
          lat = location.bbox[2];
          long = location.bbox[3];
        }
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
