import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default class ResultWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hidden: true}
        //this.props.app;
        this.props.pokus;
    }

    render() {

        return(
                <div className={[(this.props.showResultWindow ? 'targetVisible' : 'targetHidden'), 'static-modal', 'resultWindow'].join(' ')}>
                    <Modal.Dialog>
                        <Modal.Header>
                            <Modal.Title>Your ClickHit! result</Modal.Title>
                        </Modal.Header>
                
                        <Modal.Body>
                        Your score is: <span className="score">{this.props.app.state.score}</span><br/>
                        Your average react time is: <span className="avgTime">{this.props.app.state.resultData.avgTime}</span> ms <br/>
                             
                            
                        </Modal.Body>
                
                        <Modal.Footer>
                            <Button>Close</Button>
                            <Button bsStyle="primary">Save changes</Button>
                        </Modal.Footer>
                
                    </Modal.Dialog>
                </div>
                );
    }
}