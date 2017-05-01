import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

export default class ControlPanel extends React.Component{
    
    constructor(props){
        super();
        props.score;
    }    

    render() {
        
        return (
                <Grid className="headBar" fluid={true}>
                    <Row>
                        <Col xs={4}>levy roh</Col>
                        <Col xs={4}><div className="logo" >ClickHit!</div></Col>
                        <Col xs={4}>
                        <Row>
                            <Col xs={4} md={6}>{this.props.app.state.targetNO}/{this.props.app.numTargets}</Col>
                            <Col xs={8} md={6} className="score">{this.props.score}</Col>
                        </Row>
                        </Col>
                
                    </Row>
                
                
                </Grid>
                );
    }
}