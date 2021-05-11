import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';


const google = window.google;


export class MapComponent extends Component {
 

    componentDidMount() {
        console.log("latitude from props: ", this.props.latitude);
      }

    static defaultProps = {
        center: {
            lat: 37.236720,
            lng: -121.887370
        },
        zoom: 10
    };


    render() {

        return (
            <div style={{ height: '30vh', width: '100%' }}>
                {/* <GoogleMapReact
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                /> */}

        <Map 
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
        </Map>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: ('AIzaSyBGgoTWGX2mt4Sp8BDZZntpgxW8Cq7Qq90')
  })(MapComponent)

//export default MapComponent;