import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Menu from './components/Menu.jsx';
import WriteSupers from './components/WriteSupers.jsx';
import AssignSupers from './components/AssignSupers.jsx';
import ReadSupers from './components/ReadSupers.jsx';
import Notifications, {notify} from 'react-notify-toast';

var socket=""


class Application extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      playerName:"",
      isHost:false,
      showJoinScreen:false,
      showWaitingScreen:false,
      statusText:"",
      gameId:"",
      players:[],
      // This will either be "menu", "room", "wait", "write", "assign", "read"
      gameState:"menu",
      socket:socket,
      supers:[]
    }

    this.hostGameButtonPressed = this.hostGameButtonPressed.bind(this);
    this.joinGameButtonPressed = this.joinGameButtonPressed.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.testChangeStateToWrite = this.testChangeStateToWrite.bind(this);

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

        </div>

        <div>
          <form onSubmit={this.testChangeStateToWrite}>
            <label>
              <input type="submit" value="TESTING: Change game state to WRITE"/>
            </label>
          </form>
        </div>

        {this.state.showJoinScreen ? <Menu.JoinGame
          gameId={this.state.gameId}
          onChange={function(e){this.handleIdChange(e)}.bind(this)}
          onSubmit={function(data){this.login('join')}.bind(this)}/> : null}

        {this.state.gameState=="room" ? <Menu.WaitingRoom
          players={this.state.players}
          isHost={this.state.isHost}
          gameId={this.state.gameId}
          changeStatus={function(state, statusText){this.changeStatus(state,statusText)}.bind(this)}
          gameState={this.state.gameState}
          changeGameState={function(state){this.changeGameState(state)}.bind(this)}/> : null}

        {this.state.gameState=="write" ? <WriteSupers
          players={this.state.players}
          submitSuper={function(data){this.writeSuper(data)}.bind(this)}
          changeStatus={function(state, statusText){this.changeStatus(state,statusText)}.bind(this)}
          changeGameState={function(state){this.changeGameState(state)}.bind(this)}
          gameState={this.state.gameState}
          now={Date.now()}/> : null }

        {this.state.gameState=="assign" ? <AssignSupers
          players={this.state.players}
          supers={this.state.supers}
          currentSuper={supers[0].name}
          changeStatus={function(state, statusText){this.changeStatus(state,statusText)}.bind(this)}
          assignSuper={function(data){this.assignSuper(data)}.bind(this)} /> : null }

        {this.state.gameState=="read" ? <ReadSupers
          changeStatus={function(state, statusText){this.changeStatus(state,statusText)}.bind(this)} /> : null}
      
      </div>
    )
  }

  testChangeStateToWrite(e){
    e.preventDefault();
    this.changeGameState('write')

    // Assuming the change is always successful, move to write page
    this.setState({
      gameState:"write"
    })
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
    this.login('host')
    this.setState({
      isHost: true,
      showJoinScreen: false
    });
  }

  joinGameButtonPressed(){
    this.setState({
      isHost: false,
      showJoinScreen: true
    });
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

  login(type){

    switch(type){
      case 'host':
        socket = new WebSocket(`ws://localhost:5000/ws?name=${this.state.playerName}`);
        break;
      case 'join':
        socket = new WebSocket(`ws://localhost:5000/ws?name=${this.state.playerName}&game=${this.state.gameId}`);
        break;
      default:
        console.log("Error: Incorrect type. Expected host or join.")
    }

    // Handle messages sent by the server.
    socket.onmessage = function(event) {
      var response = JSON.parse(event.data);

      // Assuming success, go to the waiting room
      this.setState({
        gameId:response.data.game,
        players:response.data.players,
        gameState:"room",
        showJoinScreen:false,
        socket:socket
      })
    }.bind(this);
  }

  changeGameState(state){
    // Send message to server with new game state
    // var socket = this.state.socket;
    var message = {"msg":"change_state", "data":{"state":state}, "error":""}
    socket.send(JSON.stringify(message))

    socket.onmessage = function(event){
      console.log(event.data)
      if(state=="assign"){
        var response = JSON.parse(event.data);
        if(response.msg=="assign_supers_list"){
          this.setState({
            supers:response.data.supers
          })
          console.log("Supers is "+this.state.supers);
        }
      }
    }

  }

  writeSuper(data){
    // Write super to server
    // var socket = this.state.socket;
    var message = {"msg":"write_supers","data":{"super":data}, "error":""}
    socket.send(JSON.stringify(message))

    socket.onmessage = function(event){
      console.log(event.data)
    }
  }

  assignSuper(data){
    // Writer super object to server
    console.log("Assigned super to " +data)
  }
}

// Server listener
if(!socket){
  console.log("No socket.");   
} else {
  console.log("Socket!");
  socket.onmessage = function(event) {
    var response = JSON.parse(event.data);
    if(response.msg=="assign_supers_list"){
      this.setState({
        supers:response.data.supers
      })
      console.log("Supers is "+this.state.supers);
    }
  }
}

ReactDOM.render(
  <Application />,
  document.getElementById('root')
);