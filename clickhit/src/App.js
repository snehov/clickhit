import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Grid, Row, Col } from 'react-bootstrap';

class App extends Component {
  render() {
    return (
            <div className="App">
            <Grid className="headBar" fluid="true">
                <Row>
                <Col md={4}>levy roh</Col>
                <Col md={4}><div className="logo">ClickHit!</div></Col>
                <Col md={4}>
                    <Row>
                        <Col md={6}>9/15</Col>
                        <Col md={6} className="score">5344</Col>
                    </Row>
                </Col>
                
                </Row>
               
                
            </Grid>
            </div>
            
                
    );
  }
};

export default App;
