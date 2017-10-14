import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Superlative from './Superlative.jsx'
import Notifications, {notify} from 'react-notify-toast';

export default class ReadSupers extends React.Component {
  constructor(props){
    super(props);

    this.nextButtonClicked = this.nextButtonClicked.bind(this)
    this.newGameButtonPressed = this.newGameButtonPressed.bind(this)

  }
  render() {
    return (
      <div>
        <Notifications />
        {this.props.supers.length==0 ? <div>That's it! <button onClick={this.newGameButtonPressed}>Back to menu</button></div> : <Superlative name={this.props.supers[0]}/>}
        
        <button onClick={this.nextButtonClicked}>Next superlative</button>
      </div>
    )
  }

  nextButtonClicked(){ 
    this.props.supers.shift()
    this.forceUpdate()
  }

  newGameButtonPressed(){
    this.props.changeGameState("menu")
  }
}