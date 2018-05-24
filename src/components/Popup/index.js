import React from 'react';
import './index.css'

class Popup extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      configName: false,
      configContent: false,
      name: '',
      content: ''
    };
    this.handleCangeContentInput = this.handleCangeContentInput.bind(this);
    this.handleCloseEditContent = this.handleCloseEditContent.bind(this);
    this.handleApplyNewContent = this.handleApplyNewContent.bind(this);
    this.handleEditContent = this.handleEditContent.bind(this);
    this.handleCangeNameInput = this.handleCangeNameInput.bind(this);
    this.handleCloseEditName = this.handleCloseEditName.bind(this);
    this.handleApplyNewName = this.handleApplyNewName.bind(this);
    this.handleEditName = this.handleEditName.bind(this);
  };

  // Configure Content input...
  handleCangeContentInput(e){
    this.setState({
      content: e.target.value
    });
  };

  handleApplyNewContent(){
    this.props.handleChangeDesk(this.state.name, this.state.content)
    this.handleCloseEditContent();
  };

  handleCloseEditContent(){
    this.setState({
      configContent: false
    })
  };

  handleEditContent(){
    this.setState({
      configContent: true
    })
  };

  // Configure Name input...
  handleCangeNameInput(e){
    this.setState({
      name: e.target.value
    });
  };

  handleApplyNewName(){
    this.props.handleChangeDesk(this.state.name, this.state.content)
    this.handleCloseEditName();
  };

  handleCloseEditName(){
    this.setState({
      configName: false
    })
  };

  handleEditName(){
    this.setState({
      configName: true
    })
  };

  render(){
    let arr = this.props.desks.filter((item) => {
      return Number(item.id) === Number(this.props.popupTarget.id)
    });
       
    return(
      <div className='popup-wrapper' onClick={this.props.onClosePopup}>
        
        <div className='popup' 
          onClick={(e) => {
            e.stopPropagation();
          }}>
          <div className='close-icon' onClick={this.props.onClosePopup}>&times;</div>
          <h3>Configure {arr[0].name} Desk</h3>
          <div className='config-desk'>
            <div className='config-name'>
            {this.state.configName ? null :
              <React.Fragment>
                <span>name: {arr[0].name}</span>
                <button 
                  className='config-name-btn'
                  onClick={this.handleEditName}
                  >
                    <span>configure name</span>
                </button>
              </React.Fragment>}
              {this.state.configName ? 
                <React.Fragment>
                  <input type='text' onChange={this.handleCangeNameInput}/>
                  <button onClick={this.handleApplyNewName}> Apply </button>
                  <button onClick={this.handleCloseEditName}> Close </button>
                </React.Fragment> : null}
            </div>
            <div className='config-content'>
            {this.state.configContent ? null :
              <React.Fragment>
                <span>content: {arr[0].content}</span>
                <button 
                  className='config-content-btn'
                  onClick={this.handleEditContent}
                  >
                    <span>configure content</span>
                </button>
              </React.Fragment>}
              {this.state.configContent ? 
                <React.Fragment>
                  <input type='text' onChange={this.handleCangeContentInput}/>
                  <button onClick={this.handleApplyNewContent}> Apply </button>
                  <button onClick={this.handleCloseEditContent}> Close </button>
                </React.Fragment> : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Popup;