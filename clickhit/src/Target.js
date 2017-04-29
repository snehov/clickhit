import React from 'react';

export default class Target extends React.Component{
        
        constructor(props){
            super();
            this.state = {  hidden: true, 
                            startTime: 0, 
                            targetWidth: 0,
                            targetHeight: 0,
                            targetDisplayProps: {backgroundColor: 'red'}
                        }
            this.minWaitingTime = 300; //miliseconds
            this.maxWaitingTime = 10000; //miliseconds
            this.targetPosition = {top:'0px'};
        
        }
        
        
        render(){
            
            return(
                    <div    id="theTarget"
                            className={(this.state.hidden ?'targetHidden':'targetVisible')}
                            style={this.state.targetDisplayProps}
                            onClick={this.handleTargetHit}>
                    
                    </div> 
                    );
        }
        
        componentDidMount(){
            this.generateNewTarget();
        }
        
        generateNewTarget(){
            this.props.plusOne();
            const targetSize = this.calcTargetSize();
            const maxTop = window.innerHeight - targetSize.height;
            const maxLeft = window.innerWidth - targetSize.width;
            //todo tady bych nejvrchnejsi pixel ne-hardcodoval, ale nechal spocitat vysku hlavicky
            const top = getRandomInt(30,maxTop)+'px';
            const left = getRandomInt(0,maxLeft)+'px';
            
            
            const displayProps = {'top': top, 'left': left, 'width': targetSize.width+'px', 'height': targetSize.height+'px'}
            this.setState({targetDisplayProps: displayProps});
            this.waitForNewTarget(displayProps);
        }
        
        waitForNewTarget(displayProps){
           const waitTime = getRandomInt(this.minWaitingTime, this.maxWaitingTime);
           console.log("budeme čekat "+waitTime+" ms s těmito props: "+JSON.stringify(displayProps)+", browser ma H:"+window.innerHeight);
           setTimeout(() => {
                    this.drawTarget()
                }, waitTime
             ); 
        }
        drawTarget(){
            console.log("kreslim: "+Date.now());
            //clearTimeout(this.timerID);
            this.setState({hidden:false, startTime: Date.now()});
            
        }
        
        handleTargetHit = () => {
            const hitTime = Date.now() - this.state.startTime;
            this.props.addScoreHit(hitTime);//e.target.value);
            this.setState({hidden: true});
            
            this.generateNewTarget();

        }
        
        calcTargetSize(){
            var width = Math.round(window.innerWidth / 15);
            var height = Math.round(window.innerHeight / 12);
            if(height < (width * 0.8) ){
                height = width * 0.8;
            }
            if(width < (height * 0.8)){
                width = height * 0.8;
            }
            //this.setState({'targetWidth': width, 'targetHeight': height});
            return {'width': Math.round(width), 'height':Math.round(height)}
        }
        
        
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}