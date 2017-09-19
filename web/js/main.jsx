import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Notifications, {notify} from 'react-notify-toast';
import AssignSupers from './components/AssignSupers.jsx';

var players = ['Brian', 'Philip', 'Julia', 'Ben', 'Jeremy', 'Tessa']

class HostGame extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      gameId: props.gameId
    }
  }

  render(){
    return(
      <div>
        <h3>Heres your special game code. Share this with your friends </h3>
        {this.state.gameId}
      </div>
    )
  }

  fetchGameID(){
    // Magic code to fetch game ID
  }
}

HostGame.propTypes = {
  gameId: React.PropTypes.string.isRequired
};

HostGame.defaultProps = {
  gameId: "TEST GAME"
}

class JoinGame extends React.Component {
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
      </div>
    )
  }

  onSubmit(e){
    e.preventDefault();
    notify.show('Not yet built!', "error", 2000)
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
    this.goToWaitingScreen = this.goToWaitingScreen.bind(this);
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
    this.setState({
      showHostScreen: true,
      showJoinScreen: false
    });

  }

  joinGameButtonPressed(){
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