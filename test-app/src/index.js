import React from 'react';
import ReactDOM from 'react-dom';
// import DnDhtml from './components/DnDhtml';
import {Board} from './components/DnDReact';


ReactDOM.render(
  <React.Fragment>
    <Board knightPosition={[0, 0]}/>
    {/* <DnDhtml /> */}
  </React.Fragment>,
  document.getElementById('root')
);