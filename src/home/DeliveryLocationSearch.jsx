import React, { useState, useContext, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-grid-system";
import { useHistory } from "react-router-dom";
import { Visible, Hidden } from "react-grid-system";

// rdx
// import Autocomplete from "react-google-autocomplete";
import Geocode from "react-geocode";
import axios from "axios";
import * as url from "url";
// import GooglePlacesAutocomplete from "react-google-places-autocomplete";
// import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete"
// import "react-google-places-autocomplete/dist/assets/index.css";
// rdx

import {
  Box,
  Button,
  InputAdornment,
  FormHelperText,
  Collapse
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import appColors from "../styles/AppColors";
import CssTextField from "../utils/CssTextField";
import FindLongLatWithAddr from "../utils/FindLongLatWithAddr";
import { AuthContext } from "../auth/AuthContext";
import { TrendingUpRounded } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  authModal: {
    position: "absolute",
    width: "500px"
  },
  infoSection: {
    width: "33.33%",
    justifyContent: "center",
    fontSize: "20px"
  },
  infoImg: {
    //: 'flex-end',
    alignItems: "center",
    height: "150px"
  }
}));

// rdx
const GOOGLE_MAP_API_KEY = "AIzaSyBLoal-kZlb6tO5aDvkJTFC0a4WMp7oHUM";
// Geocode.setApiKey("AIzaSyBLoal-kZlb6tO5aDvkJTFC0a4WMp7oHUM");
// Geocode.enableDebug();
url.URLSearchParams = URLSearchParams;

