import * as React from 'react';
import { findDOMNode } from 'react-dom';
import flow from 'lodash.flow';
import {
	DragSource,
	DropTarget,/* 
	ConnectDropTarget,
	ConnectDragSource,
	DropTargetMonitor,
	DropTargetConnector,
	DragSourceConnector,
	DragSourceMonitor, */
} from 'react-dnd';
// import { XYCoord } from 'dnd-core';

import Task from './Task';

const cardSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index,
		}
	},
}

const cardTarget = {
	hover(props, monitor, component) {
		if (!component) {
			return null
		}
		const dragIndex = monitor.getItem().index
		const hoverIndex = props.index

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return
		}

		// Determine rectangle on screen
		const hoverBoundingRect = (findDOMNode(
			component,
    )).getBoundingClientRect()

		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

    // Get horizontal middle
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2
    // console.log(hoherMiddleX)

		// Determine mouse position
		const clientOffset = monitor.getClientOffset()

		// Get pixels to the top
    const hoverClientY = (clientOffset).y - hoverBoundingRect.top
    
    // Get pixels to the left
    const hoverClientX = (clientOffset).x - hoverBoundingRect.left

		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%

		// Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      if (hoverClientX < hoverMiddleX) {
        return
      }
		}

		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      if (hoverClientX > hoverMiddleX) {
        return
      }
		}

		// Time to actually perform the action
		props.moveCard(dragIndex, hoverIndex)

		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
		monitor.getItem().index = hoverIndex
	},
}

const styles = {
  deskItemWrapper: {
    border: '1px dashed black',
    margin: '5px',
    width: '200px'
  }
}

class Card extends React.Component {
	render() {
    const {
      desc,
			isDragging,
			connectDragSource,
			connectDropTarget,
    } = this.props
    
		const opacity = isDragging ? 0 : 1

		return (
			connectDragSource &&
			connectDropTarget &&
			connectDragSource(
				connectDropTarget(
        <div className="desc-item-wrapper" style={{ opacity, ...styles.deskItemWrapper }}>
          <div key={desc.id} className="desc-item">
              <h4>{desc.name}</h4>
              <div className="tasks">
                {desc.tasks && desc.tasks.map((task, idx) => {
                  return (
                   <Task 
									 	key={`task${task.id}`}
										task={task}
										index={idx}
										id={task.id}
										moveTask={this.props.moveTask}
										/>
                  )
                })}
              </div>
            </div>
        </div>),
			)
		)
	}
}

export default flow(
  DragSource(
    'card',
    cardSource,
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }),
  ),
  DropTarget(
    'card',
    cardTarget,
    (connect) => ({
    connectDropTarget: connect.dropTarget(),
  }))
)(Card);
