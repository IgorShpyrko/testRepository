import React, { Component } from 'react';
import Item from './containers/Item';
import Target from './containers/Target';
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'

class DnDReactDelete extends Component {
  state = { 
    items: [
      { id: 1, name: 'first' },
      { id: 2,  name: 'second' },
      { id: 3, name: 'third' },
      { id: 4, name: 'forth' }
    ]
  }
  
  deleteItem = (id)  => {
    console.log('deleting item',id)
    this.setState(prevState => {
      let items = prevState.items;
      const index = items.findIndex(item => item.id === id);
      items.splice(index, 1);

      return items
    });
  }

  render() {
    return (
      <div className='app-container'>
        <h3>DnDReactDelete</h3>
        <div className='item-container'>
          {this.state.items.map(item => {
            return <Item item={item} key={item.id} handleDrop={(id) => {this.deleteItem(id)}}/>
          })}
        </div>
        <Target />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(DnDReactDelete)