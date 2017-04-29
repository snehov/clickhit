import React from 'react';

export default class ScoreCalculator extends React.Component{
        constructor(props){
            super();
            this.state = {};
            //const maxScorePerClick = 1500;
        }
        
        addHit(){
            ///this.setState({neco:'nic'});
        }
        render(){
            return(
                    <div></div>
                    );
        }
}



export function AddHitScore(score, hitTime, missClicks){
    const maxScorePerHit = 1500;
    const minScorePerHit = 10;
    // nejdriv beru v potaz jen hittime
        // nejak bych vypocet udelal nelinearni, treba hyberbolicky kde necenejsi hodnoty jsou treba 0-600 ms
        // ale zase pozor, na kazdym device je jinej peak react time
    var add = maxScorePerHit - (hitTime/3);
    // ted beru v potaz mnozstvi missclicku
    add = add/ (missClicks + 1);
    // mohl bych zkusit vzit v potaz i velikost targetu v pomeru zbytku obrazovky
    
    // a jen se ujistim abych nepracoval s nesmyslnyma hodnotama
    if(add <= 0){
        add = minScorePerHit;
    }
    if(add > maxScorePerHit){
        add = maxScorePerHit;
    }
    console.log('Připočítávám score (při '+hitTime+' ms, missclicks: '+missClicks+')', add);
    return score + Math.round(add);
}