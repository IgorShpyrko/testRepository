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

const deskDragSource = {
	beginDrag(props) {
		return {
			id: props.id,
			deskIndex: props.deskIndex,
		}
	},
}

const deskDropTarget = {
	hover(props, monitor, component) {
		if (!component) {
			return null
		}
		// console.log(monitor.getItemType())
		const type = monitor.getItemType()
		if (type === 'desk') {
			const dragIndex = monitor.getItem().deskIndex
			const hoverIndex = props.deskIndex

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
				props.moveDesk(dragIndex, hoverIndex)

				// Note: we're mutating the monitor item here!
				// Generally it's better to avoid mutations,
				// but it's good here for the sake of performance
				// to avoid expensive index searches.
				monitor.getItem().deskIndex = hoverIndex
			}
			
			else if (type === 'task') {
				const item = monitor.getItem()
				props.moveTask(null, props.deskIndex, null, item)
			}
		}
}

const styles = {
  deskItemWrapper: {
    border: '1px dashed black',
    margin: '5px',
    width: '200px'
  }
}

class Desk extends React.Component {
	render() {
		// console.log('this.props', this.props)
    const {
      desk,
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
        <div className="desk-item-wrapper" style={{ opacity, ...styles.deskItemWrapper }}>
          <div className="desk-item">
              <h4>{desk.name}</h4>
              <div className="tasks">
                {desk.tasks && desk.tasks.map((task, idx) => {
                  return (
                   <Task 
										key={task.id}
										id={task.id}
										task={task}
										taskIndex={idx}
										deskIndex={this.props.deskIndex}
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
    'desk',
    deskDragSource,
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }),
  ),
  DropTarget(
		['desk', 'task'],
    deskDropTarget,
    (connect) => ({
    connectDropTarget: connect.dropTarget(),
  }))
)(Desk);
