import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import googleMapReact from 'google-map-react';

const google = window.google;

const SomeReactComponent = ({ text }) => {

  return (
      <div>
           <RoomOutlinedIcon 
           fontSize='large'/>
      </div>
  );
};


export default class MapComponent extends Component {
 

    // componentDidMount() {
    //     console.log("latitude from props: ", this.props.latitude);
    //   }

    static defaultProps = {
        center: {
            lat: 37.236720,
            lng: -121.887370
        },
        zoom: 14
    };
 

  render() {
    const center = {lat:parseFloat(this.props.latitude) ? parseFloat(this.props.latitude) : 37.236720, lng: parseFloat(this.props.longitude)? parseFloat(this.props.longitude) : -121.887370}

        return (
          
            <div style={{ height: '30vh', width:'100%'}}>
                <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyBGgoTWGX2mt4Sp8BDZZntpgxW8Cq7Qq90' }}
                    center={center}
                  //  defaultCenter={center}
                    defaultZoom={this.props.zoom}
                      
                >

        <SomeReactComponent
           lat = {parseFloat(this.props.latitude) ? parseFloat(this.props.latitude) : 37.236720}
           lng = {parseFloat(this.props.longitude)? parseFloat(this.props.longitude) : -121.887370}
          />
           
           </GoogleMapReact>

        {/* <Map 
          google={this.props.google}
          style={{width: '375px', height: '180px', marginTop:'24px', borderRadius:"24px"}}
          initialCenter={{
            lat: this.props.latitude,
            lng: this.props.longitude,
          }}
          center={{
            lat: this.props.latitude,
            lng: this.props.longitude,
          }}
        >
          <Marker 
            position={{
              lat: this.props.latitude ,
              lng: this.props.longitude
            }} />
        </Map> */}

      </div>
    )
  }
}

// export default GoogleApiWrapper({
//     apiKey: ('AIzaSyBGgoTWGX2mt4Sp8BDZZntpgxW8Cq7Qq90')
//   })(MapComponent)

//export default MapComponent;