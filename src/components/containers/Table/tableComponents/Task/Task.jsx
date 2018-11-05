import React, { Component } from 'react';
import flow from 'lodash.flow';
// import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import './Task.css';

const taskDragSource = {
	beginDrag(props) {
		return {
			id: props.id,
			taskIndex: props.taskIndex,
			taskParent: props.deskIndex
		}
	},
	endDrag(props) {
		props.clearPrevDesk()
	}
};

const taskDropTarget = {
	hover(props, monitor, component) {
		
		const hoverTaskIndex = props.taskIndex;
		const draggedTask = monitor.getItem();
		const dragTaskIndex = draggedTask.taskIndex;
		const hoverDeskIndex = props.deskIndex;
		const dragFromDeskIndex = draggedTask.taskParent;
		
		if (props.task && props.task.length !== 0) {
			// console.log('Task Task Task Task Task Task Task Task')
			props.moveTask(hoverDeskIndex, dragTaskIndex, dragFromDeskIndex, hoverTaskIndex);
		}
		monitor.getItem().taskIndex = hoverTaskIndex;
	},
};

class Task extends Component {
	state = {
		value: '',
		edit: false,
		prevValue: ''
	};

	handleChange = e => {
		this.setState({
			value: e.target.value
		});
	};

	handleCancelChangeTask = () => {
		this.setState({
			edit: false,
			value: this.state.prevValue,
			prevValue: ''
		});
	};

	handleApplyChangeTask = (value, deskIndex, taskIndex) => {
		this.props.handleChangeTask(value, deskIndex, taskIndex);
		this.setState({
			edit: false,
			prevValue: ''
		});
	};

	handleKeyPress = (e, deskIndex, taskIndex) => {
		if (e.keyCode === 27) {
			this.handleCancelChangeTask();
			return;
		};
		
		if (e.keyCode === 13) {
			if (e.target.value.trim() === '') {
				this.handleCancelChangeTask();
				return;
			};
			this.handleApplyChangeTask(this.state.value, deskIndex, taskIndex);
		};
	};
	
	onClickTask = (e, task) => {
		this.setState(prevState => {
			return {
				edit: true,
				prevValue: prevState.value
			};
		});
	};

	componentDidMount() {
		this.setState({
			value: this.props.task.value
		});
	};

	componentDidUpdate(prevProps) {
		if (prevProps.task.value !== this.props.task.value) {
			this.setState({
				value: this.props.task.value
			});
		};
	};

  render() {
		const { task, isDragging, connectDragSource, connectDropTarget, handleRemoveTask, deskIndex, taskIndex } = this.props;
		const { edit } = this.state;

		const wrapperClassName = isDragging ? 'task-wrapper tw-dragging' : 'task-wrapper';

		return (
			connectDragSource &&
			connectDropTarget &&
			connectDragSource(
				connectDropTarget(
					<div className={wrapperClassName}>
						<div className='task' onClick={ e => {!isDragging && this.onClickTask(e, task)} }>
							{!edit
								? <span className='task-value'>{this.state.value}</span>
								: <input 
										autoFocus
										value={this.state.value}
										onChange={this.handleChange}
										onBlur={this.handleCancelChangeTask}
										onKeyDown={ e => {this.handleKeyPress(e, deskIndex, taskIndex)} }
									/>
							}
						</div>
						<span className='delete-task' onClick={() => handleRemoveTask(taskIndex, deskIndex)}>
							&#x2715;
						</span>
          </div>
      	)
			)
		);
  };
};

export default flow(
  DragSource(
    'task',
    taskDragSource,
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
			isDragging: monitor.isDragging()
    }),
  ),
  DropTarget(
    'task',
    taskDropTarget,
    (connect) => ({
    connectDropTarget: connect.dropTarget(),
  }))
)(Task);
