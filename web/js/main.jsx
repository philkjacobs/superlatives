import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import {MODAL_STYLE} from './components/ModalStyle.jsx';
import {MOVE_TO_ASSIGN_MODAL_STYLE} from './components/ModalStyle.jsx';
import {ONBOARDING_MODAL_STYLE} from './components/ModalStyle.jsx';
import Loader from './components/Loader.jsx';
import * as Menu from './components/Menu.jsx';
import WriteSupers from './components/WriteSupers.jsx';
import AssignSupers from './components/AssignSupers.jsx';
import ReadSupers from './components/ReadSupers.jsx';
import FeedbackModal from './components/FeedbackModal.jsx';
import OnboardingModal from './components/OnboardingModal.jsx';
import Notifications, {notify} from 'react-notify-toast';
import * as QueryString from 'query-string';


export const TOAST_TIMEOUT = 3000;
const REFRESH_TIMER = 20000;


class Application extends React.Component {
  constructor(props){
    super(props);

    const params = QueryString.parse(location.search);
    this.state = {
      playerName:"",
      isHost:false,
      showJoinScreen:false,
      showOptionsModal:false,
      statusText:"",
      gameId: params.game !== undefined ? params.game : "",
      players:[],
      waitingOnPlayers:[],
      // This will either be "name", "menu", "room", "wait", "write", "assign", "read"
      gameState:"name",
      socket:null,
      supers:[],
      pingInterval: null,
      showOnboardingModal: false,
      showFeedbackModal: false,
      feedbackMessage:"",
      showSuperWrittenToast:false
    };

    this.hostGameButtonPressed = this.hostGameButtonPressed.bind(this);
    this.joinGameButtonPressed = this.joinGameButtonPressed.bind(this);
    this.optionsButtonPressed = this.optionsButtonPressed.bind(this);
    this.submitFeedbackButtonPressed = this.submitFeedbackButtonPressed.bind(this);
    this.showOnboardingButtonPressed = this.showOnboardingButtonPressed.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.continueButtonPressed = this.continueButtonPressed.bind(this);
    this.changeGameState = this.changeGameState.bind(this);
    this.listenForServerMessages = this.listenForServerMessages.bind(this);
    this.closeJoinModal = this.closeJoinModal.bind(this);
    this.closeOptionsModal = this.closeOptionsModal.bind(this);
    this.closeFeedbackModal = this.closeFeedbackModal.bind(this);
    this.closeOnboardingModal = this.closeOnboardingModal.bind(this);
    this.sendFeedbackToServer = this.sendFeedbackToServer.bind(this);
    this.ping = this.ping.bind(this);
    this.showSuperWrittenToast = this.showSuperWrittenToast.bind(this);
    this.onNameSubmit = this.onNameSubmit.bind(this);

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

        {this.state.showSuperWrittenToast ? <div className="added-toast">Added! Keep writing...</div> : null}

        {this.state.gameState=="menu" ? <Menu.MenuScreen 
          hostGameButtonPressed={this.hostGameButtonPressed}
          joinGameButtonPressed={this.joinGameButtonPressed}/> : null}

        {this.state.showJoinScreen ? <div><ReactModal isOpen={true}
                                                      onRequestClose={this.closeJoinModal}
                                                      style={MOVE_TO_ASSIGN_MODAL_STYLE}
                                                      shouldCloseOnOverlayClick={true}><Menu.JoinGame
          gameId={this.state.gameId}
          onChange={function(e){this.handleIdChange(e)}.bind(this)}
          onSubmit={function(data){this.login('join')}.bind(this)}
          closeModal={this.closeJoinModal}/>
                      </ReactModal></div> : null}

        {this.state.showOptionsModal ? <div><ReactModal isOpen={true}
                                                      onRequestClose={this.closeOptionsModal}
                                                      style={MOVE_TO_ASSIGN_MODAL_STYLE}
                                                      shouldCloseOnOverlayClick={true}>
                                                      <button className="custom-button modal"
                                                              onClick={this.submitFeedbackButtonPressed}>Submit feedback</button>
                                                      <button className="custom-button modal"
                                                              onClick={this.showOnboardingButtonPressed}>Learn the game</button>
                      </ReactModal></div> : null}

        {this.state.showOnboardingModal ? <div><ReactModal isOpen={true}
                                                      onRequestClose={this.closeOnboardingModal}
                                                      style={ONBOARDING_MODAL_STYLE}
                                                      shouldCloseOnOverlayClick={true}>
                                                      <OnboardingModal />
                                                      
                      </ReactModal></div> : null}

        {this.state.showFeedbackModal ? <div><ReactModal isOpen={true}
                                                      onRequestClose={this.closeFeedbackModal}
                                                      style={MOVE_TO_ASSIGN_MODAL_STYLE}
                                                      shouldCloseOnOverlayClick={true}>
                                                      <FeedbackModal
          feedbackMessage={this.state.feedbackMessage}
          onChange={function(e){this.handleFeedbackTextChange(e)}.bind(this)}
          onSubmit={function(data){this.sendFeedbackToServer(data)}.bind(this)} />
                                                      
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

          
          
            <div className="help-box" onClick={this.optionsButtonPressed}>?</div>

          
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

  handleIdChange(e){
    this.setState({
      gameId: e.target.value
    });
  }

  handleFeedbackTextChange(e){
    this.setState({
      feedbackMessage:e.target.value
    });
  }

  onNameSubmit(e){     
    e.preventDefault();       
    document.activeElement.blur();               
    this.continueButtonPressed();     
  }


  continueButtonPressed(){
    // Check for no name
    if(this.state.playerName==""){
      notify.show("Please enter a name.","error",TOAST_TIMEOUT)
    } else {
      if(this.state.gameId==""){
        this.setState({
          gameState:"menu"
        })
      } else {
      this.login('join')
      }
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

  optionsButtonPressed(){
    this.setState({
      showOptionsModal:true
    });
  }

  submitFeedbackButtonPressed(){
    this.setState({
      showOptionsModal: false,
      showFeedbackModal:true
    })
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

  closeJoinModal(){
    this.setState({showJoinScreen:false})
  }

  closeOptionsModal(){
    this.setState({showOptionsModal:false})
  }

  closeFeedbackModal(){
    this.setState({
      showFeedbackModal:false,
      feedbackMessage:""
    });
  }

  closeOnboardingModal(){
    this.setState({
      showOnboardingModal: false,
      showOptionsModal: false
    })
  }

  showOnboardingButtonPressed(){
    this.setState({showOnboardingModal:true})
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

    this.showSuperWrittenToast()
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

  showSuperWrittenToast(){
    console.log("SHOW TOAST!")
    this.setState({showSuperWrittenToast:true})

    setTimeout(function() { this.setState({showSuperWrittenToast: false}); }.bind(this), 1000);
  }

  listenForServerMessages(){
    // Listen for any messages from the server after changing state
    this.state.socket.onmessage = function(event){
      var response = JSON.parse(event.data);

      if(response.error){
        notify.show(response.error,"error",TOAST_TIMEOUT)
      }

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
        this.setState({gameId:""})
        this.state.socket.onclose = function(event){
          console.log("Socket closed!");
        };
        console.log("Supers to be read are "+this.state.supers)
      }

      // If a super is assigned to the user, console log
      if(response.msg=="assign_super"){
        notify.show("Someone assigned you an award!","success",TOAST_TIMEOUT)
      }      

      if(response.msg=="waiting_on"){
        this.setState({
          waitingOnPlayers:response.data.players
        })
        console.log("Slackers are "+this.state.waitingOnPlayers)
      }
    }.bind(this)
  }

  sendFeedbackToServer(message){
    var url = "https://super-latives.herokuapp.com/feedback";
    var params = "feedback="+message;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.onreadystatechange = function () {
      if(xhr.readyState === 4) {
        notify.show("Feedback submitted, thank you!","success",TOAST_TIMEOUT)
      } else {
        notify.show("Error sending feedback.","error",TOAST_TIMEOUT)
      }
    };

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.send(params);
  }
}

ReactDOM.render(
  <Application />,
  document.getElementById('root')
);