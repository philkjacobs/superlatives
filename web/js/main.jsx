import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Notifications, {notify} from 'react-notify-toast';
import AssignSupers from './components/AssignSupers.jsx';
import WriteSupers from './components/WriteSupers.jsx';
import * as Menu from './components/Menu.jsx';

class Application extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isHost:false,
      showHostScreen: false,
      showWaitingScreen:false,
      statusText:"",

      // Testing with FOOBAR for now. This will eventually be blank and populated once the call's made to the server.
      gameId:"FOOBAR",

      // This will either be "none", "write", "assign", "read"
      gameState:"none"
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
        {this.state.showHostScreen ? <Menu.WaitingRoom players={Menu.players} isHost={this.state.isHost} gameId={this.state.gameId} /> : <Menu.JoinGame gameId={this.state.gameId}/>}
      </div>
    )
  }

  hostGameButtonPressed(){
    this.setState({
      isHost: true,
      showHostScreen: true
    });
  }

  joinGameButtonPressed(){
    this.setState({
      showHostScreen: false,
      isHost: false
    });
  }

  goToWaitingScreen(status, statusText){
    this.setState({
      showWaitingScreen:status,
      statusText:statusText
    });
  }

  login(data){
    // Send player name and gameId (only if joining)
  }

  changeGameState(state){
    // Send message to server with new game state
  }

  writeSuper(data){
    // Write super to server
  }

  assignSuper(data){
    // Writer super object to server
  }
}

ReactDOM.render(
  <Application />,
  document.getElementById('root')
);