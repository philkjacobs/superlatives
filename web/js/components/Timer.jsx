import React from 'react';

var TimerExample = React.createClass({

    getInitialState: function(){
        return { 
        	elapsed: 0,
        	timeLimit:15
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
    },

    render: function() {
        
        var seconds = Math.round(this.state.elapsed / 1000);
        var secondsLeft = this.state.timeLimit - seconds;
        var timerText;

        // If time is less than 0, change timerText to "Time up!"
        if(secondsLeft>0){
        	timerText = secondsLeft + " seconds left"
        } else {
        	this.componentWillUnmount();
        	timerText = "Time up!"
        }

        return <p><b>{timerText}</b></p>;
    }
});

export default class Timer extends React.Component {
  render() {
    return (
    	<TimerExample start={this.props.now} />
    );
  }
}