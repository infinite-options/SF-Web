import axios from 'axios';

function FindLongLatWithAddr(address, city, state, zip) {
  axios
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
      // console.log(res)
      let locationApiResult = res.data;
      if (locationApiResult.statusCode === 200) {
        let locations = locationApiResult.resourceSets[0].resources;
        /* Possible improvement: choose better location in case first one not desired
         */
        let location = locations[0];
        let lat = location.geocodePoints[0].coordinates[0];
        let long = location.geocodePoints[0].coordinates[1];
        if (location.geocodePoints.length === 2) {
          lat = location.geocodePoints[1].coordinates[0];
          long = location.geocodePoints[1].coordinates[1];
        }
        return { status: 'found', long: long, lat: lat };
      } else {
        return { status: 'not found', long: -1, lat: -1 };
      }
    });
}
