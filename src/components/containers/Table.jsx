import React, { Component } from 'react';
import { connect } from 'react-redux';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import { fetchDesksAction } from '../../actions/desks';
import Desk from './tableComponents/Desk';

const update = require('immutability-helper');
const styles = {
  desksWrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  }
}

class Table extends Component {
  state = { 
    desks: null
  }

  moveDesk = (dragIndex, hoverIndex) => {
		const { desks } = this.state
    const dragDesk = desks[dragIndex]

		this.setState(
			update(this.state, {
				desks: {
					$splice: [[dragIndex, 1], [hoverIndex, 0, dragDesk]],
				}
			}),
		)
  }

  moveTask = (taskIndex, deskIndex, hoverTaskIndex, draggedTask) => {
    const desks = JSON.parse(JSON.stringify(this.state.desks))

    function returnTask (desks, draggedTask) {
      let searchedTask;
      desks.forEach(desk => {
        desk.tasks.forEach(task => {
          if (task.id === draggedTask.id) {
            searchedTask = task
          }
        })
      })
      return searchedTask
    }

    const dragTask = returnTask(desks, draggedTask) 

    if (hoverTaskIndex === null && (!desks[deskIndex].tasks || desks[deskIndex].tasks.length === 0)) {
      desks[deskIndex].tasks = [dragTask]
    } else {
      desks.map(desk => {
        const newTasks = []
        desk.tasks.filter(task => {
          if (task.id !== dragTask.id) {
            newTasks.push(task)
          }
          return null
        })
        desk.tasks = newTasks
        return desk
      })
      dragTask && desks[deskIndex].tasks.splice(hoverTaskIndex, 0, dragTask)
    }

		this.setState({
      desks: desks
    })
  }

  componentDidMount() {
    const desks = JSON.parse(window.localStorage.getItem('desks'))
    if (!desks) {
      this.props.fetchDesksFunction()
    } else {
      this.setState({
        desks: desks
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.desks) {
      if (this.props.desks !== prevProps.desks) {
        window.localStorage.setItem('desks', JSON.stringify(this.props.desks))
        this.setState({
          desks: this.props.desks
        })
      }
    }
    if(this.state.desks) {
      if (this.state.desks !== prevState.desks) {
        window.localStorage.setItem('desks', JSON.stringify(this.state.desks))
      }
    }
  }

  render() {
    const { desks } = this.state
    console.log()
    return (
      <React.Fragment>
        <h3>Table</h3>
        <hr />
        <div className='desks-wrapper' style={styles.desksWrapper}>
          {desks && desks.map((desk, idx) => {
            return (
              <Desk
                key={desk.id}
                deskIndex={idx}
                id={desk.id}
                desk={desk}
                moveDesk={this.moveDesk} 
                moveTask={this.moveTask}/>
            )
          })}
        </div>
      </React.Fragment>
    );
  }
}
    
const mapStateToProps = state => {
  return {
    desks: state.deskReducer.desks
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchDesksFunction: () => {
      return dispatch(fetchDesksAction())
    }
  }
}

Table = DragDropContext(HTML5Backend)(Table)
export default connect(mapStateToProps, mapDispatchToProps)(Table)