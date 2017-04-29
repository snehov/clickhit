import React from 'react';
import { Modal, Button } from 'react-bootstrap';



export default class ResultWindow extends React.Component {
    constructor(props) {
        super(props);
        //const cookies = new Cookies();
        
        this.state = {window: 'welcome', 'userName': this.props.app.state.userName, 'inputDevice': this.props.app.state.inputDevice}
        //this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputChanges = this.handleInputChanges.bind(this);
        this.handleNameSubmit = this.handleNameSubmit.bind(this);
        
    }
    
    handleInputChanges(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        //console.log("change of '"+name+"' to: ",value);
        this.setState({
            [name]: value
        });
        //
        if(name == "userName"){
            this.props.app.setCookieName(value);
        }
        if(name == "inputMethod"){
            this.props.app.setCookieDevice(value);
        }
    }
    /*
    handleInputChange(event) {
        console.log("change of 'inputMethod' to: ", event.target.value);
        this.setState({'inputMethod': event.target.value});
    }*/
    
    handleNameSubmit(event){
        event.preventDefault();
        this.props.app.setCookieName(this.state.userName);
        //this.cookies.set('userName', this.state.userName, { path: '/' });
        console.log('name: ', this.state.userName)
        this.handleWindowChange('othersScore');
    }
    handleWindowChange(win){
        this.setState({'window': win});
    }
    goPlayGame(){
        this.props.app.setState({showResultWindow: false});
        this.setState({window: 'yourResult'});
        this.props.app.playGame();
        
    }
    render() {
        var window;
        if(this.state.window == 'welcome'){
            window = this.welcome();
        }else if (this.state.window == 'yourResult') {
            window = this.yourResult();
        } else if (this.state.window == 'enterName') {
            window = this.enterName();
        } else if (this.state.window == 'othersScore') {
            window = this.othersScore();
        }
        return(
                <div className={[(this.props.showResultWindow ? 'targetVisible' : 'targetHidden'), 'static-modal', 'resultWindow'].join(' ')}>
                    
                 <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>{window.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {window.body}
                    </Modal.Body>
                    <Modal.Footer>
                        {window.footer}
                    </Modal.Footer>
                </Modal.Dialog>
                
                </div>
                );
    }
    welcome(){
        var res = {};
        res.title = 'ClickHit! the minigame'
        res.body =(
                <div>
                    This is minigame created in react.<br/>
                    Object of this game is hitting randomly appeared targets. <br/> 
                    You are beeing rewared by score, according to speed of hit and dexterity.<br/>
                    Challenge with your friends who can play bigger score and lower respond time.
                    </div>
                );
        res.footer= (
                <div>
                    <Button bsStyle="primary" onClick={(e) => this.goPlayGame()} >Play!</Button>
                    </div>
                );
        return res;
    }
    yourResult() {
        var res={};
        res.title = 'Your ClickHit! result';
        
        res.body = (<div>
                    Your score is: <span className="score">{this.props.app.state.score}</span><br/>
                        Your average react time is: <span className="avgTime">{this.props.app.state.resultData.avgTime}</span> ms <br/>
                        Select yout input method:
                        <select value={this.state.inputDevice} name="inputMethod" onChange={this.handleInputChanges}>
                            <option value="mouse">Mouse</option>
                            <option value="touchpad">Touchpad (laptop)</option>
                            <option value="finger">Finger (tablet/mobile)</option>
                            <option value="ohter">Other (console, etc..)</option>
                        </select>
                        <br/>
                        Your nickname: 
                        <input type="text" name="userName"  value={this.state.userName} onChange={this.handleInputChanges}/>
                    </div>);
            
            res.footer =(<div>
                        {this.playAgainButton()}
                        <Button bsStyle="primary" onClick={(e) => this.handleWindowChange('othersScore')}>Compare with others</Button>
                    </div>)    
        return res;
    }

    othersScore() {
        var res = {};
        res.title = 'ClickHit! Scorelist';
        res.body = (
                <div>
                Select games according to input method: <br/>
                        <select value={this.state.seznam} name="inputMethod" onChange={this.handleInputChanges}>
                            <option value="mouse">Mouse</option>
                            <option value="touchpad">Touchpad (laptop)</option>
                            <option value="finger">Finger (tablet/mobile)</option>
                            <option value="ohter">Other (console, etc..)</option>
                        </select>
                </div>
                );
        res.footer = this.playAgainButton();
        
        return res;
        
    }
    handlePlayAgain = () =>{
        window.location.reload();
    }
    playAgainButton(){
        return(
                <Button onClick={this.handlePlayAgain}>Play again</Button>
                );
    }
    insertName(){
        return(
                <div>
                <form onSubmit={this.handleNameSubmit}>
                    <label>
                        Your name:
                        <input type="text" name="userName"  value={this.state.userName} onChange={this.handleInputChanges}/>
                    </label>
                    <input type="submit" value="Submit" />
                    </form>
                    
                    </div>);
            }
}