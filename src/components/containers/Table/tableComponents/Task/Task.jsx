import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import flow from 'lodash.flow';
import { DragSource, DropTarget } from 'react-dnd';
import './Task.css';

const taskDragSource = {
	beginDrag(props) {
		return {
			id: props.id,
			taskIndex: props.taskIndex,
			taskParent: props.deskIndex
		}
	}
};

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

	handleApplyChangeTask = (value, id) => {
		this.props.handleChangeTask(value, id);
		this.setState({
			edit: false,
			prevValue: ''
		});
	};

	handleKeyPress = (e, task) => {
		if (e.keyCode === 27) {
			this.handleCancelChangeTask();
			return;
		};
		
		if (e.keyCode === 13) {
			if (e.target.value.trim() === '') {
				this.handleCancelChangeTask();
				return;
			};
			this.handleApplyChangeTask(this.state.value, task.id);
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
		const { task, isDragging, connectDragSource, connectDropTarget, handleRemoveTask, deskIndex } = this.props;
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
										onKeyDown={ e => {this.handleKeyPress(e, task)} }
									/>
							}
						</div>
						<span className='delete-task' onClick={() => handleRemoveTask(task, deskIndex)}>
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
