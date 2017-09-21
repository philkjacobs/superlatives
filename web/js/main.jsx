import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Notifications, {notify} from 'react-notify-toast';
import AssignSupers from './components/AssignSupers.jsx';
import WriteSupers from './components/WriteSupers.jsx';

// Hard-coding player names. These will eventually live-update as new players are added to the database for a given gameID
var players = ['Mathew', 'Jeremy', 'Ben', 'Philip', 'Julia', 'Brian']

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
        {this.state.startGame ? <WriteSupers /> : null}
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
      showWaitingScreen:false,
      shouldStartGame:false,
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
        {this.state.showHostScreen ? <HostGame /> : <JoinGame />}
      </div>
    )
  }

  hostGameButtonPressed(){
    console.log("Host button pressed");
    
    this.setState({
      showHostScreen: true
    });

  }

  joinGameButtonPressed(){
    console.log("Join game button pressed");

    this.setState({
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