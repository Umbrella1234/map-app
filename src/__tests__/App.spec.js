import React from "react";
import { shallow, mount } from "enzyme";
import App from "../App";

const positionMock = { lat: -34.397, lng: 150.644 };
const labelMock = "test";

describe("App", () => {
  let component;
  let instance;

  beforeEach(() => {
    component = shallow(<App />);
    instance = component.instance();
  });

  it("this.reorder should change state.markers order", () => {
    component.setState({ markers: [1, 2, 3, 4, 5] });
    instance.reorder(1, 3);

    expect(component.state().markers).toEqual([1, 3, 4, 2, 5]);
  });

  it("this.handleChange should update state based on target name and target value", () => {
    const eventMock = { name: "newPointName", value: "test" };
    instance.handleChange({
      target: { name: "newPointName", value: "test" }
    });

    expect(component.state()[eventMock.name]).toBe(eventMock.value);
  });

  describe("form submission", () => {
    it("shouldnt add a new marker if marker with the same position exists", () => {
      const component = mount(<App />);
      component.setState({
        center: positionMock,
        markers: [{ position: positionMock, label: "ololo" }]
      });
      component.find("form").simulate("submit");

      expect(component.state().markers.length).toBe(1);
    });

    it("shouldnt add a new marker if marker with the same name exists", () => {
      const component = mount(<App />);
      component.setState({
        newPointName: labelMock,
        markers: [{ label: labelMock }]
      });
      component.find("form").simulate("submit");

      expect(component.state().markers.length).toBe(1);
    });

    it("shouldn add a new marker when user submits the form", () => {
      const component = mount(<App />);
      component.setState({ newPointName: "test", center: positionMock });
      component.find("form").simulate("submit");

      expect(component.state().markers).toEqual([
        { label: "test", position: positionMock, isOpen: false }
      ]);
    });
  });

  it("this.deleteMarker should delete a marker", () => {
    component.setState({
      markers: [{ label: labelMock }]
    });
    instance.deleteMarker(labelMock);

    expect(component.state().markers.length).toBe(0);
  });

  it("this.setMarkerVisibility should set marker.isOpen to a second parameter value", () => {
    component.setState({
      markers: [{ label: labelMock }]
    });
    instance.setMarkerVisibility(labelMock, true);

    expect(component.state().markers[0].isOpen).toBe(true);
  });

  it("this.handleMarkerDragEnd should update markers position", () => {
    const labelMock = "test";
    const latLngMock = { lat: () => 10, lng: () => 20 };
    component.setState({
      markers: [{ label: labelMock, position: positionMock }]
    });
    instance.handleMarkerDragEnd(labelMock, { latLng: latLngMock });

    expect(component.state().markers[0].position).toEqual({
      lat: latLngMock.lat(),
      lng: latLngMock.lng()
    });
  });

  it("Add marker btn must be disabled if the state.newPointName is empty", () => {
    const component = mount(<App />);
    component.setState({
      newPointName: ""
    });

    expect(component.find("button").prop("disabled")).toBe(true);

    component.setState({
      newPointName: "cooltest"
    });

    expect(component.find("button").prop("disabled")).toBe(false);
  });
});
