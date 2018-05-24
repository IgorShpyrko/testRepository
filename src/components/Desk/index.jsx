import React from 'react';
import './index.css';

class Desk extends React.PureComponent{
  render() {
    
    let header = +this.props.name.toString().length < 10 ? this.props.name : `${this.props.name.substr(0, 10)}...`;


    return(
      <React.Fragment>
        <div className='desk' onClick={this.props.onClick} id={this.props.id}>
        <button className='del-button' onClick={this.props.onClickDelete}>Delete Desk</button>
          <h1>{header}</h1>
          <div className='desk-content'>
            {this.props.content}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Desk;