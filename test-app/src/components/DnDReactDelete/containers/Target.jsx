import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';

const style = {
  border: '1px solid blue',
  width: '300px',
  height: '200px'
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    hovered: monitor.isOver(),
    item: monitor.getItem()
  }
}

class Target extends Component {
  render() {
    const { connectDropTarget, hovered, item } = this.props
    const backgroundColor = hovered ? 'lightgreen' : 'white'

    return connectDropTarget(
      <div className="target" style={{background: backgroundColor, ...style}}>
        Target
      </div>
    )
    // return (
    //   <div className="target" style={style}>
    //     Target
    //   </div>
    // );
  }
}

export default DropTarget('item', {}, collect)(Target);