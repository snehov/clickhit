import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Grid, Row, Col } from 'react-bootstrap';
import ControlPanel from './ControlPanel';
import ScoreCalculator, {AddHitScore} from './ScoreCalculator';
import Target from './Target';

class App extends Component {
  constructor(){
      super();
      this.state = {score: 0, targetNO: 0};
      this.numTargets = 9;
  }   
  
  addScoreHit = (hitTime) => {
      const newScore = AddHitScore(this.state.score, hitTime);
      this.setScore(newScore);
  }
  setScore(score){
      this.setState({score: score});
  }
  render() {
    return (
            <div className="App">
                <ControlPanel score={this.state.score} app={this} />
                <Target addScoreHit={this.addScoreHit} plusOne={this.plusOne}/>        
                <ScoreCalculator  ref="pokus"/>
            </div>
            
                
    );
  }
   
  plusOne(){
      //this.setState({score: 89});
        //this.setState({targetNO: this.state.targetNO + 1}); 
      console.log("plusone");
  }
  
};

export default App;
