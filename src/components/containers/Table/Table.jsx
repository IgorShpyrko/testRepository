import React, { Component } from 'react';
import { connect } from 'react-redux';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import './Table.css';

import { fetchDesksAction } from '../../../actions/desks';
import Desk from './tableComponents/Desk/Desk';

const update = require('immutability-helper');

class Table extends Component {
  state = { 
    desks: null,
    prevDesk: null
  };
  
  handleDeleteDesk = (deskIndex) => {
    this.setState(
			update(this.state, {
				desks: {
					$splice: [
            [deskIndex, 1]
          ],
				}
			}),
		);
  };

  handleAddDesk = () => {
    const { desks } = this.state

    this.setState(
			update(this.state, {
				desks: {
					$splice: [
            [desks.length,
              0,
              {
                id: desks.length,
                name: `new Desk`,
                tasks: []
              }
            ]
          ],
				}
			}),
		);
  };

  moveDesk = (dragIndex, hoverIndex) => {
		const { desks } = this.state;
    const dragDesk = desks[dragIndex];

		this.setState(
			update(this.state, {
				desks: {
					$splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragDesk]
          ],
				}
			}),
		);
  };

  handleRemoveTask = (taskIndex, deskIndex) => {
    this.setState(
      update(this.state, {
        desks:
          {
            [deskIndex]: {
              tasks: {
                $splice: [[taskIndex, 1]]
              }
            }
          }
        }
      ),
    );
  }

  handleAddTask = (currentDeskIdx) => {
    const { desks } = this.state;

    this.setState(
      update(this.state, {
        desks:
          {
            [currentDeskIdx]: {
              tasks: 
              desks[currentDeskIdx].tasks.length !== 0 
              ? {
                $splice: [
                  [
                    desks[currentDeskIdx].tasks.length,
                    0,
                    {
                      id: `${currentDeskIdx}_${desks[currentDeskIdx].tasks.length}`,
                      value: 'new Task'
                    }
                  ]
                ]
              }
              : {
                $set: [
                    {
                      id: `${currentDeskIdx}_${desks[currentDeskIdx].tasks.length}`,
                      value: 'new Task'
                    }
                ]
              }
            }
          }
        }
      ),
    );
  };

  handleChangeTask = (taskNewValue, deskIndex, taskIndex) => {
    this.setState(
      update(this.state, {
        desks:
          {
            [deskIndex]: {
              tasks: {
                [taskIndex] : {
                  value: {$set: taskNewValue}
                }
              }
            }
          }
        }
      ),
    );
  };

  clearPrevDesk = () => {
    this.setState({
      prevDesk: null
    });
  }

  moveTask = (hoverDeskIndex, dragTaskIndex, dragFromDeskIndex, hoverTaskIndex) => {
    // if (hoverDeskIndex === dragFromDeskIndex && dragTaskIndex === hoverTaskIndex) return
  
    const { desks } = this.state;
    const prevDesk = this.state.prevDesk !== null ? this.state.prevDesk : dragFromDeskIndex;
    const dragTask = desks[prevDesk].tasks[dragTaskIndex];
    // console.log('desks[prevDesk] :', desks[prevDesk].tasks);
    // console.log('dragTaskIndex :', dragTaskIndex);

    // console.log('dragTask :', dragTask);
    
    if (prevDesk !== hoverDeskIndex) {
      this.setState(
        update(this.state, {
          prevDesk: {$set: hoverDeskIndex},
          desks:
            {
              [hoverDeskIndex]: hoverTaskIndex !== undefined ? {
                tasks: {
                  $splice: [[hoverTaskIndex, 0, dragTask]]
                }
              } : {
                tasks: {
                  $push: [dragTask]
                }
              },
              [prevDesk]: {
                tasks: {
                  $splice: [[dragTaskIndex, 1]]
                }
              }
            }
          }
        ),
      );
    } else {
      this.setState(
        update(this.state, {
          prevDesk: {$set: hoverDeskIndex},
          desks:
            {
              [hoverDeskIndex]: {
                tasks: {
                  $splice: [
                    [dragTaskIndex, 1],
                    [hoverTaskIndex, 0, dragTask],
                  ]
                }
              }
            }
          }
        ),
      );
    }
    setTimeout(() => {
      console.log('desks[hoverDeskIndex] :', desks[hoverDeskIndex].tasks);
    }, 20)
  };

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
        {
          desks
          ? (
            <div className='desks-wrapper'>
              {desks.map((desk, idx) => {
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
                    clearPrevDesk={this.clearPrevDesk}
                    handleChangeTask={this.handleChangeTask}/>
                    )
                  })}
                <div className='add-desk' onClick={this.handleAddDesk}>
                  <span>Click to add desk</span>
                </div>
              </div>
            )
          : <div>Fetching desks</div>
        }
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