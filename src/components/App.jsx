import React, { Component } from 'react';
import Header from './containers/Header/Header';
import Table from './containers/Table/Table';
import Footer from './containers/Footer/Footer';

export default class App extends Component {
  state = {  }
  render() {
    return (
      <div className="app-container">
        <Header />
        <Table />
        <Footer />
      </div>
    );
  }
}