import React, { Component } from 'react';
import { connect } from 'react-redux';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import { fetchDesksAction } from '../../actions/desks';
import Card from './tableComponents/Card'

const update = require('immutability-helper');

const styles = {
  cardsWrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  }
}

class Table extends Component {
  state = { 
    desks: null
  }

  moveCard = (dragIndex, hoverIndex) => {
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

  moveTask = (dragIndex, cardIndex, hoverIndex) => {
    console.log('dragIndex :', dragIndex);
    console.log('cardIndex :', cardIndex);
    console.log('hoverIndex :', hoverIndex);
    
    const { desks } = this.state
    const dragTask = desks[cardIndex - 1].tasks[dragIndex]

		this.setState(
			update(this.state, {
        desks: {
          [cardIndex - 1]: {
            tasks: {
              $splice: [[dragIndex, 1], [hoverIndex, 0, dragTask]],
            }
          }
        }
      }),
		)
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
    return (
      <React.Fragment>
        <h3>Table</h3>
        <hr />
        <div className='cards-wrapper' style={styles.cardsWrapper}>
          {desks && desks.map((desk, idx) => {
            return (
              <Card
                key={desk.id}
                index={idx}
                id={desk.id}
                desk={desk}
                moveCard={this.moveCard} 
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