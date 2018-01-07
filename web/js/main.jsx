import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import {MODAL_STYLE} from './components/ModalStyle.jsx';
import Loader from './components/Loader.jsx';
import * as Menu from './components/Menu.jsx';
import WriteSupers from './components/WriteSupers.jsx';
import AssignSupers from './components/AssignSupers.jsx';
import ReadSupers from './components/ReadSupers.jsx';
import Notifications, {notify} from 'react-notify-toast';
import * as QueryString from 'query-string';


export const TOAST_TIMEOUT = 1500;
const REFRESH_TIMER = 20000;


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
      waitingOnPlayers:[],
      // This will either be "name", "menu", "room", "wait", "write", "assign", "read"
      gameState:"name",
      socket:null,
      supers:[],
      pingInterval: null,
    };

    this.hostGameButtonPressed = this.hostGameButtonPressed.bind(this);
    this.joinGameButtonPressed = this.joinGameButtonPressed.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.continueButtonPressed = this.continueButtonPressed.bind(this);
    this.changeGameState = this.changeGameState.bind(this);
    this.onNameSubmit = this.onNameSubmit.bind(this);
    this.listenForServerMessages = this.listenForServerMessages.bind(this);
    this.ping = this.ping.bind(this);

  }

  render() {
    if(this.state.gameState!="name") var style = {display:'none'}

    return (
      <div>
        <Notifications />

        {this.state.gameState=="wait" ? <div><h1>Waiting on</h1>{this.state.waitingOnPlayers.map(function(player){
return(<div className="custom-button waitingroom">{player}</div>)
}.bind(this))}</div> : null}

        <div style={style} className="vt-center input-group-lg">
            <form onSubmit={this.onNameSubmit}>
                <label style={{display:'block'}}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    value={this.state.playerName}
                    onChange={this.handleNameChange}/>
                </label>
              </form>

          <button
            onClick={this.continueButtonPressed}
            className="custom-button">Continue
          </button>

        </div>

        {this.state.gameState=="menu" ? <Menu.MenuScreen 
          hostGameButtonPressed={this.hostGameButtonPressed}
          joinGameButtonPressed={this.joinGameButtonPressed}/> : null}

        {this.state.showJoinScreen ? <div><ReactModal isOpen={true}
                                                      style={MODAL_STYLE}
                                                      shouldCloseOnOverlayClick={true}><Menu.JoinGame
          gameId={this.state.gameId}
          onChange={function(e){this.handleIdChange(e)}.bind(this)}
          onSubmit={function(data){this.login('join')}.bind(this)}/>
                      </ReactModal></div> : null}

        {this.state.gameState=="room" ? <Menu.WaitingRoom
          players={this.state.players}
          isHost={this.state.isHost}
          gameId={this.state.gameId}
          changeStatus={function(state, statusText){this.changeStatus(state,statusText)}.bind(this)}
          gameState={this.state.gameState}
          changeGameState={function(state){this.changeGameState(state)}.bind(this)}
          TOAST_TIMEOUT={TOAST_TIMEOUT}/> : null}

        {this.state.gameState=="write" ? <WriteSupers
          isHost={this.state.isHost}
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

  componentDidMount(){
    this.setState({pingInterval: setInterval(this.ping, REFRESH_TIMER)});
  }

  componentWillUnmount() {
    this.stopPing()
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
    if(this.state.gameId==""){
      this.setState({
        gameState:"menu"
      })
    } else {
      this.login('join')
    }
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
    const socketType = IS_PROD ? 'wss' : 'ws';
    const socket = type==='host' ? `${socketType}://${location.host}/ws?name=${this.state.playerName}` : `${socketType}://${location.host}/ws?name=${this.state.playerName}&game=${this.state.gameId}`;
    const webSocket = new WebSocket(socket)

    this.setState({
      socket: webSocket
    }, () => {
      this.listenForServerMessages();
    })
  }

  changeGameState(state){
    // Send message to server with new game state

    // If new state is assign, change gameState to "wait" until the server returns the assign_supers_list message. If new state is read, change gameState to "wait" until the server returns the read_supers_list message. 

    var message;

    if(state=="read" || state=="assign"){
      this.setState({
        gameState:"wait"
      })
    } else {
      this.setState({
        gameState:state
      })
    }

    if(state=="assign"){
      message = {"msg":"change_state", "data":{"state":state, "force":1}, "error":""}
      this.state.socket.send(JSON.stringify(message))
    } else {
      message = {"msg":"change_state", "data":{"state":state}, "error":""}
      this.state.socket.send(JSON.stringify(message))
      this.listenForServerMessages()
    }
  }

  ping(){
    console.log("PING!")
    this.state.socket.send(JSON.stringify({"msg":"ping","data":null,"error":null}))
  }

  stopPing() {
    this.state.pingInterval && clearInterval(this.state.pingInterval);
  }

  writeSuper(data){
    // Write super to server
    var message = {"msg":"write_supers","data":{"super":data}, "error":""}
    this.state.socket.send(JSON.stringify(message))

    notify.show("Added! Keep writing...","success",TOAST_TIMEOUT)

    this.listenForServerMessages()
  }

  assignSuper(player,superText){
    // Assign super to server  
    var message = {"msg":"assign_super","data":{"name":player, "super":superText}, "error":""}
    this.state.socket.send(JSON.stringify(message))

    this.listenForServerMessages()
  }

   removePlayerNameFromPlayerList(){
    const {
      players,
      playerName,
    } = this.state;
    return players.filter((p) => {
      return p !== playerName
    })
  }

  listenForServerMessages(){
    // Listen for any messages from the server after changing state
    this.state.socket.onmessage = function(event){
      var response = JSON.parse(event.data);

      if(response.msg=='login'){
        // Assuming success, go to the waiting room or update player list if already in waiting room
        this.setState({
          gameId:response.data.game,
          players:response.data.players,
          gameState:"room",
          showJoinScreen:false,
        })
      }

      if(response.msg=="change_state"){
        var state = response.data.state.toLowerCase()

        if(state=="read" || state=="assign"){
          this.setState({
            gameState:"wait"
          })
        } else {
          this.setState({
            gameState:state
          })
        }
      }

      // If we're in the assign stage, check if the server has returned a list of supers
      if(response.msg=="assign_supers_list"){
        this.setState({
          gameState: "assign",
          supers:response.data.supers
        })
      }

      // If we're in the read stage, check if the server has returned a list of supers
      if(response.msg=="read_supers_list"){
        this.setState({
          gameState: "read",
          supers:response.data.supers
        })
        this.stopPing();
        this.state.socket.close();
        this.state.socket.onclose = function(event){
          console.log("Socket closed!");
        };
        console.log("Supers to be read are "+this.state.supers)
      }

      // If a super is assigned to the user, console log
      if(response.msg=="assign_super"){
        notify.show("Someone assigned you a phrase!","success",TOAST_TIMEOUT)
      }      

      if(response.msg=="waiting_on"){
        this.setState({
          waitingOnPlayers:response.data.players
        })
        console.log("Slackers are "+this.state.waitingOnPlayers)
      }
    }.bind(this)
  }
}

ReactDOM.render(
  <Application />,
  document.getElementById('root')
);