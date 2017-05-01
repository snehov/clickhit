import React from 'react';
import { Modal, Button,Grid, Row, Col } from 'react-bootstrap';





export default class ResultWindow extends React.Component {
    constructor(props) {
        super(props);
        //const cookies = new Cookies();
        
        this.state = {window: 'welcome'}
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
            this.props.app.setState({userName:value});
        }
        if(name == "inputMethod"){
            this.props.app.setCookieDevice(value);
            this.props.app.setState({inputDevice:value});
        }
    }
    /*
    handleInputChange(event) {
        console.log("change of 'inputMethod' to: ", event.target.value);
        this.setState({'inputMethod': event.target.value});
    }*/
    
    handleNameSubmit(event){
        event.preventDefault();
        this.props.app.setCookieName(this.props.app.state.userName);
        //this.cookies.set('userName', this.state.userName, { path: '/' });
        console.log('name: ', this.props.app.state.userName)
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
        } else if (this.state.window == 'saveLoadResults') {
            window = this.saveLoadResults();
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
                    
                    <b>Hit appearing targets as fast as you can!.</b><br/>
                    Challenge with your friends who can play bigger score and lower respond time.
                    </div>
                );
        res.footer= (
                <div>
                    <Button bsStyle="primary" onClick={(e) => this.goPlayGame()} >Play</Button>
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
                        <select value={this.props.app.state.inputDevice} name="inputMethod" onChange={this.handleInputChanges}>
                            <option value="mouse">Mouse</option>
                            <option value="touchpad">Touchpad (laptop)</option>
                            <option value="finger">Finger (tablet/mobile)</option>
                            <option value="ohter">Other (console, etc..)</option>
                        </select>
                        <br/>
                        Your nickname: 
                        <input type="text" name="userName"  value={this.props.app.state.userName} onChange={this.handleInputChanges}/>
                    </div>);
            
            res.footer =(<div>
                        {this.playAgainButton()}
                        <Button bsStyle="primary" onClick={(e) => this.handleWindowChange('saveLoadResults')}>Compare with others</Button>
                    </div>)    
        return res;
    }

    saveLoadResults(){
        const data = {
            nick: this.props.app.state.userName,
            score: this.props.app.state.score, 
            input: this.props.app.state.inputDevice, 
            avgTime: this.props.app.state.resultData.avgTime,
            missed: this.props.app.state.resultData.missed
        };
        this.props.app.serverData.insertScore(data );
        
        //this.othersScore();
        
        return {title: 'ClickHit! Scorelist', body: 'Loading data...', footer:''}
    }
    othersScore() {
        var res = {};
        const data = this.state.resultsData;
        console.log("data", data);
        res.title = 'ClickHit! Scorelist';
        const userName = this.props.app.state.userName;
        
        res.body = (
                <div>
        
                Select games according to input method: <br/>
                        <select value={this.state.seznam} name="inputMethod" onChange={this.handleInputChanges} disabled>
                            <option value="*"> -all- </option>
                            <option value="mouse">Mouse</option>
                            <option value="touchpad">Touchpad (laptop)</option>
                            <option value="finger">Finger (tablet/mobile)</option>
                            <option value="ohter">Other (console, etc..)</option>
                        </select>
                        
                        <div>
                        <table className="resultTable">
                        <thead>
                            <tr>
                            <th>#</th><th>User</th><th>Score</th><th>Avg react time</th>
                            <th className="hidden-xs">Missed</th><th>Input method</th><th>Played</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            data.map(function(row, i){
                                let cln="";
                                if(row.nick == userName){
                                    cln = "me"
                                };
                                return <tr key={row.idsc}
                                            className={cln}>
                                        <td>{i+1}</td>    
                                        <td>{row.nick}</td><td>{row.score}</td><td>{row.avg_time} ms</td>
                                        <td className="hidden-xs">{row.missed}</td><td>{row.input}</td><td>{row.games}x</td>
                                   </tr>
                                   
                              })       
                             }
                          </tbody>   
                          </table>
                          </div>
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
                        <input type="text" name="userName"  value={this.props.app.state.userName} onChange={this.handleInputChanges}/>
                    </label>
                    <input type="submit" value="Submit" />
                    </form>
                    
                    </div>);
            }
}