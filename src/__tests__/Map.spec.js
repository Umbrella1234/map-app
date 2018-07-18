import React from "react";
import { shallow, mount, render } from "enzyme";
import { Marker, InfoWindow, Polyline, GoogleMap } from "react-google-maps";
import { closedMarker, openMarker } from "../mocks";
import { InnerMap } from "../Map";

const defaultProps = {
  defaultCenter: { lat: -34.397, lng: 150.644 },
  markers: [],
  onMarkerCloseClick: jest.fn(),
  onMarkerClick: jest.fn(),
  handleDragEnd: jest.fn(),
  onCenterChanged: jest.fn(),
  googleMapURL:
    "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
  containerElement: <div style={{ height: `100%` }} />,
  loadingElement: <div style={{ height: `100%` }} />,
  mapElement: <div style={{ height: `100%`, width: "100%" }} />
};

const getWrappedComponent = customProps =>
  shallow(<InnerMap {...defaultProps} {...customProps} />);

describe("Map", () => {
  it("renders markers from props.markers", () => {
    const markers = [closedMarker, openMarker];
    const component = getWrappedComponent({ markers });

    expect(component.find(Marker).length).toBe(markers.length);
  });

  it("Marker InfoWindow visibility is based on marker.isOpen", () => {
    const markers = [openMarker];
    const component = getWrappedComponent({ markers });

    expect(
      component
        .find(Marker)
        .find(InfoWindow)
        .exists()
    ).toBe(true);
  });

  it("Polyline is rendered if there is more than one marker", () => {
    const component = getWrappedComponent();
    expect(component.find(Polyline).length).toBe(0);

    component.setProps({ markers: [closedMarker, openMarker] });

    expect(component.find(Polyline).length).toBe(1);
  });
});
