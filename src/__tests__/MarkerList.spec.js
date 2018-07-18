import React from "react";
import { mount } from "enzyme";
import { MarkerList, Item } from "../MarkerList";
import { closedMarker, openMarker } from "../mocks";

describe("MarkerList", () => {
  let component;
  let instance;
  let markers;
  let reorderMock;

  beforeEach(() => {
    reorderMock = jest.fn();
    markers = [closedMarker, openMarker];
    component = mount(<MarkerList reorder={reorderMock} markers={markers} />);
    instance = component.instance();
  });

  it("renders all markers", () => {
    expect(component.find(Item).length).toBe(markers.length);
  });

  describe("onDragEnd", () => {
    it("doesnt reorder if dropped outside the list", () => {

      instance.onDragEnd({ destination: null });
      expect(reorderMock).toHaveBeenCalledTimes(0);
    });

    it("calls props.reorder if dropped inside the list", () => {
      const eventMock = { destination: { index: 1 }, source: { index: 2 } };

      instance.onDragEnd(eventMock);

      expect(reorderMock).toHaveBeenCalledWith(
        eventMock.source.index,
        eventMock.destination.index
      );
    });
  });
});
