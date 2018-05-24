import React from 'react';
import './index.css';

class Desk extends React.PureComponent{
  render() {
    return(
      <React.Fragment>
        <div className='desk' onClick={this.props.onClick} id={this.props.id}>
        <button className='del-button' onClick={this.props.onClickDelete}>Delete Desk</button>
          <h1>{this.props.name}</h1>
          <div className='desk-content'>
            {this.props.content}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Desk;