import React, {Component} from "react";
import imgSrc from '../media/website.jpg'

const styles = {
  div: {
    border:'1px solid red',
    width: '400px',
    height: '400px'
  },
  wrapper: {
    marginTop: '50px',
    display: 'flex',
    justifyContent: 'space-around'
  }
}

const images = [
  imgSrc,
  imgSrc,
  imgSrc,
  imgSrc,
  imgSrc,
  imgSrc,
  imgSrc
]

export default class DnDhtml extends Component {

  handleDragStart = (e) => {
    e.dataTransfer.setData('image', e.target.id)
  }

  handleDrop = (e) => {
    e.preventDefault()
    const data = e.dataTransfer.getData('image')
    e.target.appendChild(document.getElementById(data))
  }

  handleDrag = (e) => {
    e.preventDefault()
  }

  render() {
    return(
      <React.Fragment>
        <h3>HTML Drag&Drop</h3>
        {images.map((img,idx) => {
          return (
            <img 
              id={`image${idx}`}
              key={idx}
              src={imgSrc}
              alt=''
              width='200px'
              draggable='true'
              onDragStart={e => this.handleDragStart(e)}
            />
          )
        })}
        <div className='DragAndDropWrapper' style={{...styles.wrapper}}>
          <div onDragOver={e => this.handleDrag(e)} onDrop={e => {this.handleDrop(e)}} style={{ ...styles.div }}></div>
          <div onDragOver={e => this.handleDrag(e)} onDrop={e => {this.handleDrop(e)}} style={{ ...styles.div }}></div>
        </div>
      </React.Fragment>
    )
  }
}