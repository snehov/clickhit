import React, { Component } from 'react';
import './App.css';
import ControlPanel from './ControlPanel';
import ScoreCalculator, {AddHitScore} from './ScoreCalculator';
import Target from './Target';
import ResultWindow from './ResultWindow';
import Cookies from 'universal-cookie';
import DataHandler from './DataHandler';

class App extends Component {
  constructor(){
      super();
      this.cookies = new Cookies();
      var userName = "";
      var groupName = "";
      var inputDevice = "";
      this.viewScoreList = "all";
      this.viewScoreInput = "*";
      if(this.cookies.get('userName')){
          userName = this.cookies.get('userName');
          groupName = this.cookies.get('groupName');
          inputDevice = this.cookies.get('inputDevice');
          console.log("známý hráč: "+ userName+", na: "+inputDevice);
      }else{
          inputDevice = "mouse";
      }
      
      this.state = {score: 0, 
                    targetNO: 0, 
                    missClicks: 0, 
                    hitStats:[], 
                    showResultWindow: true, 
                    play: false,
                    resultData: {avgTime:0},
                    userName: userName, 
                    groupName: groupName,
                    inputDevice: inputDevice
                   
                };
      this.numTargets = 7;
      
  }   
  
  setCookieName (name){
      this.cookies.set('userName', name, { path: '/' });
  }
  setCookieGroup (name){
      this.cookies.set('groupName', name, { path: '/' });
  }
  setCookieDevice(value){
      this.cookies.set('inputDevice', value, { path: '/' });
  }
  
  addScoreHit = (hitTime) => {
      const newScore = AddHitScore(this.state.score, hitTime, this.state.missClicks);
      const hitStats = {'hitTime': hitTime, 'missClicks': this.state.missClicks, 'score': newScore };
      // zaznam do statistik kliku
      var tmp = [] = this.state.hitStats;
      tmp.push(hitStats);
      this.setState({'hitStats': tmp });
      this.setScore(newScore);
  }
  setScore(score){
      this.setState({score: score});
  }
  playGame(){
        this.target.playGame();
  }
  render() {
    return (
            <div className="App" >
                <div id="voidArea" onClick={this.missClick}></div>
                <ControlPanel score={this.state.score} app={this} />
                <Target addScoreHit={this.addScoreHit} plusOne={this.plusOne} app={this}  ref={instance => { this.target = instance; }} />        
                <ScoreCalculator  ref="pokus"/>
                <ResultWindow showResultWindow={this.state.showResultWindow} app={this} ref={instance => { this.dialogWindow = instance;}} />
                <DataHandler ref={instance => { this.serverData = instance; }} app={this} />
            </div>        
    );
  }
   
  plusOne = () =>{
      this.setState({targetNO: this.state.targetNO + 1}); 
  }
  loadScore(inputMethod){ 
      var group = "";
      inputMethod = this.viewScoreInput;
      
      if(this.viewScoreList === 'group'){
          group = this.state.groupName;
      }else{
          group = '';
      }
   
      this.serverData.loadScore(inputMethod, group);
  }
  
  // load fetched score from server to table and show
  loadResults(data){
      console.log("mame score data nacteny");
      this.dialogWindow.setState({window:'othersScore', resultsData: data.data});
  }
  over(){
      var avgTime;
      var sumtime = 0;
      var missed = 0;
      var tmp = [] = this.state.hitStats;
      tmp.forEach((stat)=>{
          sumtime += stat.hitTime;
          missed += stat.missClicks;
      });
      avgTime = Math.round(sumtime/tmp.length);    
      const resultData = {'totalScore': this.state.score, 'avgTime': avgTime, 'missed': missed };
      this.setState({'resultData': resultData ,showResultWindow: true});
  }
  missClick = () =>{
      this.setState({missClicks: this.state.missClicks + 1}); 
  }
};

export default App;
