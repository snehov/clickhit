import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

export default class ControlPanel extends React.Component{
    
    constructor(props){
        super();
        props.score;
    }    

    render() {
        let userName;
        if(this.props.app.state.userName != ""){
            userName = this.props.app.state.userName;
        }
        return (
                <Grid className="headBar" fluid={true}>
                    <Row>
                        <Col md={4} sm={4} xsHidden={true}>
                            <Row>
                                <Col xs={4} smHidden={true} md={6} >Level 1</Col>
                                <Col xs={8} sm={12} md={6} className="user">{userName}</Col>
                            </Row>
                        </Col>
                        <Col xs={6} sm={4} md={4}><div className="logo" >ClickHit!</div></Col>
                        <Col xs={6} sm={4} md={4}>
                            <Row>
                                <Col xs={4} md={6}>{this.props.app.state.targetNO}/{this.props.app.numTargets}</Col>
                                <Col xs={8} md={6} className="score" onClick={(e)=>this.props.app.loadScore()}>{this.props.score}</Col>
                            </Row>
                        </Col>
                
                    </Row>
                
                
                </Grid>
                );
    }
}