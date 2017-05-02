import React from 'react';
import { Modal, Button,Grid, Row, Col } from 'react-bootstrap';

export default class ResultWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {window: 'welcome', viewInputMethodScore:'finger', groupName: ''}
        this.handleInputChanges = this.handleInputChanges.bind(this);
        this.handleNameSubmit = this.handleNameSubmit.bind(this);
        this.viewInputMethodScore = 'all';
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
        if(name == "groupName"){
            this.props.app.setCookieGroup(value);
            this.props.app.setState({groupName:value});
        }
        if(name == "inputMethod"){
            this.viewInputMethodScore  = value;
            this.props.app.setCookieDevice(value);
            this.props.app.setState({inputDevice:value});
            
        }
        if(name == "scoreInputMethod"){
            //this.setState({viewInputMethodScore: value});
            this.viewInputMethodScore = value;
            this.props.app.loadScore(value);
        }
    }

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
    handleSaveNameForm(e){
        if(this.props.app.state.userName==""){
            alert("Fill in your nickname");
        }else{
            this.viewInputMethodScore = this.props.app.cookies.get('inputDevice');
            this.handleWindowChange('saveLoadResults');
        }
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
                    
                    <b>Hit appearing targets as fast as you can!</b><br/>
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
        //this.viewInputMethodScore =    this.props.app.state.inputDevice; 
    
        var res={};
        res.title = 'Your ClickHit! result';
        
        res.body = (<div className="higherLines">
                    Your score is: <span className="score">{this.props.app.state.score}</span><br/>
                        Your average react time is: <span className="avgTime">{this.props.app.state.resultData.avgTime}</span> ms <br/>
                        Select yout input method:
                        <select value={this.props.app.state.inputDevice} name="inputMethod" onChange={this.handleInputChanges}>
                            <option value="mouse">Mouse</option>
                            <option value="touchpad">Touchpad (laptop)</option>
                            <option value="finger">Finger (tablet/mobile)</option>
                            <option value="other">Other (console, etc..)</option>
                        </select>
                        <br/>
                        Your nickname: 
                        <input type="text" name="userName"  value={this.props.app.state.userName} onChange={this.handleInputChanges}/>
                        <br />
                        To challenge your friends, fill your company/group name:
                        <input type="text" name="groupName"  value={this.props.app.state.groupName} onChange={this.handleInputChanges}/>
                    </div>);
            
            res.footer =(<div>
                        {this.playAgainButton()}
                        <Button bsStyle="primary" onClick={(e) => this.handleSaveNameForm()}>Compare with others</Button>
                    </div>)    
        return res;
    }

    saveLoadResults(){
        const data = {
            nick: this.props.app.state.userName,
            score: this.props.app.state.score, 
            input: this.props.app.state.inputDevice, 
            avgTime: this.props.app.state.resultData.avgTime,
            missed: this.props.app.state.resultData.missed,
            groupName: this.props.app.state.groupName
        };
        
        this.props.app.serverData.insertScore(data);
        
        //this.othersScore();
        
        return {title: 'ClickHit! Scorelist', body: 'Loading data...', footer:''}
    }
    changeScoreView(view){
        if(view == "group"){
            //this.props.app.setState({viewScoreList: 'group'});
            this.props.app.viewScoreList = 'group';
            console.log(">>menim vewscorelit na group >"+this.props.app.viewScoreList );
        }else{
            //this.props.app.setState({viewScoreList: 'all'});
            this.props.app.viewScoreList = 'all';
            console.log(">>menim vewscorelit na all >"+this.props.app.viewScoreList );
        }
        
        this.props.app.loadScore(this.props.app.state.inputDevice);
    }
    othersScore() {
        var res = {};
        const data = this.state.resultsData;
        console.log("data", data);
        res.title = 'ClickHit! Scorelist';
        const userName = this.props.app.state.userName;
        //this.setState({viewInputMethodScore: data.input});
        var groupButton = "";
        var allScoreButton = "";
        
        if(this.props.app.viewScoreList == 'all'){
            allScoreButton = <span>All score Toplist</span>;
            if(this.props.app.state.groupName != ''){
                groupButton = (<button 
                                onClick={(e) => this.changeScoreView('group')}>
                                Show "{this.props.app.state.groupName}" group only 
                               </button>);
            }
        }else{
            allScoreButton = <button 
                                onClick={(e) => this.changeScoreView('all')}>
                                All score Toplist
                                </button>;
            if(this.props.app.state.groupName != ''){
                groupButton = (<span>
                                Show "{this.props.app.state.groupName}" group only 
                               </span>);
            }
        }
         
        
        
        res.body = (
                <div>
                    <div   className="higherLines">
                        Select games according to input method: &nbsp; 
                        <select value={this.viewInputMethodScore} name="scoreInputMethod" onChange={this.handleInputChanges} >
                            <option value="*"> -all- </option>
                            <option value="mouse">Mouse</option>
                            <option value="touchpad">Touchpad (laptop)</option>
                            <option value="finger">Finger (tablet/mobile)</option>
                            <option value="other">Other (console, etc..)</option>
                        </select>
                     </div>
                     {allScoreButton} / {groupButton}
                     <div>
                        <table className="resultTable">
                        <thead>
                            <tr>
                            <th>#</th><th>User</th><th>Score</th><th className="hidden-xs">Avg react time</th>
                            <th className="hidden-xs">Missed</th><th>Input method</th><th className="hidden-xs">Group</th><th>Played</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            data.map(function(row, i){
                                let cln="";
                                if(row.nick == userName){
                                    cln = "me"
                                };
                                return <tr key={i}
                                            className={cln}>
                                        <td>{i+1}</td><td>{row.nick}</td><td>{row.score}</td><td className="hidden-xs">{row.avg_time} ms</td>
                                        <td className="hidden-xs">{row.missed}</td><td>{row.input}</td>
                                        <td className="hidden-xs">{row.idg}</td><td>{row.games}x</td>
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