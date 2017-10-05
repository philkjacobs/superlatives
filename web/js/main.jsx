import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Notifications, {notify} from 'react-notify-toast';
import * as Menu from './components/Menu.jsx';



// // Show a connected message when the WebSocket is opened.
// socket.onopen = function(event) {
//   console.log('Connected to: ' + event.currentTarget.url);
// };

// // Handle any errors that occur.
// socket.onerror = function(error) {
//   console.log('WebSocket Error: ' + error.description);
// };

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
      gameId:"",

      // This will either be "menu", "wait", "write", "assign", "read"
      gameState:"menu"
    }

    this.hostGameButtonPressed = this.hostGameButtonPressed.bind(this);
    this.joinGameButtonPressed = this.joinGameButtonPressed.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);

  }
  render() {
    if(this.state.gameState!="menu") var style = {display:'none'}

    return (
      <div>
        <Notifications />
        <h1>Welcome to Superlatives</h1>
        <p>{this.state.statusText}</p>
        <div style={style}>

          <div>
            <form>
                <label>
                  <input
                    type="text"
                    placeholder="Enter name..."
                    value={this.state.playerName}
                    onChange={this.handleNameChange}/>
                </label>
              </form>
          </div>
          <button
            onClick={this.hostGameButtonPressed}
            className="btn-rounded btn-outlined orange-btn">Host Game
          </button>
          <button
            onClick={this.joinGameButtonPressed}
            className="btn-rounded btn-outlined green-btn">Join Game
          </button>

          <button
            onClick={this.testButtonPressed}
            className="btn-rounded btn-outlined green-btn">WEBSOCKET TEST
          </button>
        </div>

        {this.state.showHostScreen ? <Menu.WaitingRoom
          players={Menu.players}
          isHost={this.state.isHost}
          gameId={this.state.gameId}
          submitSuper={function(data){this.writeSuper(data)}.bind(this)}
          assignSuper={function(data){this.assignSuper(data)}.bind(this)}
          changeStatus={function(state, statusText){this.changeStatus(state,statusText)}.bind(this)}
          gameState={this.state.gameState}/> : null}


        {this.state.showJoinScreen ? <Menu.JoinGame
          gameId={this.state.gameId}
          onChange={function(e){this.handleIdChange(e)}.bind(this)}
          onSubmit={function(data){this.login(data)}.bind(this)}/> : null}
      </div>
    )
  }

  handleNameChange(e){
    this.setState({
      playerName: e.target.value
    });
  }

  handleIdChange(e){
    this.setState({
      gameId: e.target.value
    });
  }

  hostGameButtonPressed(){
    this.login(this.state.playerName)
    this.setState({
      isHost: true,
      showHostScreen: true,
      showJoinScreen: false,
      gameState:"room"
    });
  }

  joinGameButtonPressed(){
    this.setState({
      isHost: false,
      showHostScreen: false,
      showJoinScreen: true
    });
  }

  testButtonPressed(){
    // Playing with websockets
    var name = 'Mathew'
    var socket = new WebSocket(`ws://localhost:5000/ws?name=${name}`);

    // Handle messages sent by the server.
    socket.onmessage = function(event) {
      var message = event.data;
      console.log(message);
    };
    // var message = { "msg":"change_state", "data":{"state":"assign"}};
    // socket.send(JSON.stringify(message));
  }

  changeStatus(status, statusText){
    this.setState({
      statusText:statusText,
      gameState:status
    });

    if(this.state.statusText=="menu"){
      this.setState({
        showHostScreen: false,
        showJoinScreen: false
      });
    }
  }

  login(data){
    // Send player name and gameId (only if joining)
    console.log('Sending to server: ' + this.state.playerName + ' '+this.state.gameId)
        // Testing code for adding a player to an existing code
    var name = 'Philip'
    var socket2 = new WebSocket(`ws://localhost:5000/ws?name=${name}&game=${this.state.gameId}`);

    socket2.onmessage = function(event) {
      var message = event.data;
      console.log(message);
    };
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
    console.log("Assigned super to " +data)
  }
}

ReactDOM.render(
  <Application />,
  document.getElementById('root')
);