import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import * as Menu from './components/Menu.jsx';
import WriteSupers from './components/WriteSupers.jsx';
import AssignSupers from './components/AssignSupers.jsx';
import ReadSupers from './components/ReadSupers.jsx';
import Notifications, {notify} from 'react-notify-toast';
import * as QueryString from 'query-string';

var socket=""

class Application extends React.Component {
  constructor(props){
    super(props);

    const params = QueryString.parse(location.search);
    this.state = {
      playerName:"",
      isHost:false,
      showJoinScreen:false,
      statusText:"",
      gameId: params.game !== undefined ? params.game : "",
      players:[],
      // This will either be "name", "menu", "room", "wait", "write", "assign", "read"
      gameState:"name",
      socket:socket,
      supers:[]
    }

    this.hostGameButtonPressed = this.hostGameButtonPressed.bind(this);
    this.joinGameButtonPressed = this.joinGameButtonPressed.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.continueButtonPressed = this.continueButtonPressed.bind(this);
    this.changeGameState = this.changeGameState.bind(this);
    this.onNameSubmit = this.onNameSubmit.bind(this);

  }
  render() {
    if(this.state.gameState!="name") var style = {display:'none'}

    return (
      <div>
        <Notifications />

        {this.state.gameState=="wait" ? <p><b>{this.state.statusText}</b></p> : null}

        <div style={style} className="vt-center input-group-lg">
          <h2>Enter name to begin</h2>
            <form onSubmit={this.onNameSubmit}>
                <label style={{display:'block'}}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Mathew"
                    value={this.state.playerName}
                    onChange={this.handleNameChange}/>
                </label>
              </form>

          <button
            onClick={this.continueButtonPressed}
            className="action-button">Continue
          </button>

        </div>

        {this.state.gameState=="menu" ? <Menu.MenuScreen 
          hostGameButtonPressed={this.hostGameButtonPressed}
          joinGameButtonPressed={this.joinGameButtonPressed}/> : null}

        {this.state.showJoinScreen ? <div><ReactModal isOpen={true}><Menu.JoinGame
          gameId={this.state.gameId}
          onChange={function(e){this.handleIdChange(e)}.bind(this)}
          onSubmit={function(data){this.login('join')}.bind(this)}/></ReactModal></div> : null}

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
          changeGameState={function(state){this.changeGameState(state)}.bind(this)}
          gameState={this.state.gameState}
          now={Date.now()}/> : null }

        {this.state.gameState=="assign" ? <AssignSupers
          players={this.removePlayerNameFromPlayerList()}
          supers={this.state.supers}
          changeGameState={function(state){this.changeGameState(state)}.bind(this)}
          assignSuper={function(player, superText){this.assignSuper(player,superText)}.bind(this)} /> : null }

        {this.state.gameState=="read" ? <ReadSupers
          supers={this.state.supers}
          changeGameState={function(state){this.changeGameState(state)}.bind(this)} /> : null}
      
      </div>
    )
  }

  handleNameChange(e){
    this.setState({
      playerName: e.target.value
    });
  }

  onNameSubmit(e){
    e.preventDefault();
    document.activeElement.blur();
    this.setState({
      gameState:"menu"
    })
    this.continueButtonPressed();
  }

  handleIdChange(e){
    this.setState({
      gameId: e.target.value
    });
  }

  continueButtonPressed(){
    this.setState({
      gameState:"menu"
    })
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
      var message = response.msg;

      if(message=='login'){
        // Assuming success, go to the waiting room or update player list if already in waiting room
        this.setState({
          gameId:response.data.game,
          players:response.data.players,
          gameState:"room",
          showJoinScreen:false,
          socket:socket
        })
      }

      if(message=="change_state"){
        console.log("Changing game state to "+response.data.state);
        this.changeGameState(response.data.state.toLowerCase());
      }

    }.bind(this);
  }

  changeGameState(state){
    // Send message to server with new game state

    // If new state is assign, change gameState to "wait" until the server returns the assign_supers_list message. If new state is read, change gameState to "wait" until the server returns the read_supers_list message. 

    if(state=="assign" || state=="read"){
      this.setState({
        gameState:"wait",
        statusText:"Waiting for other players..."
      })
    } else {
      this.setState({
        gameState:state
      })
    }

    var message = {"msg":"change_state", "data":{"state":state}, "error":""}
    socket.send(JSON.stringify(message))

    // Listen for any messages from the server after changing state
    socket.onmessage = function(event){
      if(state=="assign" || state=="read"){
        var response = JSON.parse(event.data);

        // If we're in the assign stage, check if the server has returned a list of supers
        if(response.msg=="assign_supers_list"){
          this.setState({
            gameState: state,
            supers:response.data.supers
          })
        }

        // If we're in the read stage, check if the server has returned a list of supers
        if(response.msg=="read_supers_list"){
          this.setState({
            gameState: state,
            supers:response.data.supers
          })
          console.log("Supers to be read are "+this.state.supers)
        }
      }
    }.bind(this)
  }

  writeSuper(data){
    // Write super to server
    var message = {"msg":"write_supers","data":{"super":data}, "error":""}
    socket.send(JSON.stringify(message))

    socket.onmessage = function(event){
      console.log(event.data)
    }
  }

  assignSuper(player,superText){
    // Assign super to server  
    var message = {"msg":"assign_super","data":{"name":player, "super":superText}, "error":""}
    socket.send(JSON.stringify(message))

    socket.onmessage = function(event){
      console.log(event.data)
    }
  }

  removePlayerNameFromPlayerList(){
    var p = this.state.players
    var n = this.state.playerName
    var index = p.indexOf(n)

    if (index !== -1) {
      p.splice(index, 1);
    }

    return p
  }
}

ReactDOM.render(
  <Application />,
  document.getElementById('root')
);