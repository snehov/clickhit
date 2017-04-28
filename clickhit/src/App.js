import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Grid, Row, Col } from 'react-bootstrap';

class App extends Component {
  render() {
    return (
            <div className="App">
            <Grid>
                <Row>
                <Col md={4}>Čtyřka</Col>
                <Col md={8}>Osmička</Col>
                </Row>
               
                
            </Grid>
            </div>
            
                
    );
  }
};

export default App;