const loadGoogleMapScript = (callback) => {
  if (
    typeof window.google === "object" &&
    typeof window.google.maps === "object"
  ) {
    callback();
  } else {
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places`;
    window.document.body.appendChild(googleMapScript);
    googleMapScript.addEventListener("load", callback);
  }
};
// rdx

const DeliveryLocationSearch = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const auth = useContext(AuthContext);

  // For Guest Procedure
  const [deliverylocation, setDeliverylocation] = useState("");
  const [errorValue, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function createError(message) {
    setError("Invalid Input");
    setErrorMessage(message);
  }
  const onFieldChange = (event) => {
    const { value } = event.target;
    setDeliverylocation(value);
  };
  const onFindProduceClicked = () => {
    const formatMessage =
      "Please use the following format: Address, City, State Zipcode";
    const locationProps = deliverylocation.split(",");
    if (locationProps.length !== 3) {
      createError(formatMessage);
      return;
    }
    const stateZip = locationProps[2].trim().split(" ");
    if (stateZip.length !== 2) {
      createError(formatMessage);
      return;
    }
    setError("");
    setErrorMessage("");

    // DONE: Save for guest checkout
    let address = locationProps[0].trim();
    let city = locationProps[1].trim();
    let state = stateZip[0].trim();
    let zip = stateZip[1].trim();

    FindLongLatWithAddr(address, city, state, zip).then((res) => {
      console.log("res: ", res);
      if (res.status === "found") {
        const guestProfile = {
          longitude: res.longitude.toString(),
          latitude: res.latitude.toString(),
          address: address,
          city: city,
          state: state,
          zip: zip
        };
        localStorage.setItem("guestProfile", JSON.stringify(guestProfile));
        auth.setIsGuest(true);
        history.push("/store");
      } else {
        createError("Sorry, we could not find this location");
      }
    });
  };

  // rdx
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [loadMap, setLoadMap] = useState(false);

  useEffect(() => {
    loadGoogleMapScript(() => {
      setLoadMap(true);
    });
  }, []);

  const placeInputRef = useRef(null);
  

  useEffect(() => {
    initPlaceAPI();
  }, []);

  // initialize the google place autocomplete
  const initPlaceAPI = () => {
    let autocomplete = new window.google.maps.places.Autocomplete(
      placeInputRef.current
    );
    new window.google.maps.event.addListener(
      autocomplete,
      "place_changed",
      function () {
        let place = autocomplete.getPlace();
          let placeX =
        
          {
          address: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
        
        console.log(placeX)
          useEffect(() => {
				getProduce();
			}, []);
      }
    );
    
    
  };
  
  //This needs to be modified to make JSON GET request work using BusinessMethods class
  
  /*const getProduce = () => {
    BusiMethods.getProduceByLocation().then((itemsData) => {
		for (const item of itemsData) {
			console.log(item);
		}
    });
  };*/

  //Currently the way it is done, but needs to be fixed (not sure if parameters are correct)
  function makeGetRequest(place) {

    let payload = { latitude: place.lat, longitude: place.lng };
    //console.log("payload", payload);
	//console.log("long: ", payload.longitude);
	//console.log("lat: ", payload.latitude);

    const params = new url.URLSearchParams(payload);
    //let res = axios.get(`<replace_with_the_endpoint_url>/get?${params}`); // make necessary changes
	const TEST_URL = "https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/ProduceByLocation/", payload.longitude, ",", payload.latitute;
	console.log("URL: ", TEST_URL); // This part is not printing
	let res = axios.get(TEST_URL);

    // response
    let data = res.data;
    console.log("produce by location: ", data);
  }
  // rdx

  return (
    <Container
      fluid={true}
      className={classes.locationContainer}
      display="flex"
      //  mt={10}
      width="100%"
      //justifyContent="space-evenly"
    >
      <Row noGutters={true}>
        <Col md={3.5} lg={true} style={{ padding: 0 }}>
          {/* <CssTextField
            error={errorValue}
            value={deliverylocation}
            className={classes.margin}
            id="input-with-icon-textfield"
            size="small"
            placeholder="Search for your address"
            variant="outlined"
            fullWidth
            onChange={onFieldChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon
                    color="secondary"
                    aria-hidden="false"
                    aria-label="Enter delivery location"
                  />
                </InputAdornment>
              ),
            }}
            style={{
              width: '250px',
              border: '2px solid' + appColors.secondary,
              borderRadius: '5px',
            }}
          /> */}

          <input
            type="text"
            ref={placeInputRef}
            style={{
              width: "250px",
              height: "35px",
              border: "2px solid" + appColors.secondary,
              borderRadius: "5px"
            }}
          />

          <Box width="100%" justifyContent="center">
            <FormHelperText error={true} style={{ textAlign: "center" }}>
              {errorMessage}
            </FormHelperText>
          </Box>
        </Col>
        <Col>
          <h10
            style={{
              color: appColors.buttonText,
              fontSize: "30px",
              fontWeight: "700"
              //marginTop: '0px',
            }}
          >
            OR
          </h10>
        </Col>
        <Col md={3.5} lg={true} style={{ paddingLeft: 0, paddingRight: 0 }}>
          <CssTextField
            error={errorValue}
            value={deliverylocation}
            className={classes.margin}
            id="input-with-icon-textfield"
            size="small"
            placeholder="Enter Zip Code"
            variant="outlined"
            fullWidth
            onChange={onFieldChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon
                    color="secondary"
                    aria-hidden="false"
                    aria-label="Enter delivery location"
                  />
                </InputAdornment>
              )
            }}
            style={{
              width: "250px",
              border: "2px solid" + appColors.secondary,
              borderRadius: "5px"
            }}
          />
          <Box width="100%">
            <FormHelperText error={true} style={{ textAlign: "center" }}>
              {errorMessage}
            </FormHelperText>
          </Box>
        </Col>
        <Col md={3} lg={true} style={{ padding: 0 }}>
          <Button
            size="large"
            variant="contained"
            color="secondary"
            onClick={onFindProduceClicked}
            style={{
              width: "300px",
              height: "50px",
              textTransform: "none"
            }}
          >
            Find Local Produce
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
export default DeliveryLocationSearch;
