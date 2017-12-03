import React from 'react';

var TimerExample = React.createClass({

    getInitialState: function(){
        return { 
        	elapsed: 0,
        	timeLimit:5,
            timerText:""
        };
    },

    componentDidMount: function(){

        // componentDidMount is called by React when the component 
        // has been rendered on the page. We can set the interval (50ms) here:
        this.timer = setInterval(this.tick, 50);
    },

    componentWillUnmount: function(){

        // This method is called immediately before the component is removed
        // from the page and destroyed. We can clear the interval here:
        clearInterval(this.timer);
    },

    tick: function(){
    	this.setState({elapsed: new Date() - this.props.start});

        var seconds = Math.round(this.state.elapsed / 1000);
        var secondsLeft = this.state.timeLimit - seconds;

        if(secondsLeft<=0){
            this.state.timerText = "Time up!"
            this.props.stopTimer();
            clearInterval(this.timer);
        } else {
            this.state.timerText = secondsLeft + " seconds left"
        }
    },

    render: function() {

        return(
            <div><p><b>{this.state.timerText}</b></p>
            </div>
        );
    }
});

export default class Timer extends React.Component {

  render() {
    return (
        <div>
    	   <TimerExample start={this.props.now} stopTimer={this.props.didTimerRunOut.bind(this)}/>
        </div>
    );
  }
}