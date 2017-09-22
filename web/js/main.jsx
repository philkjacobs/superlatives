import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Notifications, {notify} from 'react-notify-toast';
import AssignSupers from './components/AssignSupers.jsx';
import * as Menu from './components/Menu.jsx';

class Application extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      playerName:"",
      isHost:false,
      showHostScreen: false,
      showJoinScreen:false,
      showWaitingScreen:false,
      statusText:"",

      // Testing with FOOBAR for now. This will eventually be blank and populated once the message is received the server.
      gameId:"FOOBAR",

      // This will either be "none", "write", "assign", "read"
      gameState:"none"
    }

    this.hostGameButtonPressed = this.hostGameButtonPressed.bind(this);
    this.joinGameButtonPressed = this.joinGameButtonPressed.bind(this);
    this.handleChange = this.handleChange.bind(this)

  }
  render() {
    return (
      <div>
        <Notifications />
        <h1>Welcome to Superlatives</h1>
        <p>{this.state.statusText}</p>
        <div>
        <form>
            <label>
              <input type="text" placeholder="Enter name..." value={this.state.playerName} onChange={this.handleChange}/>
            </label>
          </form>
      </div>
        <button onClick={this.hostGameButtonPressed} className="btn-rounded btn-outlined orange-btn">Host Game</button>
        <button onClick={this.joinGameButtonPressed} className="btn-rounded btn-outlined green-btn">Join Game</button>
        {this.state.showHostScreen ? <Menu.WaitingRoom players={Menu.players} isHost={this.state.isHost} gameId={this.state.gameId} /> : null}
        {this.state.showJoinScreen ? <Menu.JoinGame gameId={this.state.gameId}/> : null}
      </div>
    )
  }

  handleChange(e){
    this.setState({
      playerName: e.target.value
    });
  }

  hostGameButtonPressed(){
    this.setState({
      isHost: true,
      showHostScreen: true,
      showJoinScreen: false
    });
  }

  joinGameButtonPressed(){
    this.setState({
      isHost: false,
      showHostScreen: false,
      showJoinScreen: true
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
    console.log("Add " + data + " to super list.")
  }

  assignSuper(data){
    // Writer super object to server
  }
}

ReactDOM.render(
  <Application />,
  document.getElementById('root')
);