import React, { Component } from 'react';
import Header from './containers/Header';
import Table from './containers/Table';
import Footer from './containers/Footer';

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