import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Loader from './Loader.jsx';
import Superlative from './Superlative.jsx'
import Notifications, {notify} from 'react-notify-toast';


function Player(props){
  return(
    <div>
      <button   onClick={function(player){props.buttonClicked(props.name);}}
                className="custom-button player">
      {props.name}
      </button>
    </div>
  );
}

export default class AssignSupers extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      showAssignScreen:false,
    }

    this.playerButtonClicked = this.playerButtonClicked.bind(this)

  }
  render() {
    return (
      <div>

      {this.state.showAssignScreen ?
        <div><Notifications />
        <div className="menu-item"><Superlative name={this.props.supers[0]}/></div>
        <div className="menu-item"><div className="description">Assign this to:</div>
          <p><b></b></p>
          {this.props.players.map(function(player, index){
            return(
              <Player
                name={player}
                buttonClicked = {this.playerButtonClicked} />
            );
          }.bind(this))}
        </div></div>
         : 
        <div>
          <Loader statusText="Loading awards for you to assign to others!" />
        </div>}
      </div>
    )
  }


  componentDidMount(){
    setTimeout(function() { this.setState({showAssignScreen: true}); }.bind(this), 5000);
  }

  playerButtonClicked(player){

    // Save assignment to server
    this.props.assignSuper(player,this.props.supers[0])
    this.props.supers.shift()
    
    // If there are supers left, go to next super; otherwise go to Done screen.
    if(this.props.supers.length>0){
      console.log("Current supers array is " +this.props.supers)
      this.shuffleArray(this.props.players)
    } else {
      this.props.changeGameState("read")
    }

    this.forceUpdate()
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
  }
}