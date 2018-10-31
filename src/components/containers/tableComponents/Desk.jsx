import * as React from 'react';
import { findDOMNode } from 'react-dom';
import flow from 'lodash.flow';
import {
	DragSource,
	DropTarget,
} from 'react-dnd';

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
		if (!component) return null;

		if (monitor.getItemType() === 'desk') {
			const dragIndex = monitor.getItem().deskIndex;
			const hoverIndex = props.deskIndex;

			if (dragIndex === hoverIndex) return;

			const hoverBoundingRect = (findDOMNode(
				component,
			)).getBoundingClientRect();

			const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
			const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2
			const clientOffset = monitor.getClientOffset()
			const hoverClientY = (clientOffset).y - hoverBoundingRect.top
			const hoverClientX = (clientOffset).x - hoverBoundingRect.left

			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				if (hoverClientX < hoverMiddleX) {
					return
				};
			};

			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				if (hoverClientX > hoverMiddleX) {
					return
				};
			};

			props.moveDesk(dragIndex, hoverIndex)
			monitor.getItem().deskIndex = hoverIndex
		};

		if (monitor.getItemType() === 'task') {
			if (!props.desk.tasks || props.desk.tasks.length === 0) {
				const item = monitor.getItem()
				props.moveTask(null, props.deskIndex, null, item)
			};
		};
	}
}

const styles = {
  deskItemWrapper: {
    border: '1px dashed black',
    margin: '5px',
    width: '200px'
  }
};

class Desk extends React.Component {
	render() {
    const { desk, onChangeTask, isDragging, connectDragSource, connectDropTarget, deskIndex, moveTask } = this.props
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
												deskIndex={deskIndex}
												moveTask={moveTask}
												onChangeTask={onChangeTask}
											/>
										)
									})}
								</div>
							</div>
					</div>
				),
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
