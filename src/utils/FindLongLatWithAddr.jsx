import axios from 'axios';

//TODO: Use the point field
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
      try {
        let locationApiResult = res.data;
        if (locationApiResult.statusCode === 200) {
          let location = locationApiResult.resourceSets[0].resources[0];
          /* Possible improvement: choose better location in case first one not desired
           */
          let lat = location.point.coordinates[0];
          let long = location.point.coordinates[1];

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
      } catch {
        return Promise.resolve({
          status: 'not found',
          longitude: -1,
          latitude: -1,
        });
      }
    });
}
