import React, { Component } from "react";
import styled from "styled-components";
import { Map } from "./Map";
import { MarkerList } from "./MarkerList";

const DEFAULT_CENTER = { lat: -34.397, lng: 150.644 };

const StyledGrid = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
`;

const StyledMarkerList = styled.div`
  display: flex;
  flex-direction: column;
  width: 20%;
  min-width: 250px;
`;

const StyledMapWrapper = styled.div`
  flex-grow: 1;
`;

const StyledMarkerForm = styled.form`
  display: flex;
`;

const StyledInput = styled.input`
  flex-grow: 1;
`;


class App extends Component {
  state = {
    newPointName: "",
    markers: [],
    center: DEFAULT_CENTER
  };

  reorder = (startIndex, endIndex) => {
    const result = this.state.markers;
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return this.setState({ markers: result });
  };

  handleChange = e =>
    this.setState({
      [e.target.name]: e.target.value
    });

  handleAddItem = e => {
    e.preventDefault();
    const { markers, newPointName, center } = this.state;
    const hasLabel = markers.some(marker => marker.label === newPointName);
    const isSameLocation = markers.some(marker => marker.position === center);

    if (hasLabel) {
      alert(`Marker with name ${newPointName} already exists`);
      return;
    }

    if (isSameLocation) {
      alert(`Marker in this area already exists!`);
      return;
    }

    this.setState({
      markers: [
        ...markers,
        {
          label: newPointName,
          position: center,
          isOpen: false
        }
      ],
      newPointName: ""
    });
  };

  onCenterChanged(appContext) {
    return function() {
      // this - GoogleMap component
      const coords = this.getCenter();
      appContext.setState({
        center: { lat: coords.lat(), lng: coords.lng() }
      });
    };
  }

  deleteMarker = label => {
    this.setState({
      markers: this.state.markers.filter(marker => marker.label !== label)
    });
  };

  setMarkerVisibility = (label, isOpen) => {
    this.setState({
      markers: this.state.markers.map(marker => {
        if (marker.label === label) {
          return { ...marker, isOpen };
        }
        return marker;
      })
    });
  };

  handleMarkerDragEnd = (label, e) => {
    const coords = e.latLng;
    const markers = [...this.state.markers];
    const index = markers.findIndex(marker => marker.label === label);
    markers[index].position = { lat: coords.lat(), lng: coords.lng() };

    this.setState({
      markers
    });
  };

  render() {
    return (
      <StyledGrid>
        <StyledMarkerList>
          <StyledMarkerForm onSubmit={this.handleAddItem}>
            <StyledInput
              type="text"
              name="newPointName"
              value={this.state.newPointName}
              onChange={this.handleChange}
            />
            <button type="submit" disabled={!this.state.newPointName.length}>
              Add marker
            </button>
          </StyledMarkerForm>
          <MarkerList
            markers={this.state.markers}
            deleteMarker={this.deleteMarker}
            reorder={this.reorder}
          />
        </StyledMarkerList>
        <Map
          defaultCenter={DEFAULT_CENTER}
          markers={this.state.markers}
          onMarkerCloseClick={this.setMarkerVisibility}
          onMarkerClick={this.setMarkerVisibility}
          handleDragEnd={this.handleMarkerDragEnd}
          onCenterChanged={this.onCenterChanged(this)}
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
          containerElement={<StyledMapWrapper />}
          loadingElement={<div style={{ height: `100%` }} />}
          mapElement={<div style={{ height: `100%`, width: "100%" }} />}
        />
      </StyledGrid>
    );
  }
}

export default App;