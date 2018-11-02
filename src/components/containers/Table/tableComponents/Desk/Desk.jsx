import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import flow from 'lodash.flow';
import {
	DragSource,
	DropTarget,
} from 'react-dnd';

import Task from '../Task/Task';
import DeskModal from '../DeskModal/DeskModal';

import './Desk.css';

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
			console.log('props', props)
			const dragIndex = monitor.getItem().deskIndex;
			// console.log('dragIndex :', dragIndex);
			const hoverIndex = props.deskIndex;
			// console.log('hoverIndex :', hoverIndex);
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

			const hoverDeskIndex = props.deskIndex;
			console.log('hoverDeskIndex :', hoverDeskIndex);

			const dragTaskIndex = monitor.getItem().taskIndex;
			console.log('dragTaskIndex :', dragTaskIndex);

			props.moveTask(hoverDeskIndex, dragTaskIndex)
		};
	}
}

class Desk extends Component {
	state = {
		isModalOpened: false
	};

	openModal = (desk) => {
		this.setState({
			isModalOpened: true
		});
	};

	closeModal = (desk) => {
		this.setState({
			isModalOpened: false
		});
	};

	render() {
    const {
			desk,
			handleChangeTask,
			isDragging,
			connectDragSource,
			connectDropTarget,
			deskIndex,
			moveTask,
			handleAddTask,
			handleRemoveTask,
			handleDeleteDesk
		} = this.props;

		const opacity = isDragging ? 0.5 : 1;

		return (
			connectDragSource &&
			connectDropTarget &&
			connectDragSource(
				connectDropTarget(
					<div className='desk-item-wrapper' style={{opacity}}>
						{this.state.isModalOpened && <DeskModal desk={desk} closeModal={this.closeModal} deleteDesk={handleDeleteDesk}/>}
						<div className='desk-item'>
							<div className='header-wrapper'>
								<h3>{desk.name}</h3>
								<span onClick={this.openModal}>&hellip;</span>
							</div>
							<div className='tasks'>
								{desk.tasks && desk.tasks.map((task, idx) => {
									return (
										<Task 
											key={idx}
											id={task.id}
											task={task}
											taskIndex={idx}
											deskIndex={deskIndex}
											moveTask={moveTask}
											handleChangeTask={handleChangeTask}
											handleRemoveTask={handleRemoveTask}
										/>
									)
								})}
							</div>
							<div className='add-task-wrapper' onClick={() => handleAddTask(desk)}>
								<span className='add-task-title'>Add task</span>
								<span className='add-task-icon'>+</span>
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
