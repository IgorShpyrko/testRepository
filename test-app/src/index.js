import React from 'react';
import ReactDOM from 'react-dom';
import DnDHTML from './components/DnDHTML/';
import DnDReactDelete from './components/DnDReactDelete/';
import DnDReactList from './components/DnDReactList/';


ReactDOM.render(
  <React.Fragment>
    {/* <DnDReactDelete /> */}
    {/* <DnDHTML /> */}
    <DnDReactList />
  </React.Fragment>,
  document.getElementById('root')
);