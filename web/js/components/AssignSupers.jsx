import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Superlative from './Superlative.jsx'
import Notifications, {notify} from 'react-notify-toast';

// Hard-coding supers for testing 
var supers = [
  {
  "name":"Best cuticles"
  },
  {
  "name":"Best smile"
  },
  {
  "name":"Best hair"
  },
  {
  "name":"Most likely to become president"
  }
]

function Player(props){
  return(
    <div>
      <button onClick={function(player){props.buttonClicked(props.name);}}>
      {props.name}
      </button>
    </div>
  );
}

export default class AssignSupers extends React.Component {
  constructor(props){
    super(props);

    this.playerButtonClicked = this.playerButtonClicked.bind(this)

  }
  render() {
    return (
      <div>
        <Notifications />
        <Superlative name={this.props.currentSuper}/>
        <h1>Assign this to:</h1>
        {this.props.players.map(function(player, index){
          return(
            <Player
              name={player}
              buttonClicked = {this.playerButtonClicked} />
          );
        }.bind(this))}
      </div>
    )
  }

  playerButtonClicked(player){

    this.props.assignSuper(player)
    
    // Save assignment to server
    // If there are supers left, go to next super; otherwise go to Done screen.
    this.props.supers.shift()

    if(this.props.supers.length>0){
      this.props.currentSuper = this.props.supers[0].name
      
    } else {
      this.props.changeStatus("wait", "You've assigned all supers! Waiting for your friends to finish...")
    }
  }
}