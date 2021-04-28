import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import LocationSearchInput from '../utils/LocationSearchInput';
import CssTextField from '../utils/CssTextField';
import {
    Box,
    Button,
    InputAdornment,
  } from '@material-ui/core';
  import LocationOnIcon from '@material-ui/icons/LocationOn';
  import appColors from '../styles/AppColors';

import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

const google = window.google;

export class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // for google map places autocomplete
      address: '',

      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
  
      mapCenter: {
        lat: 37.236720,
        lng: -121.887370
      }
    };
  }

  handleChange = address => {
    this.setState({ address });
  };
 
  handleSelect = address => {
    this.setState({ address });
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        console.log('Success', latLng);
        this.setState({address});
        // update center state
        this.setState({ mapCenter: latLng });
      })
      .catch(error => console.error('Error', error));
  };

   searchOptions = {
    location: new google.maps.LatLng(37.236720, -121.887370),
    radius: 2000,
    types: ['address']
  }
 
  render() {
    return (
      <div id='googleMaps' style={{width:'200px',height:'220px'}}>
        <div>

        <PlacesAutocomplete
          value={this.state.address}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
          searchOptions = {this.searchOptions}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input style={{width: '375px', height:'36px'}}
                {...getInputProps({
                  placeholder: 'Enter Street Address',
                  className: 'location-search-input',
                })}
              />
              <div className="autocomplete-dropdown-container" style={{zIndex:'1000' , position:"absolute"}}>
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
        </div>

        <div>

        <Map 
          google={this.props.google}
          style={{width: '375px', height: '180px', marginTop:'24px', borderRadius:"24px"}}
          initialCenter={{
            lat: this.state.mapCenter.lat,
            lng: this.state.mapCenter.lng
          }}
          center={{
            lat: this.state.mapCenter.lat,
            lng: this.state.mapCenter.lng
          }}
        >
          <Marker 
            position={{
              lat: this.state.mapCenter.lat,
              lng: this.state.mapCenter.lng
            }} />
        </Map>
                </div>

      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyBGgoTWGX2mt4Sp8BDZZntpgxW8Cq7Qq90')
})(MapComponent)
  
//  const WrappedMap = withScriptjs(withGoogleMap(Map));
  
//  export {WrappedMap};
// class MapComponent extends Component {
//     static defaultProps = {
//         center: {
//             lat: 59.95,
//             lng: 30.33
//         },
//         zoom: 11
//     };


//     render() {

//         return (
//             <div >

//             <CssTextField
//             id="mapComponentAddress"
//             placeholder="Street Address (so we can find you)"
//             variant="outlined"
//             fullWidth
        
//             style={{
//               width: '375px',
//               height: '49px',
//               marginBottom:'18px',
//             }}
//           />

          
//             <CssTextField
//             id="mapComponentAptNumber"
//             placeholder="Apt number"
//             variant="outlined"
//             fullWidth
        
//             style={{
//               width: '375px',
//               height: '49px',
//               marginBottom:'18px',
//             }}
//           />

//           <div style={{display:'flex'}}>
//           <CssTextField
//             id="mapComponentCity"
//             placeholder="City"
//             variant="outlined"
//             fullWidth
        
//             style={{
//               width: '168px',
//               height: '49px',
//               marginBottom:'18px',
//             }}
//           />

//             <CssTextField
//             id="mapComponentState"
//             placeholder="State"
//             variant="outlined"
//             fullWidth
        
//             style={{
//               width: '168px',
//               height: '49px',
//               marginBottom:'18px',
//             }}
//           />

//             <CssTextField
//             id="mapComponentZip"
//             placeholder="Zip"
//             variant="outlined"
//             fullWidth
        
//             style={{
//               width: '168px',
//               height: '49px',
//               marginBottom:'18px',
//             }}
//           />
//           </div>
          
//           <div style={{ height: '180px', width: '373px'}}>
//           <GoogleMapReact 
//                     defaultCenter={this.props.center}
//                     defaultZoom={this.props.zoom}
//                 />
//           </div>
               
//             </div>
//         );
//     }
// }

//export default MapComponent;