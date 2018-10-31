import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import flow from 'lodash.flow';
import { DragSource, DropTarget } from 'react-dnd';

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
		const taskIndex = monitor.getItem().taskIndex;
		const hoverTaskIndex = props.taskIndex;

		if (taskIndex === hoverTaskIndex) return;

		const hoverBoundingRect = (findDOMNode(
			component,
		)).getBoundingClientRect();
		
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
		const clientOffset = monitor.getClientOffset();
    const hoverClientY = (clientOffset).y - hoverBoundingRect.top;
    const hoverClientX = (clientOffset).x - hoverBoundingRect.left;

		if (taskIndex < hoverTaskIndex && hoverClientY < hoverMiddleY) {
      if (hoverClientX < hoverMiddleX) {
        return
      }
		};

		if (taskIndex > hoverTaskIndex && hoverClientY > hoverMiddleY) return;
		const draggedTask = monitor.getItem();
		props.moveTask(taskIndex, props.deskIndex, hoverTaskIndex, draggedTask);
		monitor.getItem().taskIndex = hoverTaskIndex;
	},
}

class Task extends Component {
  state = {  }
  render() {
    const {
      task,
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
