import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './DeskModal.css';

const modalRoot = document.getElementById('modal-root');

export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.el.className = 'modal-wrapper';
    this.el.onclick=this.handleClick;
  };

  handleClick = e => {
    if (e.target.className === this.el.className) {
      this.props.closeModal();
    };
  };

  handleDeleteDesk = () => {
    this.props.closeModal();
    this.props.deleteDesk(this.props.deskIndex);
  }

  componentDidMount() {
    modalRoot.appendChild(this.el);
  };

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  };
  
  render() {
    return ReactDOM.createPortal(
      <div className='modal-container'>
        {this.props.children}
        <h3>Some staff Here</h3>
        <div onClick={this.handleDeleteDesk}>Delete desk</div>
        <div onClick={this.props.closeModal}>Close Modal</div>
      </div>,
      this.el,
    );
  };
};