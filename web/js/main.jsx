import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Notifications, {notify} from 'react-notify-toast';
import ReadSupers from './components/ReadSupers.jsx';
import Timer from '../js/components/Timer.jsx';
import AssignSupers from './components/AssignSupers.jsx';

// Hard-coding player names. These will eventually live-update as new players are added to the database for a given gameID
var players = ['Mathew', 'Jeremy', 'Ben', 'Philip', 'Julia', 'Brian']

class WriteSuperlatives extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			super: ""
		};

		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(e){
		this.setState({
			super: e.target.value
		});
	}

	render(){
		return(
			<div>
				<Timer />
				<form onSubmit={this.onSubmit.bind(this)}>
		        <label>
		          <input type="text" value={this.state.super} onChange={this.handleChange}/>
		        </label>
		        <input type="submit" value="Add Super"/>
		      </form>
			</div>
		)
	}

	onSubmit(e){
		e.preventDefault();
		console.log("Add " + this.state.super + " to super list.")

    	// Send super to super entity for gameID
	}
}

function Player(props){
	return(
		<div>
			{props.name}
		</div>
	)
}

class WaitingRoom extends React.Component {
  render(){
    return(
      <div>
        <h3>Waiting Room</h3>
        {this.props.players.map(function(player){
            return (
              <Player name={player} />
            );
        }.bind(this))}
      </div>
    )
  }
}

function Player(props){
  return(
    <div>
      {props.name}
    </div>
  );
}

class HostGame extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      gameId: props.gameId,
      startGame: false
    }

    this.startGameButtonPressed = this.startGameButtonPressed.bind(this)

  }

  render(){
    return(
      <div>
        <h3>Heres your special game code. Share this with your friends </h3>
        {this.state.gameId}
        <WaitingRoom players={players} />
        <button className="btn-rounded btn-outlined orange-btn" onClick={this.startGameButtonPressed}>
          Start Game
        </button>
        {this.state.startGame ? <WriteSuperlatives /> : null}
      </div>
    )
  }

  fetchGameID(){
    // Magic code to fetch game ID
  }

  startGameButtonPressed(){
  	// Change game state so other devices will start the game too
  	this.setState({
  		startGame: true
  	})
  }
}

HostGame.propTypes = {
  gameId: React.PropTypes.string.isRequired
};

HostGame.defaultProps = {
  gameId: "TEST GAME"
}

class JoinGame extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      goToWaitingRoom: false
    }
    this.onSubmit = this.onSubmit.bind(this)
  }
  render(){
    return(
      <div>
        <h3>Enter magic code to join game:</h3>
        <form onSubmit={this.onSubmit}>
            <label>
              <input type="text" />
            </label>
            <input type="submit" value="Join Game" />
          </form>
          {this.state.goToWaitingRoom ? <WaitingRoom players={players} /> : null}
      </div>
      // Listen for server to tell us to start game
    )
  }

  onSubmit(e){
    e.preventDefault();
    // For now, it's always true. Eventually, it'll do a check before going to the waiting room
    this.setState({
    	goToWaitingRoom: true
    });
  }
}

class Application extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showHostScreen: false,
      showJoinScreen: false,
      showWaitingScreen:false,
      statusText:""
    }

    this.hostGameButtonPressed = this.hostGameButtonPressed.bind(this);
    this.joinGameButtonPressed = this.joinGameButtonPressed.bind(this);

  }
  render() {
    return (
      <div>
        <Notifications />
        <h1>Welcome to Superlatives</h1>
        <p>{this.state.statusText}</p>
        <button onClick={this.hostGameButtonPressed} className="btn-rounded btn-outlined orange-btn">Host Game</button>
        <button onClick={this.joinGameButtonPressed} className="btn-rounded btn-outlined green-btn">Join Game</button>
        {this.state.showHostScreen ? <HostGame /> : null}
        {this.state.showJoinScreen ? <JoinGame /> : null}
        {this.state.showWaitingScreen ? null : <AssignSupers players={players} onStatusChange={function(status, statusText){this.goToWaitingScreen(status, statusText)}.bind(this)}/>}
      </div>
    )
  }

  hostGameButtonPressed(){
    console.log("Host button pressed");
    
    this.setState({
      showHostScreen: true,
      showJoinScreen: false,
      statusText:""
    });

  }

  joinGameButtonPressed(){
    console.log("Join game button pressed");

    this.setState({
      showJoinScreen: true,
      showHostScreen: false
    });
  }

  goToWaitingRoom(){
    notify.show('Not yet built!');
  }

  goToWaitingScreen(status, statusText){
    this.setState({
      showWaitingScreen:status,
      statusText:statusText
    });
  }

}

ReactDOM.render(
  <Application />,
  document.getElementById('root')
);