import React, { Component } from 'react';
import { connect } from 'react-redux';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import { fetchDescsAction } from '../../actions/descs';
import Card from './components/Card'

const update = require('immutability-helper');

const styles = {
  cardsWrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  }
}


class Table extends Component {
  state = { 
    descs: null
  }

  moveCard = (dragIndex, hoverIndex) => {
		const { descs } = this.state
		const dragDesc = descs[dragIndex]

		this.setState(
			update(this.state, {
				descs: {
					$splice: [[dragIndex, 1], [hoverIndex, 0, dragDesc]],
				},
			}),
		)
  }

  componentDidMount() {
    const descs = JSON.parse(window.localStorage.getItem('descs'))
    console.log(descs)
    if (!descs) {
      this.props.fetchDescsFunction()
    } else {
      this.setState({
        descs: descs
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.descs) {
      if (this.props.descs !== prevProps.descs) {
        window.localStorage.setItem('descs', JSON.stringify(this.props.descs))
        this.setState({
          descs: this.props.descs
        })
      }
    }
    if(this.state.descs) {
      if (this.state.descs !== prevState.descs) {
        window.localStorage.setItem('descs', JSON.stringify(this.state.descs))
      }
    }
  }

  render() {
    const { descs } = this.state
    return (
      <React.Fragment>
        <h3>Table</h3>
        <hr />
        <div className='cards-wrapper' style={styles.cardsWrapper}>
          {descs && descs.map((desc, idx) => {
            return (
              <Card
                key={desc.id}
                index={idx}
                id={desc.id}
                desc={desc}
                moveCard={this.moveCard} />
            )
          })}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    descs: state.descReducer.descs
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchDescsFunction: () => {
      return dispatch(fetchDescsAction())
    }
  }
}
Table = DragDropContext(HTML5Backend)(Table)
export default connect(mapStateToProps, mapDispatchToProps)(Table)