import React, { Component } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Wrapper = styled.div`
  flex-grow: 1;
  flex-direction: column;
  display: flex;
  overflow: auto;
`;

const List = styled.div`
  padding: 15px;
`

export const Item = styled.div`
  padding: 15px;
  display: flex;
  justify-content: space-between;
  background: ${({ isDragging }) => (isDragging ? "lightgreen" : "grey")};
  margin-bottom: 10px;
`;

const DeleteBtn = styled.span`
  align-self: center;

  &:hover {
    text-decoration; underscore;
    color: white;
    cursor: pointer;
  }

  &:active {
    color: red;
  }
`;

export class MarkerList extends Component {
  onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    this.props.reorder(result.source.index, result.destination.index);
  };

  render() {
    return (
      <Wrapper>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div ref={provided.innerRef}>
                <List>
                  {this.props.markers.map(({ label }, i) => {
                    return (
                      <Draggable key={label} draggableId={label} index={i}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Item isDragging={snapshot.isDragging}>
                              <span>{label}</span>
                              <DeleteBtn
                                onClick={() => this.props.deleteMarker(label)}
                              >
                                delete
                              </DeleteBtn>
                            </Item>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </List>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Wrapper>
    );
  }
}
