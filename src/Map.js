import React from "react";
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
  InfoWindow,
  Polyline
} from "react-google-maps";

export const InnerMap = props => (
  <GoogleMap {...props} defaultZoom={8} defaultCenter={props.defaultCenter}>
    {props.markers.map(({ label, isOpen, position }, i) => (
      <Marker
        key={label}
        onClick={() => props.onMarkerClick(label, true)}
        onDragEnd={e => props.handleDragEnd(label, e)}
        position={position}
        draggable
      >
        {isOpen && (
          <InfoWindow
            onCloseClick={() => props.onMarkerCloseClick(label, false)}
          >
            <div>{label}</div>
          </InfoWindow>
        )}
      </Marker>
    ))}
    {props.markers.length > 1 && (
      <Polyline
        path={props.markers.map(marker => marker.position)}
        options={{
          strokeColor: "#ff2343",
          strokeOpacity: 0.8,
          strokeWeight: 5
        }}
      />
    )}
  </GoogleMap>
);

export const Map = withScriptjs(withGoogleMap(InnerMap));
