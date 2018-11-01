import React, { Component } from 'react';
import { connect } from 'react-redux';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import './Table.css';

import { fetchDesksAction } from '../../../actions/desks';
import Desk from './tableComponents/Desk/Desk';

const update = require('immutability-helper');

function recursiveDeepCopy(o) {
  let newO;
  let i;

  if (typeof o !== 'object') return o;
  if (!o) return o;

  if ('[object Array]' === Object.prototype.toString.apply(o)) {
    newO = [];
    for (i = 0; i < o.length; i += 1) {
      newO[i] = recursiveDeepCopy(o[i]);
    }
    return newO;
  }

  newO = {};
  for (i in o) {
    if (o.hasOwnProperty(i)) {
      newO[i] = recursiveDeepCopy(o[i]);
    }
  }
  return newO;
};

class Table extends Component {
  state = { 
    desks: null
  };
  
  handleDeleteDesk = (deletedDesk) => {
    const { desks } = this.state;

    const newDesks = desks.filter(desk => {
      if (desk.id !== deletedDesk.id) {
        return desk
      } else {
        return null
      }
    });

    this.setState({
      desks: newDesks
    });
  };

  handleAddDesk = () => {
    const { desks } = this.state;
    let maxDeskId = 0;

    desks.forEach(desk => {
      if (maxDeskId < desk.id) {
        maxDeskId = desk.id
      };
    });

    let newDesk = {
      id: maxDeskId + 1,
      name: `new Desk`,
      tasks: []
    };

    this.setState({
      desks: [
        ...desks,
        newDesk
      ]
    });
  };

  moveDesk = (dragIndex, hoverIndex) => {
		const { desks } = this.state;
    const dragDesk = desks[dragIndex];

		this.setState(
			update(this.state, {
				desks: {
					$splice: [[dragIndex, 1], [hoverIndex, 0, dragDesk]],
				}
			}),
		);
  };

  handleRemoveTask = (taskToDelete, deskIndex) => {
    const { desks } = this.state;
    let newDesks = recursiveDeepCopy(desks);

    newDesks[deskIndex].tasks = newDesks[deskIndex].tasks.filter(task => {
      if (taskToDelete.id !== task.id) {
        return task
      } else {
        return null
      }
    })

    this.setState({
      desks: newDesks
    })
  }

  handleAddTask = (currentDesk) => {
    const { desks } = this.state;
    let maxExistingId = 0;
    
    desks.forEach(desk => {
      desk.tasks && desk.tasks.forEach(task => {
        if (+task.id.split('_')[0] === currentDesk.id) {
          if (maxExistingId < +task.id.split('_')[1]) {
            maxExistingId = +task.id.split('_')[1]
          }
        };
      });
    });
    
    let newTask = {
      id: `${currentDesk.id}_${maxExistingId + 1}`,
      value: 'new Task'
    };

    let newDesks = recursiveDeepCopy(desks);

    newDesks.forEach(desk => {
      if (desk.id === currentDesk.id) {
        desk.tasks = desk.tasks.concat([newTask])
      }
    })

    this.setState({
      desks: newDesks
    });
  };

  handleChangeTask = (taskNewValue, taskId) => {
    const desks = recursiveDeepCopy(this.state.desks);

    desks.forEach(desk => {
      desk.tasks && desk.tasks.forEach(task => {
        if (task.id === taskId) {
          task.value = taskNewValue
        }
      })
    })

    this.setState({
      desks: desks
    })
  };

  moveTask = (taskIndex, deskIndex, hoverTaskIndex, draggedTask) => {
    const desks = recursiveDeepCopy(this.state.desks);

    function returnTask (desks, draggedTask) {
      let searchedTask;
      desks.forEach(desk => {
        desk.tasks.forEach(task => {
          if (task.id === draggedTask.id) {
            searchedTask = task;
          };
        })
      });
      return searchedTask;
    };

    const dragTask = returnTask(desks, draggedTask);

    desks.map(desk => {
      const newTasks = [];

      desk.tasks.filter(task => {
        if (task.id !== dragTask.id) {
          newTasks.push(task)
        }
        return null;
      });
      desk.tasks = newTasks;
      return desk;
    });

    if (hoverTaskIndex === null && (!desks[deskIndex].tasks || desks[deskIndex].tasks.length === 0)) {
      desks[deskIndex].tasks = [dragTask];
    } else {
      dragTask && desks[deskIndex].tasks.splice(hoverTaskIndex, 0, dragTask);
    };

		this.setState({
      desks: desks
    });
  }

  componentDidMount() {
    const desks = JSON.parse(window.localStorage.getItem('desks'));

    if (!desks) {
      this.props.fetchDesksFunction()
    } else {
      this.setState({
        desks: desks
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.desks) {
      if (this.props.desks !== prevProps.desks) {
        window.localStorage.setItem('desks', JSON.stringify(this.props.desks));
        this.setState({
          desks: this.props.desks
        });
      };
    };

    if(this.state.desks) {
      if (this.state.desks !== prevState.desks) {
        window.localStorage.setItem('desks', JSON.stringify(this.state.desks));
      };
    };
  };

  render() {
    const { desks } = this.state;

    return (
      <React.Fragment>
        <h3>Table</h3>
        <hr style={{margin: 0}}/>
        <div className='desks-wrapper'>
          {desks && desks.map((desk, idx) => {
            return (
              <Desk
                key={idx}
                deskIndex={idx}
                id={desk.id}
                desk={desk}
                moveDesk={this.moveDesk}
                moveTask={this.moveTask}
                handleAddTask={this.handleAddTask}
                handleRemoveTask={this.handleRemoveTask}
                handleDeleteDesk={this.handleDeleteDesk}
                handleChangeTask={this.handleChangeTask}/>
            )
          })}
          <div className='add-desk' onClick={this.handleAddDesk}>
            <span>Click to add desk</span>
          </div>
        </div>
      </React.Fragment>
    );
  };
};
    
const mapStateToProps = state => {
  return {
    desks: state.deskReducer.desks
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchDesksFunction: () => {
      return dispatch(fetchDesksAction())
    }
  }
};

Table = DragDropContext(HTML5Backend)(Table);
export default connect(mapStateToProps, mapDispatchToProps)(Table);