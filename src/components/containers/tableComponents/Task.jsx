import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import flow from 'lodash.flow';
import {
	DragSource,
	DropTarget/* ,
	ConnectDropTarget,
	ConnectDragSource,
	DropTargetMonitor,
	DropTargetConnector,
	DragSourceConnector,
	DragSourceMonitor */
} from 'react-dnd';

const taskDragSource = {
	beginDrag(props) {
		return {
			id: props.id,
			taskIndex: props.taskIndex,
			taskParent: props.deskIndex
		}
	}
}

const taskDropTarget = {
	
	hover(props, monitor, component) {
		// if (!component) {
		// 	return null
		// }
		const taskIndex = monitor.getItem().taskIndex
		const hoverTaskIndex = props.taskIndex

		// Don't replace items with themselves
		if (taskIndex === hoverTaskIndex) {
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

		// Determine mouse position
		const clientOffset = monitor.getClientOffset()

		// Get pixels to the top
    const hoverClientY = (clientOffset).y - hoverBoundingRect.top
    
    // Get pixels to the left
    const hoverClientX = (clientOffset).x - hoverBoundingRect.left

		// Dragging downwards
		if (taskIndex < hoverTaskIndex && hoverClientY < hoverMiddleY) {
      if (hoverClientX < hoverMiddleX) {
        return
      }
		}

		// Dragging upwards
		if (taskIndex > hoverTaskIndex && hoverClientY > hoverMiddleY) {
      // if (hoverClientX > hoverMiddleX) {
        return
      // }
		}

		// Time to actually perform the action
		const draggedTask = monitor.getItem()
		props.moveTask(taskIndex, props.deskIndex, hoverTaskIndex, draggedTask)

		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
		monitor.getItem().taskIndex = hoverTaskIndex
	},
}

class Task extends Component {
  state = {  }
  render() {
    const {
      task,
			// isDragging,
			connectDragSource,
			connectDropTarget,
    } = this.props
    return (
			connectDragSource &&
			connectDropTarget &&
			connectDragSource(
				connectDropTarget(
          <div className="task">
            {task.value}
          </div>
      )
			)
		);
  }
}

export default flow(
  DragSource(
    'task',
    taskDragSource,
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }),
  ),
  DropTarget(
    'task',
    taskDropTarget,
    (connect) => ({
    connectDropTarget: connect.dropTarget(),
  }))
)(Task);
