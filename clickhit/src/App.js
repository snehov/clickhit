import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Grid, Row, Col } from 'react-bootstrap';
import ControlPanel from './ControlPanel';
import ScoreCalculator, {AddHitScore} from './ScoreCalculator';
import Target from './Target';
import ResultWindow from './ResultWindow';

import Cookies from 'universal-cookie';

class App extends Component {
  constructor(){
      super();
      this.cookies = new Cookies();
      var userName = "";
      var inputDevice = "";
      if(this.cookies.get('userName')){
          userName = this.cookies.get('userName');
          inputDevice = this.cookies.get('inputDevice');
          console.log("známý hráč: "+ userName+", na: "+inputDevice);
      }
     //cookies.set('userName', 'Sněha2', { path: '/' });
     //this.setCookieName();
      this.state = {score: 0, 
                    targetNO: 0, 
                    missClicks: 0, 
                    hitStats:[], 
                    showResultWindow: false, 
                    resultData: {avgTime:0},
                    userName: userName, 
                    inputDevice: inputDevice
                };
      this.numTargets = 3;
  }   
  
  setCookieName (name){
      this.cookies.set('userName', name, { path: '/' });
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
      // -------------------------
      this.setScore(newScore);
      //console.log("hitstats: ", this.state.hitStats);
  }
  setScore(score){
      this.setState({score: score});
  }
  render() {
    return (
            <div className="App" >
                <div id="voidArea" onClick={this.missClick}></div>
                <ControlPanel score={this.state.score} app={this} />
                <Target addScoreHit={this.addScoreHit} plusOne={this.plusOne} app={this}/>        
                <ScoreCalculator  ref="pokus"/>
                <ResultWindow showResultWindow={this.state.showResultWindow} app={this}/>
                
            </div>
            
                
    );
  }
   
  plusOne = () =>{
      this.setState({targetNO: this.state.targetNO + 1}); 
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
      //alert('konec, avgtime: '+ avgTime+', missed: '+missed);
  }
  missClick = () =>{
      this.setState({missClicks: this.state.missClicks + 1}); 
  }
  
};

export default App;
